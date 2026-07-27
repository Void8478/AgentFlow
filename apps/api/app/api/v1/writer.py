from fastapi import APIRouter, HTTPException
from app.domain.writer_schemas import WriterRequest, WriterResponse
from app.engine.writer_agent import writer_agent, WriterAgentError

router = APIRouter(prefix="/writer", tags=["Writer Agent"])


@router.post("/generate", response_model=WriterResponse)
async def generate_markdown_document(request: WriterRequest):
    """
    Synthesizes technical topics and research findings into a professional Markdown document
    containing headings, tables, lists, and code blocks.
    """
    try:
        return await writer_agent.generate_document(request)
    except WriterAgentError as err:
        raise HTTPException(status_code=500, detail=str(err))
