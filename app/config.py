from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    debug: bool = True
    database_url: str = "sqlite:///./receptionist.db"
    openai_api_key: str = ""
    elevenlabs_api_key: str = ""
    groq_api_key: str = ""          # ✅ Ye add karo
    jwt_secret: str = "supersecretkey123"
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()