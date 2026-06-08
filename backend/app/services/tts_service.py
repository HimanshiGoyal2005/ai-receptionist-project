from gtts import gTTS
import io

async def text_to_speech(text: str) -> bytes:
    try:
        tts = gTTS(text=text, lang='en', slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return audio_buffer.read()
    except Exception as e:
        print(f"TTS Error: {e}")
        return b""