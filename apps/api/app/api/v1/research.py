from fastapi import APIRouter, HTTPException
from app.domain.research_schemas import ResearchRequest, ResearchResponse
from app.engine.research_agent import research_agent, ResearchAgentError

router = APIRouter(prefix="/research", tags=["Research Agent"])


@router.post("/analyze", response_model=ResearchResponse)
async def analyze_research_topic(request: ResearchRequest):
    """
    Executes technical research on a topic using pluggable web tools and Ollama LLM synthesis.
    """
    try:
        return await research_agent.execute_research(request)
    except ResearchAgentError as err:
        raise HTTPException(status_code=500, detail=str(err))
