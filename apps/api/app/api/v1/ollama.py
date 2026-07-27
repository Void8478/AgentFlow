from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import json
from app.services.ollama_service import ollama_service, OllamaServiceError
from app.domain.ollama_schemas import (
    OllamaModelInfo,
    OllamaGenerateRequest,
    OllamaChatRequest,
)

router = APIRouter(prefix="/ollama", tags=["Ollama Engine"])


@router.get("/models", response_model=List[OllamaModelInfo])
async def list_installed_models():
    """
    List all local Ollama models installed on the host machine.
    """
    return await ollama_service.list_models()


@router.post("/generate")
async def generate_completion(request: OllamaGenerateRequest):
    """
    Single completion endpoint with configurable timeout.
    """
    try:
        return await ollama_service.generate_completion(request)
    except OllamaServiceError as err:
        raise HTTPException(status_code=504, detail=str(err))


@router.post("/chat/stream")
async def stream_chat_tokens(request: OllamaChatRequest):
    """
    Real-time token streaming endpoint via SSE (Server-Sent Events) / NDJSON.
    Supports Cancellation and Custom Timeouts.
    """

    async def event_generator():
        async for chunk in ollama_service.stream_chat(request):
            yield f"data: {json.dumps(chunk.model_dump())}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
