from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


class WriterRequest(BaseModel):
    topic: str = Field(..., description="Document topic or main title")
    research_summary: Optional[str] = Field(
        None, description="Executive research summary input"
    )
    facts: Optional[List[str]] = Field(
        default_factory=list, description="Verified facts or takeaways to include"
    )
    include_tables: bool = Field(True, description="Whether to include markdown comparison tables")
    include_code_blocks: bool = Field(True, description="Whether to include code snippets")
    model: Optional[str] = Field(None, description="AI model override (defaults to active provider default)")
    timeout: Optional[float] = Field(90.0, description="Generation timeout in seconds")


class WriterResponse(BaseModel):
    doc_id: str = Field(default_factory=lambda: f"doc-{uuid.uuid4().hex[:8]}")
    title: str
    markdown_content: str = Field(..., description="Full formatted publication-ready Markdown")
    word_count: int = Field(..., ge=0)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
