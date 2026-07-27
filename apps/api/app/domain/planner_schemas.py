from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


class PlannedTask(BaseModel):
    id: str = Field(..., description="Unique task identifier, e.g., task-1")
    title: str = Field(..., description="Short descriptive title of the task")
    description: str = Field(..., description="Detailed task directives and scope")
    agent_role: str = Field(
        "System Architect",
        description="Suggested agent role, e.g., Code Synthesizer, Researcher",
    )
    assigned_model: str = Field(
        "llama3:latest", description="Suggested LLM model for execution"
    )
    dependencies: List[str] = Field(
        default_factory=list, description="IDs of tasks that must complete first"
    )
    estimated_complexity: str = Field(
        "medium", description="Complexity rating: low, medium, or high"
    )


class PlannerRequest(BaseModel):
    user_prompt: str = Field(
        ..., description="The user's high-level goal or workflow prompt"
    )
    model: Optional[str] = Field(
        "llama3:latest", description="Ollama model to use for planning"
    )
    max_tasks: Optional[int] = Field(5, ge=1, le=10)
    timeout: Optional[float] = Field(60.0, description="Planning timeout in seconds")


class PlannerResponse(BaseModel):
    plan_id: str = Field(default_factory=lambda: f"plan-{uuid.uuid4().hex[:8]}")
    original_prompt: str
    tasks: List[PlannedTask]
    execution_order: List[str] = Field(
        ..., description="Topologically sorted task execution sequence"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
