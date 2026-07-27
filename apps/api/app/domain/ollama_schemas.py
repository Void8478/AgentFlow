from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class OllamaMessage(BaseModel):
    role: str = Field(..., description="Message role: system, user, or assistant")
    content: str = Field(..., description="Content text of the message")


class OllamaChatRequest(BaseModel):
    model: Optional[str] = Field(None, description="Ollama model identifier")
    messages: List[OllamaMessage] = Field(..., description="Chat message history")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0)
    system_prompt: Optional[str] = Field(None, description="Optional system directive")
    timeout: Optional[float] = Field(60.0, description="Response timeout in seconds")


class OllamaGenerateRequest(BaseModel):
    model: Optional[str] = Field(None, description="Ollama model identifier")
    prompt: str = Field(..., description="Generation prompt string")
    system: Optional[str] = Field(None, description="System directive prompt")
    temperature: Optional[float] = Field(0.7, ge=0.0, le=1.0)
    timeout: Optional[float] = Field(60.0, description="Response timeout in seconds")


class OllamaStreamChunk(BaseModel):
    model: str
    content: str
    done: bool = False
    error: Optional[str] = None


class OllamaModelDetails(BaseModel):
    parent_model: Optional[str] = ""
    format: Optional[str] = ""
    family: Optional[str] = ""
    parameter_size: Optional[str] = ""
    quantization_level: Optional[str] = ""


class OllamaModelInfo(BaseModel):
    name: str
    modified_at: str
    size: int
    details: Optional[OllamaModelDetails] = None
