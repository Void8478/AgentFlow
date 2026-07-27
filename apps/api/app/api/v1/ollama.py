from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import json
from app.services.ollama_service import ollama_service
from app.services.ai_providers.factory import ai_provider
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
    Single completion endpoint using active AI provider with configurable timeout.
    """
    try:
        res = await ai_provider.generate_completion(
            prompt=request.prompt,
            system_prompt=request.system,
            model=request.model,
            temperature=request.temperature or 0.7,
            json_output=False,
            timeout=request.timeout,
        )
        return {"response": res}
    except Exception as err:
        raise HTTPException(status_code=504, detail=str(err))


@router.post("/chat/stream")
async def stream_chat_tokens(request: OllamaChatRequest):
    """
    Real-time token streaming endpoint via SSE (Server-Sent Events) / NDJSON.
    Supports Cancellation and Custom Timeouts using active AI provider.
    """

    async def event_generator():
        msgs = [{"role": m.role, "content": m.content} for m in request.messages]
        async for chunk in ai_provider.stream_chat(
            messages=msgs,
            system_prompt=request.system_prompt,
            model=request.model,
            temperature=request.temperature or 0.7,
            timeout=request.timeout,
        ):
            yield f"data: {json.dumps(chunk)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
