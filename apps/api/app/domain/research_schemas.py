from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


class ResearchFinding(BaseModel):
    topic: str = Field(..., description="Sub-topic or focus area of research")
    key_points: List[str] = Field(..., description="Bullet points of verified research findings")
    confidence_score: float = Field(0.95, ge=0.0, le=1.0, description="Confidence rating")
    sources: List[str] = Field(default_factory=list, description="Citations or reference URLs")


class ResearchRequest(BaseModel):
    task_id: Optional[str] = Field(None, description="Associated DAG task ID")
    query: str = Field(..., description="Research question or topic query")
    enable_web_search: bool = Field(True, description="Whether to query web-search tool")
    model: Optional[str] = Field(None, description="AI model override (defaults to active provider default)")
    timeout: Optional[float] = Field(60.0, description="Research timeout in seconds")


class ResearchResponse(BaseModel):
    research_id: str = Field(default_factory=lambda: f"res-{uuid.uuid4().hex[:8]}")
    task_id: Optional[str] = None
    query: str
    summary: str = Field(..., description="High-level executive summary of findings")
    findings: List[ResearchFinding]
    references: List[str] = Field(default_factory=list)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
