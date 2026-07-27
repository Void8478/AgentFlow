from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from typing import List
import json
import logging
from app.core.config import settings
from app.services.ai_providers.factory import ai_provider
from app.domain.ai_schemas import (
    AIModelInfo,
    AIRequest,
    AIResponse,
    StreamingRequest,
    StreamingResponse,
)

logger = logging.getLogger("agentflow.api.v1.ai")

# Primary Router for the generic AI Engine
router = APIRouter(prefix="/ai", tags=["AI Engine"])

# Legacy Router for backwards compatibility aliases
legacy_router = APIRouter(prefix="/ollama", tags=["AI Engine"])


async def execute_generate(request: AIRequest) -> AIResponse:
    try:
        logger.info(f"AI Generate Completion - Provider: {settings.AI_PROVIDER}, Model: {request.model or ai_provider.default_model}")
        res = await ai_provider.generate_completion(
            prompt=request.prompt,
            system_prompt=request.system,
            model=request.model,
            temperature=request.temperature or 0.7,
            json_output=False,
            timeout=request.timeout,
        )
        return AIResponse(response=res)
    except Exception as err:
        logger.error(f"Generation error under provider {settings.AI_PROVIDER}: {err}")
        raise HTTPException(status_code=502, detail=f"Generation failed: {str(err)}")


async def execute_stream_chat(request: StreamingRequest) -> FastAPIStreamingResponse:
    logger.info(f"AI Stream Chat - Provider: {settings.AI_PROVIDER}, Model: {request.model or ai_provider.default_model}")
    
    async def event_generator():
        msgs = [{"role": m.role, "content": m.content} for m in request.messages]
        async for chunk in ai_provider.stream_chat(
            messages=msgs,
            system_prompt=request.system_prompt,
            model=request.model,
            temperature=request.temperature or 0.7,
            timeout=request.timeout,
        ):
            # Validate output matches StreamingResponse structure
            validated_chunk = StreamingResponse(
                model=chunk.get("model", request.model or ai_provider.default_model),
                content=chunk.get("content", ""),
                done=chunk.get("done", False),
                error=chunk.get("error"),
            )
            yield f"data: {json.dumps(validated_chunk.model_dump())}\n\n"

    return FastAPIStreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


async def execute_list_models() -> List[AIModelInfo]:
    provider_name = settings.AI_PROVIDER.lower().strip()
    if provider_name == "gemini":
        return [
            AIModelInfo(
                name=settings.GEMINI_MODEL,
                modified_at="active",
                size=0,
            )
        ]
    else:
        # Query models from OllamaProvider if supported
        if hasattr(ai_provider, "list_models"):
            try:
                models = await ai_provider.list_models()
                res = []
                for item in models:
                    res.append(
                        AIModelInfo(
                            name=item.get("name", ""),
                            modified_at=item.get("modified_at", "local"),
                            size=item.get("size", 0),
                        )
                    )
                return res
            except Exception as err:
                logger.error(f"Error querying Ollama models: {err}")
        return [
            AIModelInfo(
                name=settings.OLLAMA_DEFAULT_MODEL,
                modified_at="local",
                size=0,
            )
        ]


# --- New Generic AI Endpoints ---

@router.get("/models", response_model=List[AIModelInfo])
async def list_models():
    """
    List available models for the active AI Provider (Gemini or Ollama).
    """
    return await execute_list_models()


@router.post("/generate", response_model=AIResponse)
async def generate_completion(request: AIRequest):
    """
    Generate completion using the active AI Provider.
    """
    return await execute_generate(request)


@router.post("/chat/stream")
async def stream_chat_tokens(request: StreamingRequest):
    """
    Stream chat tokens using the active AI Provider.
    """
    return await execute_stream_chat(request)


# --- Legacy Backwards Compatibility Endpoints ---

@legacy_router.get("/models", response_model=List[AIModelInfo], deprecated=True)
async def legacy_list_models():
    """
    [Deprecated] List models. Use /api/v1/ai/models instead.
    """
    return await execute_list_models()


@legacy_router.post("/generate", response_model=AIResponse, deprecated=True)
async def legacy_generate_completion(request: AIRequest):
    """
    [Deprecated] Generate completion. Use /api/v1/ai/generate instead.
    """
    return await execute_generate(request)


@legacy_router.post("/chat/stream", deprecated=True)
async def legacy_stream_chat_tokens(request: StreamingRequest):
    """
    [Deprecated] Stream chat. Use /api/v1/ai/chat/stream instead.
    """
    return await execute_stream_chat(request)
