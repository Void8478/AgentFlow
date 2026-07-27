import asyncio
import json
import logging
from typing import AsyncGenerator, List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.services.ai_providers.base import BaseAIProvider

logger = logging.getLogger("agentflow.services.ai_providers.ollama")

class OllamaProvider(BaseAIProvider):
    """
    Ollama implementation of the AI Provider interface, communicating directly with local Ollama daemon via httpx.
    """

    def __init__(self, base_url: Optional[str] = None, default_model_name: Optional[str] = None):
        self.base_url = base_url or settings.OLLAMA_BASE_URL
        self._default_model = default_model_name or settings.OLLAMA_DEFAULT_MODEL

    @property
    def default_model(self) -> str:
        return self._default_model

    async def check_health(self) -> bool:
        """
        Queries Ollama's version API to verify daemon status.
        """
        url = f"{self.base_url}/api/version"
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(url)
                return res.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> List[Dict[str, Any]]:
        """
        Query Ollama's installed tags API.
        """
        url = f"{self.base_url}/api/tags"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)
                res.raise_for_status()
                data = res.json()
                return data.get("models", [])
        except Exception as err:
            logger.error(f"Failed to query Ollama models: {err}")
            return [{"name": self._default_model}]

    async def generate_completion(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        json_output: bool = False,
        timeout: Optional[float] = None,
    ) -> str:
        """
        Invokes single completion endpoint.
        """
        model_name = model or self._default_model
        url = f"{self.base_url}/api/generate"

        payload = {
            "model": model_name,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
            },
        }
        if json_output:
            payload["format"] = "json"

        timeout_config = httpx.Timeout(timeout or 60.0, connect=5.0)

        try:
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                return data.get("response", "").strip()
        except httpx.TimeoutException:
            raise TimeoutError(f"Ollama generation timed out after {timeout} seconds.")
        except Exception as err:
            raise RuntimeError(f"Ollama generation failed: {err}")

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        timeout: Optional[float] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Streams chat responses token-by-token.
        """
        model_name = model or self._default_model
        url = f"{self.base_url}/api/chat"

        chat_messages = [msg for msg in messages]
        if system_prompt:
            chat_messages.insert(0, {"role": "system", "content": system_prompt})

        payload = {
            "model": model_name,
            "messages": chat_messages,
            "stream": True,
            "options": {
                "temperature": temperature,
            },
        }

        timeout_config = httpx.Timeout(timeout or 60.0, connect=5.0)

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

                        yield {
                            "model": model_name,
                            "content": content,
                            "done": done,
                        }

                        if done:
                            break

        except asyncio.CancelledError:
            logger.warning(f"Ollama stream_chat cancelled for model {model_name}.")
            raise
        except httpx.TimeoutException:
            logger.error(f"Ollama request timed out after {timeout} seconds.")
            yield {
                "model": model_name,
                "content": "",
                "done": True,
                "error": f"Timeout error: Request exceeded {timeout}s limit.",
            }
        except Exception as err:
            logger.error(f"Error during Ollama stream: {err}")
            yield {
                "model": model_name,
                "content": "",
                "done": True,
                "error": str(err),
            }
