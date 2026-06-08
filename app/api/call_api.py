import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
from app.models.conversation import Conversation
from app.models.appointment import Appointment
from app.models.call_log import CallLog
from app.services.stt_service import transcribe_audio
from app.services.llm_service import get_llm_response
from app.services.tts_service import text_to_speech
from app.utils.logger import get_logger

logger = get_logger("call_api")
router = APIRouter(prefix="/api/call", tags=["Call Processing"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/process")
async def process_call(
    audio: UploadFile = File(...),
    db: Session = Depends(get_db)
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

        # Step D: Lead Auto-Save
        if extracted.get("name") and extracted.get("phone"):
            existing_lead = db.query(Lead).filter(
                Lead.phone == extracted["phone"]
            ).first()

            if existing_lead:
                for field in ["name", "email", "requirement", "budget", "timeline"]:
                    if extracted.get(field):
                        setattr(existing_lead, field, extracted[field])
                db.commit()
                db.refresh(existing_lead)
                lead_id = existing_lead.id
            else:
                new_lead = Lead(
                    name=extracted.get("name"),
                    phone=extracted.get("phone"),
                    email=extracted.get("email"),
                    requirement=extracted.get("requirement"),
                    budget=extracted.get("budget"),
                    timeline=extracted.get("timeline"),
                    status="new",
                    source="ai_call"
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
            sentiment="neutral"
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
                status="pending"
            )
            db.add(appointment)
            db.commit()
            db.refresh(appointment)
            appointment_id = appointment.id

        # Step G: Call Log Save
        call_log = CallLog(
            lead_id=lead_id,
            recording_url=f"/static/uploads/{filename}",
            status="completed"
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