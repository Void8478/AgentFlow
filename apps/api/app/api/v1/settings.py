from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/settings", tags=["Settings & Config"])


class UserSettingsSchema(BaseModel):
    theme: str = Field("dark", description="UI theme: dark, vercel, linear")
    ollama_host: str = Field("http://localhost:11434", description="Ollama server host URL")
    default_model: str = Field("llama3:latest", description="Default model for agent execution")
    temperature: float = Field(0.70, ge=0.0, le=1.0, description="Model generation temperature")
    max_tokens: int = Field(4096, ge=256, le=16384, description="Maximum token limit")
    enable_streaming: bool = Field(True, description="Enable real-time token streaming")
    enable_memory: bool = Field(True, description="Enable ChromaDB vector memory retention")
    auto_save: bool = Field(True, description="Automatically save workflow state changes")
    full_name: Optional[str] = Field("Principal AI Engineer", description="User display name")
    email: Optional[str] = Field("user@agentflow.dev", description="User account email")


# In-memory settings store
DEFAULT_USER_SETTINGS = UserSettingsSchema()


@router.get("", response_model=UserSettingsSchema)
async def get_user_settings():
    """
    Returns current user settings and configuration preferences.
    """
    return DEFAULT_USER_SETTINGS


@router.put("", response_model=UserSettingsSchema)
async def update_user_settings(new_settings: UserSettingsSchema):
    """
    Updates user settings and model execution configuration.
    """
    global DEFAULT_USER_SETTINGS
    DEFAULT_USER_SETTINGS = new_settings
    return DEFAULT_USER_SETTINGS
