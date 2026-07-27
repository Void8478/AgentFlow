import logging
from app.core.config import settings
from app.services.ai_providers.base import BaseAIProvider
from app.services.ai_providers.ollama_provider import OllamaProvider
from app.services.ai_providers.gemini_provider import GeminiProvider

logger = logging.getLogger("agentflow.services.ai_providers.factory")

class AIProviderFactory:
    """
    Factory class responsible for instantiating the appropriate AIProvider based on environment configuration.
    """

    @staticmethod
    def get_provider() -> BaseAIProvider:
        provider_type = settings.AI_PROVIDER.lower().strip()
        
        if provider_type == "gemini":
            logger.info("Initializing Google Gemini AI Provider.")
            if not settings.GEMINI_API_KEY:
                logger.warning("GEMINI_API_KEY is not configured. Gemini requests will fail.")
            return GeminiProvider()
            
        elif provider_type == "ollama":
            logger.info("Initializing Ollama AI Provider.")
            return OllamaProvider()
            
        else:
            logger.warning(f"Unknown AI_PROVIDER '{provider_type}'. Defaulting to OllamaProvider.")
            return OllamaProvider()


# Shared Runtime AI Provider Instance
ai_provider: BaseAIProvider = AIProviderFactory.get_provider()
