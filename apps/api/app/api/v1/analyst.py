from fastapi import APIRouter, HTTPException
from app.domain.analyst_schemas import AnalystRequest, AnalystResponse
from app.engine.analyst_agent import analyst_agent, AnalystAgentError

router = APIRouter(prefix="/analyst", tags=["Analyst Agent"])


@router.post("/analyze", response_model=AnalystResponse)
async def analyze_research_data(request: AnalystRequest):
    """
    Analyzes raw research findings, deduplicates facts, detects logical contradictions,
    and calculates weighted confidence scores.
    """
    try:
        return await analyst_agent.analyze_research(request)
    except AnalystAgentError as err:
        raise HTTPException(status_code=500, detail=str(err))
