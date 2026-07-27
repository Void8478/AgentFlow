from fastapi import APIRouter
from datetime import datetime, timezone
import httpx
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Production health check endpoint verifying engine status and upstream service connectivity.
    """
    ollama_status = "offline"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{settings.OLLAMA_HOST}/api/version")
            if res.status_code == 200:
                ollama_status = "online"
    except Exception:
        ollama_status = "unreachable"

    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "ollama": ollama_status,
        },
    }
