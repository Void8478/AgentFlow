from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


class EvaluationMetrics(BaseModel):
    accuracy_score: float = Field(..., ge=0.0, le=100.0, description="Accuracy rating 0-100")
    completeness_score: float = Field(..., ge=0.0, le=100.0, description="Completeness rating 0-100")
    formatting_score: float = Field(..., ge=0.0, le=100.0, description="Markdown formatting rating 0-100")
    hallucination_risk: str = Field("low", description="Risk rating: low, medium, or high")


class RevisionInstruction(BaseModel):
    section: str = Field(..., description="Target section requiring revision")
    issue: str = Field(..., description="Description of the defect or missing detail")
    suggested_fix: str = Field(..., description="Actionable instruction to resolve the issue")


class CriticRequest(BaseModel):
    task_id: Optional[str] = Field(None, description="Associated DAG task ID")
    original_prompt: str = Field(..., description="Original user prompt or specification")
    content_to_evaluate: str = Field(..., description="Generated text or Markdown content to audit")
    revision_count: int = Field(0, ge=0, description="Current revision loop iteration count")
    max_revisions: int = Field(3, ge=1, le=5, description="Maximum allowed revision loops")
    model: Optional[str] = Field("llama3:latest", description="Ollama model to use for evaluation")
    timeout: Optional[float] = Field(60.0, description="Evaluation timeout in seconds")


class CriticResponse(BaseModel):
    evaluation_id: str = Field(default_factory=lambda: f"crt-{uuid.uuid4().hex[:8]}")
    task_id: Optional[str] = None
    approved: bool = Field(..., description="True if content meets quality criteria")
    score: float = Field(..., ge=0.0, le=100.0, description="Overall weighted score 0-100")
    feedback: str = Field(..., description="Executive summary critique")
    metrics: EvaluationMetrics
    revision_instructions: List[RevisionInstruction] = Field(default_factory=list)
    should_revise: bool = Field(..., description="True if another revision iteration should be triggered")
    revision_count: int = Field(..., ge=0)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
