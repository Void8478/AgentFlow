import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Callable, Awaitable
from app.domain.workflow_schemas import (
    WorkflowState,
    WorkflowType,
    WorkflowStepLog,
    WorkflowStartRequest,
    WorkflowStatusResponse,
)
from app.domain.planner_schemas import PlannerRequest
from app.domain.research_schemas import ResearchRequest
from app.domain.analyst_schemas import AnalystRequest
from app.domain.writer_schemas import WriterRequest
from app.domain.critic_schemas import CriticRequest
from app.engine.planner_agent import planner_agent
from app.engine.research_agent import research_agent
from app.engine.analyst_agent import analyst_agent
from app.engine.writer_agent import writer_agent
from app.engine.critic_agent import critic_agent
from app.services.ai_providers.factory import ai_provider

logger = logging.getLogger("agentflow.engine.orchestrator")


class WorkflowContext:
    def __init__(self, workflow_id: str, req: WorkflowStartRequest):
        self.workflow_id = workflow_id
        self.workflow_type = req.workflow_type
        self.state = WorkflowState.IDLE
        self.user_prompt = req.user_prompt
        self.model = req.model or ai_provider.default_model
        self.max_revisions = req.max_revisions
        self.max_retries = req.max_retries
        self.revision_count = 0
        self.step_history: list[WorkflowStepLog] = []

        self.planner_output: Optional[Dict[str, Any]] = None
        self.research_output: Optional[Dict[str, Any]] = None
        self.analysis_output: Optional[Dict[str, Any]] = None
        self.writer_output: Optional[Dict[str, Any]] = None
        self.critic_output: Optional[Dict[str, Any]] = None
        self.final_output: Optional[str] = None
        self.error: Optional[str] = None

        self.created_at = datetime.now(timezone.utc).isoformat()
        self.updated_at = self.created_at

    def transition_to(self, new_state: WorkflowState, details: str, error: Optional[str] = None):
        """Transitions state and appends to execution step history."""
        self.state = new_state
        self.updated_at = datetime.now(timezone.utc).isoformat()
        log_entry = WorkflowStepLog(state=new_state, details=details, error=error)
        self.step_history.append(log_entry)
        if error:
            self.error = error
        logger.info(f"Workflow [{self.workflow_id}] state -> {new_state.value}: {details}")


