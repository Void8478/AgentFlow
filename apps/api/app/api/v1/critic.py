from fastapi import APIRouter, HTTPException
from app.domain.critic_schemas import CriticRequest, CriticResponse
from app.engine.critic_agent import critic_agent, CriticAgentError

router = APIRouter(prefix="/critic", tags=["Critic Agent"])


@router.post("/evaluate", response_model=CriticResponse)
async def evaluate_content_quality(request: CriticRequest):
    """
    Audits generated content for accuracy, completeness, formatting, and hallucination risk,
    returning quality scores, approval status, and actionable revision loop instructions.
    """
    try:
        return await critic_agent.evaluate_content(request)
    except CriticAgentError as err:
        raise HTTPException(status_code=500, detail=str(err))
