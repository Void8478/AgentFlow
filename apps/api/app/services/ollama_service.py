import asyncio
import json
import logging
from typing import AsyncGenerator, List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.domain.ollama_schemas import (
    OllamaChatRequest,
    OllamaGenerateRequest,
    OllamaStreamChunk,
    OllamaModelInfo,
)

logger = logging.getLogger("agentflow.services.ollama")


class OllamaServiceError(Exception):
    """Custom exception raised during Ollama operations."""
    pass


class OllamaService:
    def __init__(self, host: Optional[str] = None, default_model: Optional[str] = None):
        self.host = host or settings.OLLAMA_HOST
        self.default_model = default_model or settings.DEFAULT_MODEL

    async def list_models(self) -> List[OllamaModelInfo]:
        """
        Lists all locally installed Ollama models from the host.
        """
        url = f"{self.host}/api/tags"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)
                res.raise_for_status()
                data = res.json()
                models = []
                for item in data.get("models", []):
                    models.append(
                        OllamaModelInfo(
                            name=item.get("name", ""),
                            modified_at=item.get("modified_at", ""),
                            size=item.get("size", 0),
                            details=item.get("details"),
                        )
                    )
                return models
        except httpx.HTTPError as err:
            logger.error(f"Failed to query Ollama models: {err}")
            return [
                OllamaModelInfo(
                    name=self.default_model,
                    modified_at="offline",
                    size=0,
                )
            ]

    async def stream_chat(
        self, req: OllamaChatRequest
    ) -> AsyncGenerator[OllamaStreamChunk, None]:
        """
        Streams chat responses token-by-token with cancellation and timeout support.
        """
        model_name = req.model or self.default_model
        url = f"{self.host}/api/chat"

        messages = [msg.model_dump() for msg in req.messages]
        if req.system_prompt:
            messages.insert(0, {"role": "system", "content": req.system_prompt})

        payload = {
            "model": model_name,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": req.temperature,
            },
        }

        timeout_config = httpx.Timeout(req.timeout or 60.0, connect=5.0)

        try:
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                async with client.stream("POST", url, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue

                        chunk_data = json.loads(line)
                        content = chunk_data.get("message", {}).get("content", "")
                        done = chunk_data.get("done", False)

                        yield OllamaStreamChunk(
                            model=model_name,
                            content=content,
                            done=done,
                        )

                        if done:
                            break

        except asyncio.CancelledError:
            logger.warning(f"Ollama stream_chat cancelled for model {model_name}.")
            raise

        except httpx.TimeoutException:
            logger.error(f"Ollama request timed out after {req.timeout} seconds.")
            yield OllamaStreamChunk(
                model=model_name,
                content="",
                done=True,
                error=f"Timeout error: Request exceeded {req.timeout}s limit.",
            )

        except Exception as err:
            logger.error(f"Error during Ollama stream: {err}")
            yield OllamaStreamChunk(
                model=model_name,
                content="",
                done=True,
                error=str(err),
            )

    async def generate_completion(self, req: OllamaGenerateRequest) -> Dict[str, Any]:
        """
        Single non-streaming completion with timeout handling.
        """
        model_name = req.model or self.default_model
        url = f"{self.host}/api/generate"

        payload = {
            "model": model_name,
            "prompt": req.prompt,
            "system": req.system,
            "stream": False,
            "options": {
                "temperature": req.temperature,
            },
        }

        timeout_config = httpx.Timeout(connect=5.0, read=req.timeout or 60.0)

        try:
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                return res.json()
        except httpx.TimeoutException:
            raise OllamaServiceError(f"Generation timed out after {req.timeout}s.")
        except Exception as err:
            raise OllamaServiceError(f"Ollama generation failed: {err}")


# Reusable Singleton Instance
ollama_service = OllamaService()
