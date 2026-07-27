from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
from app.engine.orchestrator import orchestrator
from app.domain.workflow_schemas import WorkflowStartRequest

router = APIRouter(prefix="/history", tags=["Workflow History"])


class HistoryItem(BaseModel):
    id: str
    title: str
    workflow_type: str
    status: str
    prompt: str
    revision_count: int
    started_at: str
    completed_at: Optional[str] = None
    final_output_preview: Optional[str] = None


class HistoryPaginatedResponse(BaseModel):
    items: List[HistoryItem]
    total_count: int
    page: int
    page_size: int
    has_next: bool


# In-memory storage mock index for active backend server runs
# Syncs with public.runs database table in production Supabase
HISTORICAL_RUNS_DB: Dict[str, HistoryItem] = {
    "run-101": HistoryItem(
        id="run-101",
        title="Microservice Architecture Plan",
        workflow_type="FULL_PIPELINE",
        status="COMPLETED",
        prompt="Design a high-throughput microservices architecture with FastAPI and Kafka.",
        revision_count=1,
        started_at=datetime.now(timezone.utc).isoformat(),
        completed_at=datetime.now(timezone.utc).isoformat(),
        final_output_preview="# Microservice Architecture\n\n- FastAPI Gateway\n- Kafka Event Bus",
    ),
    "run-102": HistoryItem(
        id="run-102",
        title="ChromaDB HNSW Performance Benchmark",
        workflow_type="RESEARCH_ONLY",
        status="COMPLETED",
        prompt="Compare ChromaDB HNSW cosine similarity latency against Pgvector.",
        revision_count=0,
        started_at=datetime.now(timezone.utc).isoformat(),
        completed_at=datetime.now(timezone.utc).isoformat(),
        final_output_preview="Benchmark results show ChromaDB HNSW yields 4.2ms search latency.",
    ),
    "run-103": HistoryItem(
        id="run-103",
        title="AI Stream Cancellation Audit",
        workflow_type="WRITER_CRITIC_ONLY",
        status="FAILED",
        prompt="Audit async socket disconnection during streaming token responses.",
        revision_count=3,
        started_at=datetime.now(timezone.utc).isoformat(),
        completed_at=None,
        final_output_preview=None,
    ),
}


@router.get("", response_model=HistoryPaginatedResponse)
async def list_workflow_history(
    search: Optional[str] = Query(None, description="Search query string"),
    status: Optional[str] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
):
    """
    Returns paginated historical workflow runs with search, status filtering, and page controls.
    """
    filtered = list(HISTORICAL_RUNS_DB.values())

    if search:
        s = search.lower()
        filtered = [
            r for r in filtered if s in r.title.lower() or s in r.prompt.lower()
        ]

    if status and status != "ALL":
        filtered = [r for r in filtered if r.status.upper() == status.upper()]

    total_count = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_items = filtered[start_idx:end_idx]

    return HistoryPaginatedResponse(
        items=page_items,
        total_count=total_count,
        page=page,
        page_size=page_size,
        has_next=end_idx < total_count,
    )


@router.delete("/{run_id}")
async def delete_workflow_history(run_id: str):
    """
    Deletes a historical workflow run.
    """
    if run_id in HISTORICAL_RUNS_DB:
        del HISTORICAL_RUNS_DB[run_id]
        return {"message": f"Run '{run_id}' deleted successfully."}
    raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")


@router.post("/{run_id}/replay")
async def replay_workflow(run_id: str):
    """
    Replays a historical workflow run by cloning its prompt and launching a new execution state machine.
    """
    item = HISTORICAL_RUNS_DB.get(run_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

    new_wf_id = orchestrator.start_workflow(
        WorkflowStartRequest(
            user_prompt=item.prompt,
            workflow_type=item.workflow_type,
        )
    )

    return {
        "new_workflow_id": new_wf_id,
        "replayed_from": run_id,
        "status": "STARTED",
        "message": f"Replay workflow {new_wf_id} launched successfully.",
    }
