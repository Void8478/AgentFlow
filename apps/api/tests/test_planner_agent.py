import pytest
from app.engine.planner_agent import PlannerAgent
from app.domain.planner_schemas import PlannedTask


def test_topological_sort_linear():
    agent = PlannerAgent()
    tasks = [
        PlannedTask(id="task-1", title="Init Project", description="Setup codebase", dependencies=[]),
        PlannedTask(id="task-2", title="Build API", description="FastAPI routes", dependencies=["task-1"]),
        PlannedTask(id="task-3", title="Deploy", description="Deploy container", dependencies=["task-2"]),
    ]

    order = agent._topological_sort(tasks)
    assert order == ["task-1", "task-2", "task-3"]


def test_topological_sort_branching():
    agent = PlannerAgent()
    tasks = [
        PlannedTask(id="task-3", title="Merge Results", description="Aggregate outputs", dependencies=["task-1", "task-2"]),
        PlannedTask(id="task-1", title="Scrape Web", description="Gather data", dependencies=[]),
        PlannedTask(id="task-2", title="Query Database", description="Fetch SQL rows", dependencies=[]),
    ]

    order = agent._topological_sort(tasks)
    assert order.index("task-1") < order.index("task-3")
    assert order.index("task-2") < order.index("task-3")


def test_json_parser_cleaning():
    agent = PlannerAgent()
    raw_markdown_json = """
    Here is your requested plan:
    ```json
    {
      "tasks": [
        {
          "id": "task-1",
          "title": "Setup System",
          "description": "Initialize database schema",
          "agent_role": "Database Administrator",
          "assigned_model": "llama3:latest",
          "dependencies": [],
          "estimated_complexity": "low"
        }
      ]
    }
    ```
    Hope this helps!
    """

    parsed = agent._parse_json_tasks(raw_markdown_json)
    assert len(parsed) == 1
    assert parsed[0].id == "task-1"
    assert parsed[0].title == "Setup System"
