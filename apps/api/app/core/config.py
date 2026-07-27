from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "AgentFlow API Engine"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "0.1.0"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

    # Ollama Settings
    OLLAMA_HOST: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "llama3:latest"

    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # AI Provider Settings
    AI_PROVIDER: str = "ollama"  # "ollama" or "gemini"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # ChromaDB Settings
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000
    CHROMADB_PERSIST_DIR: str = "./chroma_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
