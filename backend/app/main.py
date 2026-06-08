from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import urllib.parse

from app.services.stt_service import transcribe_audio_bytes
from app.services.llm_service import get_ai_response
from app.services.tts_service import text_to_speech

app = FastAPI(title="AI Voice Receptionist", version="1.0.0")

# CORS Middleware — React se requests accept karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═════════════════════════════════════════════════════════════
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI Receptionist API running!"}

# ═════════════════════════════════════════════════════════════
# STT ENDPOINT
# ═════════════════════════════════════════════════════════════
@app.post("/api/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    """
    Convert audio file to text
    """
    try:
        audio_bytes = await audio.read()
        transcript = await transcribe_audio_bytes(audio_bytes, audio.filename)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═════════════════════════════════════════════════════════════
# CHAT/LLM ENDPOINT
# ═════════════════════════════════════════════════════════════
@app.post("/api/chat")
async def chat(request: dict):
    """
    Process text through LLM
    Input: {"transcript": "...", "history": [...]}
    """
    try:
        transcript = request.get("transcript", "")
        history = request.get("history", [])
        
        if not transcript:
            raise HTTPException(status_code=400, detail="Transcript is required")
        
        response = await get_ai_response(transcript, history)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═════════════════════════════════════════════════════════════
# TTS ENDPOINT
# ═════════════════════════════════════════════════════════════
@app.post("/api/tts")
async def text_to_voice(request: dict):
    """
    Convert text to speech
    Input: {"text": "..."}
    Returns: MP3 audio file
    """
    try:
        text = request.get("text", "")
        
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        audio_bytes = await text_to_speech(text)

        if not audio_bytes:
            raise HTTPException(
                status_code=500,
                detail="TTS generation failed. No audio was returned. Check backend logs and OpenAI quota."
            )

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=reply.mp3",
                "Content-Length": str(len(audio_bytes)),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tts")
async def text_to_voice_get(text: str):
    return await text_to_voice({"text": text})

# ═════════════════════════════════════════════════════════════
# MAIN PIPELINE ENDPOINT
# ═════════════════════════════════════════════════════════════
@app.post("/api/call/process")
async def process_audio_call(audio: UploadFile = File(...)):
    """
    Complete pipeline: Audio → STT → LLM → TTS → Response
    """
    try:
        # Step 1: STT - Audio to Text
        audio_bytes = await audio.read()
        transcript = await transcribe_audio_bytes(audio_bytes, audio.filename)
        
        if not transcript or "Error" in transcript:
            raise HTTPException(status_code=400, detail=f"STT failed: {transcript}")
        
        # Step 2: LLM - Process transcript
        llm_response = await get_ai_response(transcript)
        ai_reply = llm_response.get("reply", "")
        intent = llm_response.get("intent", "")
        
        # Avoid duplicate TTS generation here; frontend can request audio from /api/tts
        audio_url = None
        if ai_reply:
            audio_url = "/api/tts?text=" + urllib.parse.quote(ai_reply)
        
        return {
            "transcript": transcript,
            "ai_reply": ai_reply,
            "intent": intent,
            "audio_url": audio_url,
            "extracted_data": llm_response.get("extracted_data", {})
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═════════════════════════════════════════════════════════════
# RUN SERVER
# ═════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)