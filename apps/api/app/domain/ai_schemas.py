from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AIMessage(BaseModel):
    role: str = Field(..., description="Message role: system, user, or model/assistant")
    content: str = Field(..., description="Content text of the message")

class AIChatRequest(BaseModel):
    model: Optional[str] = Field(None, description="Model identifier override")
    messages: List[AIMessage] = Field(..., description="Chat message history")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0)
    system_prompt: Optional[str] = Field(None, description="Optional system directive")
    timeout: Optional[float] = Field(60.0, description="Response timeout in seconds")

class AIGenerateRequest(BaseModel):
    model: Optional[str] = Field(None, description="Model identifier override")
    prompt: str = Field(..., description="Generation prompt string")
    system: Optional[str] = Field(None, description="System directive prompt")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0)
    timeout: Optional[float] = Field(60.0, description="Response timeout in seconds")

class AIStreamChunk(BaseModel):
    model: str
    content: str
    done: bool = False
    error: Optional[str] = None

class AIModelDetails(BaseModel):
    parent_model: Optional[str] = ""
    format: Optional[str] = ""
    family: Optional[str] = ""
    parameter_size: Optional[str] = ""
    quantization_level: Optional[str] = ""

class AIModelInfo(BaseModel):
    name: str
    modified_at: str
    size: int
    details: Optional[AIModelDetails] = None
