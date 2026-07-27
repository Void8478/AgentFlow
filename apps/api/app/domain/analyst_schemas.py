from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


class Contradiction(BaseModel):
    statement_a: str = Field(..., description="First assertion or claim")
    statement_b: str = Field(..., description="Conflicting assertion or claim")
    explanation: str = Field(..., description="Reasoning behind why these statements contradict")
    severity: str = Field("medium", description="Severity level: low, medium, or high")


class MergedFact(BaseModel):
    fact: str = Field(..., description="Unified, deduplicated fact statement")
    supporting_sources: List[str] = Field(default_factory=list, description="Associated source citations")
    deduplicated_count: int = Field(1, ge=1, description="Number of duplicate occurrences merged")
    confidence: float = Field(0.9, ge=0.0, le=1.0, description="Fact confidence score")


class AnalystRequest(BaseModel):
    task_id: Optional[str] = Field(None, description="Associated DAG task ID")
    raw_research_data: List[Dict[str, Any]] = Field(
        ..., description="List of research findings or text snippets to analyze"
    )
    model: Optional[str] = Field(None, description="AI model override (defaults to active provider default)")
    timeout: Optional[float] = Field(60.0, description="Response timeout in seconds")


class AnalystResponse(BaseModel):
    analysis_id: str = Field(default_factory=lambda: f"anl-{uuid.uuid4().hex[:8]}")
    task_id: Optional[str] = None
    merged_facts: List[MergedFact]
    contradictions: List[Contradiction]
    overall_confidence_score: float = Field(..., ge=0.0, le=1.0)
    synthesized_takeaways: List[str] = Field(default_factory=list)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
