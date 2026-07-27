from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from app.core.config import settings
from app.api.v1.router import api_router

logger = logging.getLogger("agentflow.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
)

# Secure CORS Middleware Configuration
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "https://agent-flow-web.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register v1 API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


# Global Exception Handler for Unhandled Errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please consult system logs.",
            "path": request.url.path,
        },
    )


@app.get("/", tags=["Health"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": f"{settings.API_V1_STR}/docs",
    }
