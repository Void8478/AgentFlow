from fastapi import APIRouter, HTTPException
from app.domain.planner_schemas import PlannerRequest, PlannerResponse
from app.engine.planner_agent import planner_agent, PlannerAgentError

router = APIRouter(prefix="/planner", tags=["Planner Agent"])


@router.post("/plan", response_model=PlannerResponse)
async def create_execution_plan(request: PlannerRequest):
    """
    Receives user request, uses Ollama LLM to decompose it into logical sub-tasks,
    and returns a structured JSON plan with topological execution order.
    """
    try:
        return await planner_agent.create_plan(request)
    except PlannerAgentError as err:
        raise HTTPException(status_code=500, detail=str(err))
