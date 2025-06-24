import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # Database
    database_url: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/edupresent")

    # API Keys
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Media Storage
    upload_path: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: set = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov", ".avi"}

    # AI Settings
    default_model: str = "gpt-4"
    max_tokens: int = 2000
    temperature: float = 0.7

    class Config:
        env_file = ".env"


settings = Settings()