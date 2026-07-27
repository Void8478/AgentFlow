import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.ai_providers.factory import AIProviderFactory
from app.domain.ai_schemas import (
    AIRequest,
    AIResponse,
    ChatRequest,
    ChatResponse,
    StreamingRequest,
    StreamingResponse,
    AIMessage,
)
from app.core.config import settings


def test_generic_schemas_instantiation():
    # Test AIRequest and AIResponse instantiation
    req = AIRequest(prompt="Hello World", system="Be polite", temperature=0.8)
    assert req.prompt == "Hello World"
    assert req.system == "Be polite"
    assert req.temperature == 0.8
    assert req.model is None

    resp = AIResponse(response="Hello from AI")
    assert resp.response == "Hello from AI"

    # Test ChatRequest and ChatResponse instantiation
    msg = AIMessage(role="user", content="Hi")
    chat_req = ChatRequest(messages=[msg], temperature=0.5)
    assert len(chat_req.messages) == 1
    assert chat_req.messages[0].role == "user"

    chat_resp = ChatResponse(message=AIMessage(role="model", content="Hello"))
    assert chat_resp.message.content == "Hello"

    # Test StreamingRequest and StreamingResponse instantiation
    stream_req = StreamingRequest(messages=[msg])
    assert stream_req.messages[0].role == "user"

    stream_resp = StreamingResponse(model="test-model", content="token", done=False)
    assert stream_resp.model == "test-model"
    assert stream_resp.content == "token"
    assert stream_resp.done is False


@pytest.mark.asyncio
async def test_factory_provider_completion():
    mock_provider = MagicMock()
    mock_provider.generate_completion = AsyncMock(return_value="Mocked provider response")
    
    with patch.object(AIProviderFactory, "get_provider", return_value=mock_provider):
        provider = AIProviderFactory.get_provider()
        res = await provider.generate_completion(
            prompt="Test prompt",
            system_prompt="Test system",
            model="test-model",
        )
        assert res == "Mocked provider response"
        mock_provider.generate_completion.assert_called_once_with(
            prompt="Test prompt",
            system_prompt="Test system",
            model="test-model",
        )


@pytest.mark.asyncio
async def test_factory_provider_streaming():
    mock_provider = MagicMock()
    
    async def mock_stream_chat(*args, **kwargs):
        yield {"model": "test-model", "content": "Hello", "done": False}
        yield {"model": "test-model", "content": " World", "done": True}

    mock_provider.stream_chat = mock_stream_chat
    
    with patch.object(AIProviderFactory, "get_provider", return_value=mock_provider):
        provider = AIProviderFactory.get_provider()
        chunks = []
        async for chunk in provider.stream_chat(
            messages=[{"role": "user", "content": "Hi"}],
            system_prompt="Test system",
        ):
            chunks.append(chunk)
            
        assert len(chunks) == 2
        assert chunks[0]["content"] == "Hello"
        assert chunks[1]["done"] is True
