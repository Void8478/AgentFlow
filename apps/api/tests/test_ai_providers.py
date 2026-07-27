import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.ai_providers.factory import AIProviderFactory
from app.services.ai_providers.ollama_provider import OllamaProvider
from app.services.ai_providers.gemini_provider import GeminiProvider
from app.core.config import settings

def test_factory_returns_correct_provider():
    # Test Ollama selection
    with patch.object(settings, "AI_PROVIDER", "ollama"):
        provider = AIProviderFactory.get_provider()
        assert isinstance(provider, OllamaProvider)

    # Test Gemini selection
    with patch.object(settings, "AI_PROVIDER", "gemini"):
        provider = AIProviderFactory.get_provider()
        assert isinstance(provider, GeminiProvider)

    # Test case insensitivity and unknown fallback
    with patch.object(settings, "AI_PROVIDER", "UNKNOWN_PROVIDER"):
        provider = AIProviderFactory.get_provider()
        assert isinstance(provider, OllamaProvider)


@pytest.mark.asyncio
async def test_ollama_provider_completion():
    provider = OllamaProvider()
    with patch("app.services.ollama_service.ollama_service.generate_completion", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = {"response": "Mocked Ollama response"}
        
        res = await provider.generate_completion(
            prompt="Hello",
            system_prompt="System instructions",
            model="llama3:latest",
            temperature=0.5,
        )
        assert res == "Mocked Ollama response"
        mock_gen.assert_called_once()


@pytest.mark.asyncio
async def test_gemini_provider_completion():
    with patch("app.services.ai_providers.gemini_provider.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        
        mock_response = MagicMock()
        mock_response.text = "Mocked Gemini response"
        
        mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
        
        provider = GeminiProvider(api_key="mock_key", default_model="gemini-2.5-flash")
        
        res = await provider.generate_completion(
            prompt="Hello",
            system_prompt="System instructions",
            model="gemini-2.5-flash",
            temperature=0.5,
        )
        assert res == "Mocked Gemini response"
        mock_client.aio.models.generate_content.assert_called_once()
