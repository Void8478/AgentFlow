import json
import re
import logging
from typing import List, Dict, Set
from collections import deque
from app.services.ollama_service import ollama_service, OllamaServiceError
from app.domain.ollama_schemas import OllamaGenerateRequest
from app.domain.planner_schemas import (
    PlannerRequest,
    PlannerResponse,
    PlannedTask,
)

logger = logging.getLogger("agentflow.engine.planner")


class PlannerAgentError(Exception):
    """Custom exception raised when planning fails."""
    pass


class PlannerAgent:
    SYSTEM_PROMPT = (
        "You are the Lead Planning Agent in AgentFlow, a multi-agent orchestration platform.\n"
        "Your task is to analyze the user's high-level request and break it down into modular, logical sub-tasks.\n"
        "Return ONLY a valid JSON object matching the exact format below, with NO extra commentary or markdown text:\n\n"
        "{\n"
        '  "tasks": [\n'
        "    {\n"
        '      "id": "task-1",\n'
        '      "title": "Short title",\n'
        '      "description": "Detailed task instructions",\n'
        '      "agent_role": "System Architect",\n'
        '      "assigned_model": "llama3:latest",\n'
        '      "dependencies": [],\n'
        '      "estimated_complexity": "low"\n'
        "    },\n"
        "    {\n"
        '      "id": "task-2",\n'
        '      "title": "Short title",\n'
        '      "description": "Detailed task instructions",\n'
        '      "agent_role": "Code Synthesizer",\n'
        '      "assigned_model": "llama3:latest",\n'
        '      "dependencies": ["task-1"],\n'
        '      "estimated_complexity": "medium"\n'
        "    }\n"
        "  ]\n"
        "}\n"
    )

    async def create_plan(self, req: PlannerRequest) -> PlannerResponse:
        """
        Decomposes a user request into structured tasks using Ollama LLM and computes topological execution order.
        """
        prompt = (
            f"User Goal: {req.user_prompt}\n"
            f"Generate a task decomposition with a maximum of {req.max_tasks} tasks."
        )

        gen_req = OllamaGenerateRequest(
            model=req.model or "llama3:latest",
            prompt=prompt,
            system=self.SYSTEM_PROMPT,
            temperature=0.2,  # Low temperature for deterministic JSON output
            timeout=req.timeout,
        )

        try:
            raw_res = await ollama_service.generate_completion(gen_req)
            response_text = raw_res.get("response", "")
            tasks = self._parse_json_tasks(response_text)

            if not tasks:
                # Fallback task if LLM output could not be parsed
                tasks = [
                    PlannedTask(
                        id="task-1",
                        title="Execute Primary User Request",
                        description=req.user_prompt,
                        agent_role="General AI Agent",
                        assigned_model=req.model or "llama3:latest",
                        dependencies=[],
                        estimated_complexity="medium",
                    )
                ]

            execution_order = self._topological_sort(tasks)

            return PlannerResponse(
                original_prompt=req.user_prompt,
                tasks=tasks,
                execution_order=execution_order,
            )

        except OllamaServiceError as err:
            logger.error(f"Ollama planning failed: {err}")
            raise PlannerAgentError(f"Ollama LLM planning error: {err}")

    def _parse_json_tasks(self, raw_text: str) -> List[PlannedTask]:
        """
        Cleans LLM response text, strips markdown code blocks, and parses JSON array of PlannedTask objects.
        """
        try:
            # Extract JSON block if wrapped in ```json ... ```
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
            json_str = match.group(1) if match else raw_text.strip()

            # Attempt direct JSON load if not extracted by regex
            if not json_str.startswith("{"):
                start_idx = json_str.find("{")
                end_idx = json_str.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    json_str = json_str[start_idx : end_idx + 1]

            data = json.loads(json_str)
            raw_tasks = data.get("tasks", [])

            parsed_tasks = []
            for item in raw_tasks:
                parsed_tasks.append(PlannedTask(**item))

            return parsed_tasks

        except Exception as err:
            logger.warning(f"Failed to parse LLM JSON response: {err}. Raw text: {raw_text[:200]}")
            return []

    def _topological_sort(self, tasks: List[PlannedTask]) -> List[str]:
        """
        Computes topological execution order using Kahn's algorithm.
        """
        task_map = {t.id: t for t in tasks}
        in_degree: Dict[str, int] = {t.id: 0 for t in tasks}
        adj_list: Dict[str, List[str]] = {t.id: [] for t in tasks}

        for t in tasks:
            for dep in t.dependencies:
                if dep in task_map:
                    adj_list[dep].append(t.id)
                    in_degree[t.id] += 1

        queue = deque([t_id for t_id, deg in in_degree.items() if deg == 0])
        execution_order = []

        while queue:
            curr = queue.popleft()
            execution_order.append(curr)

            for neighbor in adj_list[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # Append any unvisited tasks in case of circular dependencies
        for t_id in task_map:
            if t_id not in execution_order:
                execution_order.append(t_id)

        return execution_order


# Reusable Singleton Instance
planner_agent = PlannerAgent()