class WorkflowOrchestrator:
    def __init__(self):
        self._contexts: Dict[str, WorkflowContext] = {}
        self._cancellation_tokens: Dict[str, asyncio.Event] = {}

    def start_workflow(self, req: WorkflowStartRequest) -> str:
        """
        Creates context, registers cancellation token, and launches background task.
        """
        workflow_id = f"wf-{uuid.uuid4().hex[:8]}"
        ctx = WorkflowContext(workflow_id, req)
        cancel_token = asyncio.Event()

        self._contexts[workflow_id] = ctx
        self._cancellation_tokens[workflow_id] = cancel_token

        # Launch background execution task
        asyncio.create_task(self._run_workflow_pipeline(ctx, cancel_token))
        return workflow_id

    def cancel_workflow(self, workflow_id: str) -> bool:
        """
        Sets cancellation token for a running workflow.
        """
        if workflow_id in self._cancellation_tokens:
            self._cancellation_tokens[workflow_id].set()
            ctx = self._contexts.get(workflow_id)
            if ctx:
                ctx.transition_to(WorkflowState.CANCELLED, "Workflow cancelled by user.")
            return True
        return False

    def get_status(self, workflow_id: str) -> Optional[WorkflowStatusResponse]:
        """
        Retrieves status and context for a workflow ID.
        """
        ctx = self._contexts.get(workflow_id)
        if not ctx:
            return None

        return WorkflowStatusResponse(
            workflow_id=ctx.workflow_id,
            workflow_type=ctx.workflow_type,
            state=ctx.state,
            user_prompt=ctx.user_prompt,
            revision_count=ctx.revision_count,
            step_history=ctx.step_history,
            planner_output=ctx.planner_output,
            research_output=ctx.research_output,
            analysis_output=ctx.analysis_output,
            writer_output=ctx.writer_output,
            critic_output=ctx.critic_output,
            final_output=ctx.final_output,
            error=ctx.error,
            created_at=ctx.created_at,
            updated_at=ctx.updated_at,
        )

    async def _execute_with_retry(
        self,
        ctx: WorkflowContext,
        cancel_token: asyncio.Event,
        step_name: str,
        func: Callable[[], Awaitable[Any]],
    ) -> Any:
        """
        Executes a step with automatic retry policy and cancellation check.
        """
        if cancel_token.is_set():
            raise asyncio.CancelledError("Workflow was cancelled.")

        last_err = None
        for attempt in range(1, ctx.max_retries + 1):
            if cancel_token.is_set():
                raise asyncio.CancelledError("Workflow was cancelled.")

            try:
                logger.info(f"Workflow [{ctx.workflow_id}] executing step {step_name} (Attempt {attempt}/{ctx.max_retries})")
                return await func()
            except Exception as err:
                last_err = err
                logger.warning(f"Workflow [{ctx.workflow_id}] step {step_name} failed attempt {attempt}: {err}")
                if attempt < ctx.max_retries:
                    await asyncio.sleep(2**attempt)

        raise RuntimeError(f"Step {step_name} failed after {ctx.max_retries} attempts: {last_err}")

    async def _run_workflow_pipeline(self, ctx: WorkflowContext, cancel_token: asyncio.Event):
        """
        Main Custom State Machine Driver.
        """
        try:
            if ctx.workflow_type == WorkflowType.FULL_PIPELINE:
                await self._run_full_pipeline(ctx, cancel_token)
            elif ctx.workflow_type == WorkflowType.RESEARCH_ONLY:
                await self._run_research_only_pipeline(ctx, cancel_token)
            elif ctx.workflow_type == WorkflowType.WRITER_CRITIC_ONLY:
                await self._run_writer_critic_pipeline(ctx, cancel_token)

        except asyncio.CancelledError:
            ctx.transition_to(WorkflowState.CANCELLED, "Execution aborted due to cancellation request.")
        except Exception as err:
            logger.error(f"Workflow [{ctx.workflow_id}] encountered fatal error: {err}")
            ctx.transition_to(WorkflowState.FAILED, "Workflow pipeline execution failed.", error=str(err))

    async def _run_full_pipeline(self, ctx: WorkflowContext, cancel_token: asyncio.Event):
        # 1. PLANNING
        ctx.transition_to(WorkflowState.PLANNING, "Decomposing user request into DAG tasks.")
        plan_res = await self._execute_with_retry(
            ctx, cancel_token, "PLANNING",
            lambda: planner_agent.create_plan(PlannerRequest(user_prompt=ctx.user_prompt, model=ctx.model))
        )
        ctx.planner_output = plan_res.model_dump()

        # 2. RESEARCHING
        ctx.transition_to(WorkflowState.RESEARCHING, "Executing deep research on planned topics.")
        res_res = await self._execute_with_retry(
            ctx, cancel_token, "RESEARCHING",
            lambda: research_agent.execute_research(ResearchRequest(query=ctx.user_prompt, model=ctx.model))
        )
        ctx.research_output = res_res.model_dump()

        # 3. ANALYZING
        ctx.transition_to(WorkflowState.ANALYZING, "Deduplicating facts and detecting contradictions.")
        findings_data = [f.model_dump() for f in res_res.findings]
        anl_res = await self._execute_with_retry(
            ctx, cancel_token, "ANALYZING",
            lambda: analyst_agent.analyze_research(AnalystRequest(raw_research_data=findings_data, model=ctx.model))
        )
        ctx.analysis_output = anl_res.model_dump()

        # 4. WRITING & CRITIQUING REVISION LOOP
        await self._run_writer_critic_loop(ctx, cancel_token)

    async def _run_research_only_pipeline(self, ctx: WorkflowContext, cancel_token: asyncio.Event):
        ctx.transition_to(WorkflowState.RESEARCHING, "Executing research query.")
        res_res = await self._execute_with_retry(
            ctx, cancel_token, "RESEARCHING",
            lambda: research_agent.execute_research(ResearchRequest(query=ctx.user_prompt, model=ctx.model))
        )
        ctx.research_output = res_res.model_dump()

        ctx.transition_to(WorkflowState.ANALYZING, "Analyzing findings.")
        findings_data = [f.model_dump() for f in res_res.findings]
        anl_res = await self._execute_with_retry(
            ctx, cancel_token, "ANALYZING",
            lambda: analyst_agent.analyze_research(AnalystRequest(raw_research_data=findings_data, model=ctx.model))
        )
        ctx.analysis_output = anl_res.model_dump()
        ctx.final_output = anl_res.model_dump_json()
        ctx.transition_to(WorkflowState.COMPLETED, "Research analysis workflow complete.")

    async def _run_writer_critic_pipeline(self, ctx: WorkflowContext, cancel_token: asyncio.Event):
        await self._run_writer_critic_loop(ctx, cancel_token)

    async def _run_writer_critic_loop(self, ctx: WorkflowContext, cancel_token: asyncio.Event):
        facts = []
        if ctx.analysis_output:
            facts = [f.get("fact", "") for f in ctx.analysis_output.get("merged_facts", [])]

        summary = ctx.analysis_output.get("synthesized_takeaways", [ctx.user_prompt]) if ctx.analysis_output else ctx.user_prompt
        summary_str = " ".join(summary) if isinstance(summary, list) else str(summary)

        revision_notes = ""

        while True:
            # WRITING
            ctx.transition_to(WorkflowState.WRITING, f"Generating document (Revision {ctx.revision_count}).")
            write_req_prompt = ctx.user_prompt
            if revision_notes:
                write_req_prompt += f"\n\nRevision Notes to Address:\n{revision_notes}"

            wrt_res = await self._execute_with_retry(
                ctx, cancel_token, "WRITING",
                lambda: writer_agent.generate_document(
                    WriterRequest(
                        topic=ctx.user_prompt,
                        research_summary=summary_str,
                        facts=facts,
                        model=ctx.model,
                    )
                )
            )
            ctx.writer_output = wrt_res.model_dump()

            # CRITIQUING
            ctx.transition_to(WorkflowState.CRITIQUING, f"Evaluating document quality (Revision {ctx.revision_count}).")
            crt_res = await self._execute_with_retry(
                ctx, cancel_token, "CRITIQUING",
                lambda: critic_agent.evaluate_content(
                    CriticRequest(
                        original_prompt=ctx.user_prompt,
                        content_to_evaluate=wrt_res.markdown_content,
                        revision_count=ctx.revision_count,
                        max_revisions=ctx.max_revisions,
                        model=ctx.model,
                    )
                )
            )
            ctx.critic_output = crt_res.model_dump()

            # REVISION DECISION
            if crt_res.approved or not crt_res.should_revise:
                ctx.final_output = wrt_res.markdown_content
                ctx.transition_to(WorkflowState.COMPLETED, f"Workflow approved with overall score {crt_res.score}/100.")
                break
            else:
                ctx.revision_count += 1
                ctx.transition_to(WorkflowState.REVISING, f"Triggering revision loop ({ctx.revision_count}/{ctx.max_revisions}).")
                revision_notes = "\n".join(
                    f"- Section: {ins.section} | Issue: {ins.issue} | Fix: {ins.suggested_fix}"
                    for ins in crt_res.revision_instructions
                )


# Reusable Singleton Instance
orchestrator = WorkflowOrchestrator()
