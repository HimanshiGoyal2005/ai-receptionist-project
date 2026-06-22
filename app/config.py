from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    debug: bool = True
    database_url: str = "postgresql://postgres:pg_password@localhost:5432/receptionist_db"
    openai_api_key: str = ""
    elevenlabs_api_key: str = ""
    groq_api_key: str = ""          # ✅ Ye add karo
    jwt_secret: str = "supersecretkey123"
    jwt_algorithm: str = "HS256"
    google_client_id: str =""
    google_client_secret: str=""
    class Config:
        # Point to the .env located inside the app package so loading works
        # regardless of the current working directory when the server starts.
        env_file = str(Path(__file__).parent / ".env")


@lru_cache()
def get_settings():
    s = Settings()
    # Strip common API key/env values to avoid accidental whitespace issues
    for attr in ("openai_api_key", "elevenlabs_api_key", "groq_api_key"):
        val = getattr(s, attr, None)
        if isinstance(val, str):
            setattr(s, attr, val.strip())
    return s