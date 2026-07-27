from fastapi import APIRouter
from app.api.v1 import health, ollama, planner, research, analyst, writer, critic, workflows, ws, history, export, settings

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(ollama.router, tags=["Ollama Engine"])
api_router.include_router(planner.router, tags=["Planner Agent"])
api_router.include_router(research.router, tags=["Research Agent"])
api_router.include_router(analyst.router, tags=["Analyst Agent"])
api_router.include_router(writer.router, tags=["Writer Agent"])
api_router.include_router(critic.router, tags=["Critic Agent"])
api_router.include_router(workflows.router, tags=["Workflow Orchestrator"])
api_router.include_router(ws.router, tags=["WebSockets"])
api_router.include_router(history.router, tags=["Workflow History"])
api_router.include_router(export.router, tags=["Export Engine"])
api_router.include_router(settings.router, tags=["Settings & Config"])
