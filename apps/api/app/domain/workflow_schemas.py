from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


class WorkflowState(str, Enum):
    IDLE = "IDLE"
    PLANNING = "PLANNING"
    RESEARCHING = "RESEARCHING"
    ANALYZING = "ANALYZING"
    WRITING = "WRITING"
    CRITIQUING = "CRITIQUING"
    REVISING = "REVISING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class WorkflowType(str, Enum):
    FULL_PIPELINE = "FULL_PIPELINE"
    RESEARCH_ONLY = "RESEARCH_ONLY"
    WRITER_CRITIC_ONLY = "WRITER_CRITIC_ONLY"


class WorkflowStepLog(BaseModel):
    state: WorkflowState
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    details: str
    error: Optional[str] = None


class WorkflowStartRequest(BaseModel):
    user_prompt: str = Field(..., description="Goal prompt for the multi-agent workflow")
    workflow_type: WorkflowType = Field(
        WorkflowType.FULL_PIPELINE, description="Pipeline topology type"
    )
    model: Optional[str] = Field("llama3:latest", description="Ollama model to execute")
    max_revisions: int = Field(3, ge=1, le=5, description="Max revision loop count")
    max_retries: int = Field(3, ge=1, le=5, description="Max step retry count")


class WorkflowStatusResponse(BaseModel):
    workflow_id: str
    workflow_type: WorkflowType
    state: WorkflowState
    user_prompt: str
    revision_count: int
    step_history: List[WorkflowStepLog]
    planner_output: Optional[Dict[str, Any]] = None
    research_output: Optional[Dict[str, Any]] = None
    analysis_output: Optional[Dict[str, Any]] = None
    writer_output: Optional[Dict[str, Any]] = None
    critic_output: Optional[Dict[str, Any]] = None
    final_output: Optional[str] = None
    error: Optional[str] = None
    created_at: str
    updated_at: str
