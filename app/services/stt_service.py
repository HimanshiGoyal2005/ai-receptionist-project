import os
from groq import Groq
from app.config import get_settings

settings = get_settings()

client = Groq(
    api_key=settings.groq_api_key
)


def transcribe_audio(audio_path: str) -> str:
    with open(audio_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3"
        )

    return transcription.text