import os
import uuid
from elevenlabs import ElevenLabs
from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger("tts_service")
settings = get_settings()

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)


def text_to_speech(text: str) -> str:
    try:
        client = ElevenLabs(api_key=settings.elevenlabs_api_key)

        audio = client.text_to_speech.convert(
            text=text,
            voice_id="pNInz6obpgDQGcFmaJgB",  # Adam — free voice
            model_id="eleven_turbo_v2_5"
        )

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)

        with open(filepath, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        audio_url = f"/static/audio/{filename}"
        logger.info(f"TTS generated: {audio_url}")
        return audio_url

    except Exception as e:
        logger.error(f"TTS failed: {str(e)}")
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(b"")
        return f"/static/audio/{filename}"