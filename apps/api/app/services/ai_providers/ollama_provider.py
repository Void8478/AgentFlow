from typing import AsyncGenerator, List, Dict, Any, Optional
from app.services.ollama_service import ollama_service
from app.domain.ollama_schemas import OllamaGenerateRequest, OllamaChatRequest, OllamaMessage
from app.services.ai_providers.base import BaseAIProvider

class OllamaProvider(BaseAIProvider):
    """
    Ollama implementation of the AI Provider interface, forwarding calls to OllamaService.
    """

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
        Invokes non-streaming completion on OllamaService.
        """
        # Note: Ollama doesn't strictly have a json mode flag inside GenerateRequest schema,
        # but we pass prompt and system commands which direct it to return JSON.
        req = OllamaGenerateRequest(
            model=model,
            prompt=prompt,
            system=system_prompt,
            temperature=temperature,
            timeout=timeout,
        )
        res = await ollama_service.generate_completion(req)
        return res.get("response", "").strip()

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        timeout: Optional[float] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Streams chat responses using OllamaService's stream_chat.
        """
        msg_objs = [
            OllamaMessage(role=m["role"], content=m["content"]) for m in messages
        ]
        req = OllamaChatRequest(
            model=model,
            messages=msg_objs,
            system_prompt=system_prompt,
            temperature=temperature,
            timeout=timeout,
        )
        async for chunk in ollama_service.stream_chat(req):
            yield chunk.model_dump()
