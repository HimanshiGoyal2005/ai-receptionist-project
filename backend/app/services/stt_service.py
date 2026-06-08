import os
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def transcribe_audio(file_path: str) -> str:
    """
    Convert audio file to text using OpenAI Whisper
    """
    try:
        with open(file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
            )
        return transcript.text
    except Exception as e:
        print(f"STT Error: {e}")
        return f"Error transcribing audio: {str(e)}"

async def transcribe_audio_bytes(audio_bytes: bytes, filename: str = "audio.wav") -> str:
    """
    Convert audio bytes to text (for uploaded files)
    """
    try:
        import io
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename
        
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
        )
        return transcript.text
    except Exception as e:
        print(f"STT Error: {e}")
        return f"Error transcribing audio: {str(e)}"