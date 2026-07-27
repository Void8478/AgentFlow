import asyncio
import logging
import time
from typing import AsyncGenerator, List, Dict, Any, Optional
from google import genai
from google.genai import types
from app.core.config import settings
from app.services.ai_providers.base import BaseAIProvider

logger = logging.getLogger("agentflow.services.ai_providers.gemini")

class GeminiProvider(BaseAIProvider):
    """
    Google Gemini implementation of the AI Provider interface using the official google-genai SDK.
    """

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self._default_model = default_model or settings.GEMINI_MODEL
        # Initialize Google GenAI client (can succeed with empty key, but calls will fail)
        self.client = genai.Client(api_key=self.api_key or "MOCK_KEY_FOR_INIT")

    @property
    def default_model(self) -> str:
        return self._default_model

    async def check_health(self) -> bool:
        """
        Verifies that Gemini API key is configured.
        """
        # If the key is not set or is still a placeholder, it's unhealthy
        if not self.api_key or "your-gemini-api-key" in self.api_key or self.api_key == "MOCK_KEY_FOR_INIT":
            return False
        return True

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
        Generates completion using client.aio.models.generate_content.
        Supports retry policy and timeout config.
        """
        model_name = model or self._default_model
        
        config = types.GenerateContentConfig(
            system_instruction=system_prompt if system_prompt else None,
            temperature=temperature,
            response_mime_type="application/json" if json_output else None,
        )

        max_retries = 3
        last_error = None

        for attempt in range(1, max_retries + 1):
            try:
                gen_timeout = timeout or 60.0
                logger.info(f"Gemini API calling model {model_name} (attempt {attempt}/{max_retries})")
                
                response = await asyncio.wait_for(
                    self.client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=config,
                    ),
                    timeout=gen_timeout
                )
                return response.text or ""
            except asyncio.TimeoutError:
                last_error = TimeoutError(f"Gemini API request timed out after {timeout} seconds.")
                logger.warning(f"Gemini API attempt {attempt} timed out.")
            except Exception as err:
                last_error = err
                logger.warning(f"Gemini API attempt {attempt} failed: {err}")
            
            if attempt < max_retries:
                await asyncio.sleep(2 ** attempt)

        raise RuntimeError(f"Gemini generation failed after {max_retries} attempts. Last error: {last_error}")

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        timeout: Optional[float] = None,
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Streams chat tokens using client.aio.models.generate_content_stream.
        Matches metadata response format of OllamaStreamChunk.
        """
        model_name = model or self._default_model

        # Map messages to official types.Content objects
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])]
                )
            )

        config = types.GenerateContentConfig(
            system_instruction=system_prompt if system_prompt else None,
            temperature=temperature,
        )

        gen_timeout = timeout or 60.0
        start_time = time.time()
        token_count = 0

        try:
            stream = await asyncio.wait_for(
                self.client.aio.models.generate_content_stream(
                    model=model_name,
                    contents=contents,
                    config=config,
                ),
                timeout=15.0  # connection timeout
            )

            async for chunk in stream:
                if time.time() - start_time > gen_timeout:
                    yield {
                        "model": model_name,
                        "content": "",
                        "done": True,
                        "error": f"Timeout error: Request exceeded {gen_timeout}s limit.",
                    }
                    return

                chunk_text = chunk.text or ""
                token_count += 1
                elapsed = time.time() - start_time
                tps = round(token_count / elapsed, 1) if elapsed > 0 else 0.0

                yield {
                    "model": model_name,
                    "content": chunk_text,
                    "done": False,
                    "tokens_per_second": tps,
                }

            yield {
                "model": model_name,
                "content": "",
                "done": True,
            }

        except Exception as err:
            logger.error(f"Gemini streaming error: {err}")
            yield {
                "model": model_name,
                "content": "",
                "done": True,
                "error": str(err),
            }
