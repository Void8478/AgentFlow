from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Dict, Any, Optional

class BaseAIProvider(ABC):
    """
    Abstract Base Class defining the standard interface for all AI LLM Providers.
    All agents interact with this interface rather than invoking specific libraries directly.
    """

    @abstractmethod
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
        Executes a single non-streaming completion request.
        
        Args:
            prompt: The user instruction or text.
            system_prompt: Optional system persona instructions.
            model: Override target model name.
            temperature: LLM temperature value.
            json_output: If True, forces the response to be structured JSON.
            timeout: Maximum read timeout in seconds.
            
        Returns:
            The raw string response content.
        """
        pass

    @abstractmethod
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
        
        Args:
            messages: A list of dicts with keys 'role' and 'content'.
            system_prompt: Optional system instructions.
            model: Override target model name.
            temperature: LLM temperature.
            timeout: Generation timeout.
            
        Yields:
            Dicts matching the metadata schema structure of stream chunks:
            {
                "model": "model_name",
                "content": "token_text",
                "done": bool,
                "error": Optional[str]
            }
        """
        pass
