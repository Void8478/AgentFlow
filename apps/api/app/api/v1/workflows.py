from fastapi import APIRouter, HTTPException
from app.domain.workflow_schemas import (
    WorkflowStartRequest,
    WorkflowStatusResponse,
)
from app.engine.orchestrator import orchestrator

router = APIRouter(prefix="/workflows", tags=["Workflow Orchestrator"])


@router.post("/start", response_model=dict)
async def start_workflow_pipeline(request: WorkflowStartRequest):
    """
    Launches a multi-agent workflow state machine pipeline asynchronously.
    Supports FULL_PIPELINE, RESEARCH_ONLY, and WRITER_CRITIC_ONLY.
    """
    workflow_id = orchestrator.start_workflow(request)
    return {
        "workflow_id": workflow_id,
        "status": "STARTED",
        "message": f"Workflow {workflow_id} initiated successfully.",
    }


@router.get("/{workflow_id}/status", response_model=WorkflowStatusResponse)
async def get_workflow_status(workflow_id: str):
    """
    Returns live state, step history log, agent outputs, and final artifacts for a workflow ID.
    """
    status = orchestrator.get_status(workflow_id)
    if not status:
        raise HTTPException(status_code=404, detail=f"Workflow '{workflow_id}' not found.")
    return status


@router.post("/{workflow_id}/cancel", response_model=dict)
async def cancel_workflow_pipeline(workflow_id: str):
    """
    Triggers an immediate cancellation signal for a running workflow pipeline.
    """
    cancelled = orchestrator.cancel_workflow(workflow_id)
    if not cancelled:
        raise HTTPException(
            status_code=404, detail=f"Workflow '{workflow_id}' not found or active token absent."
        )
    return {
        "workflow_id": workflow_id,
        "status": "CANCELLED",
        "message": f"Cancellation request sent for workflow {workflow_id}.",
    }
