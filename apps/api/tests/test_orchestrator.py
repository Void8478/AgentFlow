import pytest
import asyncio
from app.engine.orchestrator import WorkflowOrchestrator, WorkflowContext
from app.domain.workflow_schemas import (
    WorkflowStartRequest,
    WorkflowState,
    WorkflowType,
)


def test_workflow_context_initialization():
    req = WorkflowStartRequest(user_prompt="Build microservice architecture", workflow_type=WorkflowType.FULL_PIPELINE)
    ctx = WorkflowContext("wf-test-01", req)
    assert ctx.workflow_id == "wf-test-01"
    assert ctx.state == WorkflowState.IDLE
    assert len(ctx.step_history) == 0


def test_workflow_state_transition():
    req = WorkflowStartRequest(user_prompt="Build microservice architecture")
    ctx = WorkflowContext("wf-test-02", req)
    ctx.transition_to(WorkflowState.PLANNING, "Starting planning stage.")

    assert ctx.state == WorkflowState.PLANNING
    assert len(ctx.step_history) == 1
    assert ctx.step_history[0].state == WorkflowState.PLANNING


@pytest.mark.asyncio
async def test_workflow_cancellation():
    orchestrator = WorkflowOrchestrator()
    req = WorkflowStartRequest(user_prompt="Build microservice architecture")
    wf_id = orchestrator.start_workflow(req)

    # Cancel workflow
    success = orchestrator.cancel_workflow(wf_id)
    assert success

    status = orchestrator.get_status(wf_id)
    assert status is not None
    assert status.state == WorkflowState.CANCELLED
