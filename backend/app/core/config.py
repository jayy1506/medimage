from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002"

    # Hosted PostgreSQL Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres"
    DIRECT_DATABASE_URL: str = ""

    # Firebase Admin SDK & Web Auth
    FIREBASE_SERVICE_ACCOUNT_B64: str = ""
    FIREBASE_PROJECT_ID: str = "medimage-ca668"
    FIREBASE_API_KEY: str = "AIzaSyCQIR2rT9Qh8hAbBmde309nLeB7ZigVKqc"

    # Upstash Redis
    UPSTASH_REDIS_REST_URL: str = ""
    UPSTASH_REDIS_REST_TOKEN: str = ""

    # AI LLM Keys
    GEMINI_API_KEY: str = ""
    GEMINI_API_KEYS: str = ""
    GROQ_API_KEY: str = ""

    # Sentry Monitoring
    SENTRY_DSN: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def gemini_keys_list(self) -> List[str]:
        keys = [k.strip() for k in self.GEMINI_API_KEYS.split(",") if k.strip()]
        if not keys and self.GEMINI_API_KEY:
            keys.append(self.GEMINI_API_KEY.strip())
        return keys

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
