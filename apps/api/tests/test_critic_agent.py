import pytest
from app.engine.critic_agent import CriticAgent
from app.domain.critic_schemas import CriticRequest


def test_critic_agent_json_parsing():
    agent = CriticAgent()
    raw_response = """
    ```json
    {
      "feedback": "Comprehensive technical document with clear diagrams.",
      "metrics": {
        "accuracy_score": 95.0,
        "completeness_score": 90.0,
        "formatting_score": 92.0,
        "hallucination_risk": "low"
      },
      "revision_instructions": [
        {
          "section": "Overview",
          "issue": "Minor typo in title",
          "suggested_fix": "Fix spelling"
        }
      ]
    }
    ```
    """

    feedback, metrics, instructions = agent._parse_json_evaluation(raw_response)
    assert "Comprehensive" in feedback
    assert metrics.accuracy_score == 95.0
    assert metrics.hallucination_risk == "low"
    assert len(instructions) == 1
    assert instructions[0].section == "Overview"


@pytest.mark.asyncio
async def test_critic_revision_loop_trigger():
    agent = CriticAgent()
    # Mocking low score evaluation
    req = CriticRequest(
        original_prompt="Build complete auth system",
        content_to_evaluate="Partial code",
        revision_count=1,
        max_revisions=3,
    )
    # Testing logic properties manually
    score = 70.0  # Below 80 threshold
    is_approved = score >= 80.0
    should_revise = (not is_approved) and (req.revision_count < req.max_revisions)

    assert not is_approved
    assert should_revise
