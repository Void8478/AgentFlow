import pytest
import asyncio
from app.services.ollama_service import OllamaService
from app.domain.ollama_schemas import OllamaChatRequest, OllamaMessage


@pytest.mark.asyncio
async def test_ollama_service_initialization():
    service = OllamaService(host="http://localhost:11434", default_model="llama3:latest")
    assert service.host == "http://localhost:11434"
    assert service.default_model == "llama3:latest"


@pytest.mark.asyncio
async def test_ollama_list_models():
    service = OllamaService()
    models = await service.list_models()
    assert isinstance(models, list)
    assert len(models) >= 1
    assert hasattr(models[0], "name")


@pytest.mark.asyncio
async def test_ollama_chat_stream_structure():
    service = OllamaService()
    req = OllamaChatRequest(
        model="llama3:latest",
        messages=[OllamaMessage(role="user", content="Hello")],
        timeout=5.0,
    )
    chunks = []
    async for chunk in service.stream_chat(req):
        chunks.append(chunk)
        if len(chunks) >= 1:
            break

    assert len(chunks) > 0
    assert hasattr(chunks[0], "content")
    assert hasattr(chunks[0], "done")
