import os
import re
import uuid
import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
from app.models.conversation import Conversation
from app.models.appointment import Appointment
from app.models.call_log import CallLog
from app.models.user import User  # 🌟 Imported User model reference
from app.api.auth_api import get_current_user  # 🔒 Imported authentication dependency
from app.services.stt_service import transcribe_audio
from app.services.llm_service import get_llm_response, normalize_lead_data, get_sales_response
from app.services.tts_service import text_to_speech
from app.services.automation_service import send_whatsapp_followup, send_email_followup, generate_google_calendar_link
from app.utils.logger import get_logger

logger = get_logger("call_api")
router = APIRouter(prefix="/api/call", tags=["Call Processing"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

WEEKDAY_MAP = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}


def find_next_weekday(base_date: datetime, weekday_name: str) -> datetime:
    target = WEEKDAY_MAP.get(weekday_name.lower())
    if target is None:
        return base_date
    days_ahead = target - base_date.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    return base_date + timedelta(days=days_ahead)


def parse_appointment_from_transcript(transcript: str):
    text = transcript.lower()
    appointment_date = None
    appointment_time = None

    time_match = re.search(r"\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)\b", text)
    if time_match:
        hour = int(time_match.group(1))
        minute = int(time_match.group(2) or "0")
        suffix = time_match.group(3)
        if suffix == "pm" and hour != 12:
            hour += 12
        if suffix == "am" and hour == 12:
            hour = 0
        appointment_time = f"{hour:02d}:{minute:02d}"
    elif re.search(r"\bnoon\b", text):
        appointment_time = "12:00"
    elif re.search(r"\bafternoon\b", text):
        appointment_time = "15:00"
    elif re.search(r"\bevening\b", text):
        appointment_time = "18:00"

    if "next monday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "monday").date()
    elif "next tuesday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "tuesday").date()
    elif "next wednesday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "wednesday").date()
    elif "next thursday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "thursday").date()
    elif "next friday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "friday").date()
    elif "next saturday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "saturday").date()
    elif "next sunday" in text:
        appointment_date = find_next_weekday(datetime.utcnow(), "sunday").date()
    elif "tomorrow" in text:
        appointment_date = (datetime.utcnow() + timedelta(days=1)).date()
    elif "today" in text:
        appointment_date = datetime.utcnow().date()
    else:
        for name in WEEKDAY_MAP.keys():
            if re.search(fr"\b{name}\b", text):
                appointment_date = find_next_weekday(datetime.utcnow(), name).date()
                break

    if appointment_date:
        appointment_date = appointment_date.strftime("%Y-%m-%d")
    return appointment_date, appointment_time


@router.post("/process")
async def process_call(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Injected Auth Shield here
):
    lead_id = None
    appointment_id = None

    try:
        # Step A: Audio Save
        ext = audio.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as f:
            content = await audio.read()
            f.write(content)

        logger.info(f"Audio saved: {filepath}")

        # Step B: STT
        transcript = transcribe_audio(filepath)
        logger.info(f"Transcript: {transcript}")

        # Step C: LLM
        llm_result = get_llm_response(transcript)
        ai_reply = llm_result["reply"]
        extracted = llm_result.get("extracted_data", {})
        extracted = normalize_lead_data(extracted)
        extracted["lead_score"] = llm_result.get("lead_score", extracted.get("lead_score", "Cold Lead"))

        parsed_date, parsed_time = parse_appointment_from_transcript(transcript)
        if not extracted.get("appointment_date") and parsed_date:
            extracted["appointment_date"] = parsed_date
        if not extracted.get("appointment_time") and parsed_time:
            extracted["appointment_time"] = parsed_time
        if (
            extracted.get("appointment_date")
            and extracted.get("appointment_time")
            and extracted.get("intent") != "appointment"
        ):
            extracted["intent"] = "appointment"

        # Step D: Lead Auto-Save
        if extracted.get("name") and extracted.get("phone"):
            # 🌟 Updated query: Ensure validation checks only cross-reference records belonging to this company space
            existing_lead = db.query(Lead).filter(
                Lead.phone == extracted["phone"],
                Lead.company_id == current_user.company_id
            ).first()

            if existing_lead:
                for field in [
                    "name",
                    "email",
                    "requirement",
                    "budget",
                    "timeline",
                    "team_size",
                    "industry",
                    "lead_score",
                ]:
                    if extracted.get(field):
                        setattr(existing_lead, field, extracted[field])
                db.commit()
                db.refresh(existing_lead)
                lead_id = existing_lead.id
            else:
                new_lead = Lead(
                    **{k: extracted.get(k) for k in ["name", "phone", "email", "requirement", "budget", "timeline", "team_size", "industry", "lead_score"]},
                    status="new",
                    source="ai_call",
                    user_id=current_user.id,  # 🌟 Dynamic association added
                    company_id=current_user.company_id  # 🌟 Dynamic association added
                )
                db.add(new_lead)
                db.commit()
                db.refresh(new_lead)
                lead_id = new_lead.id

        # Step E: Conversation Save
        conversation = Conversation(
            lead_id=lead_id,
            transcript=transcript,
            ai_summary=extracted.get("ai_summary", ai_reply[:100]),
            intent=extracted.get("intent", "general"),
            sentiment="neutral",
            user_id=current_user.id,  # 🌟 Dynamic association added
            company_id=current_user.company_id  # 🌟 Dynamic association added
        )
        db.add(conversation)
        db.commit()

        # Step F: Appointment Auto-Book
        if (
            extracted.get("intent") == "appointment"
            and extracted.get("appointment_date")
            and extracted.get("appointment_time")
        ):
            appointment = Appointment(
                lead_id=lead_id,
                appointment_date=extracted["appointment_date"],
                appointment_time=extracted["appointment_time"],
                status="pending",
                user_id=current_user.id,  # 🌟 Dynamic association added
                company_id=current_user.company_id  # 🌟 Dynamic association added
            )
            db.add(appointment)
            db.commit()
            db.refresh(appointment)
            appointment_id = appointment.id

            try:
                generate_google_calendar_link(extracted)
                if extracted.get("phone"):
                    send_whatsapp_followup(extracted["phone"], extracted)
                if extracted.get("email"):
                    send_email_followup(extracted["email"], extracted)
            except Exception as automation_err:
                logger.error(f"Appointment automation failed: {automation_err}")

        # Step G: Call Log Save
        call_log = CallLog(
            lead_id=lead_id,
            recording_url=f"/static/uploads/{filename}",
            status="completed",
            user_id=current_user.id,  # 🌟 Dynamic association added
            company_id=current_user.company_id  # 🌟 Dynamic association added
        )
        db.add(call_log)
        db.commit()

        # Step H: TTS
        audio_url = text_to_speech(ai_reply)

        return {
            "success": True,
            "transcript": transcript,
            "ai_reply": ai_reply,
            "audio_url": audio_url,
            "lead_id": lead_id,
            "appointment_id": appointment_id,
            "extracted_data": extracted
        }

    except Exception as e:
        logger.error(f"Call processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ═════════════════════════════════════════════════════════════
# 🤖 UPGRADED TEXT-BASED SALES AGENT INTERFACE CHANNEL
# ═════════════════════════════════════════════════════════════
@router.post("/chat")
async def sales_agent_text_chat(
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Secured route endpoint injection
):
    try:
        body = await request.json()
        transcript = body.get("message", "").strip()
        conversation_history = body.get("history", [])

        if not transcript:
            raise HTTPException(status_code=400, detail="Message context token is empty")

        sales_data = get_sales_response(transcript, conversation_history)
        extracted = sales_data.get("extracted_data", {})
        
        return {
            "reply": sales_data.get("reply", ""),
            "stage": sales_data.get("stage", "QUALIFICATION"),
            "detected_language": sales_data.get("detected_language", "English"),
            "suggested_plan": sales_data.get("suggested_plan", None),
            "handoff_triggered": sales_data.get("handoff_triggered", False),
            "extracted_data": extracted
        }

    except Exception as err:
        logger.error(f"Sales Agent text workspace pipeline dropped: {str(err)}")
        raise HTTPException(status_code=500, detail=str(err))