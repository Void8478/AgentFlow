from fastapi import APIRouter

from app.core.config import settings
from app.services.ai_providers.factory import ai_provider

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Production health check endpoint verifying engine status and upstream service connectivity.
    """
    is_healthy = await ai_provider.check_health()

    return {
        "status": "ok",
        "provider": settings.AI_PROVIDER,
        "model": ai_provider.default_model,
        "streaming": True,
        "healthy": is_healthy,
    }
