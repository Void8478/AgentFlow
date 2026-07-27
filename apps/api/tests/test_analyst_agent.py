import pytest
from app.engine.analyst_agent import AnalystAgent
from app.domain.analyst_schemas import MergedFact, Contradiction


def test_calculate_overall_confidence_no_contradictions():
    agent = AnalystAgent()
    facts = [
        MergedFact(fact="FastAPI is an async framework", confidence=0.9),
        MergedFact(fact="Pydantic provides data validation", confidence=1.0),
    ]
    contradictions = []

    score = agent._calculate_overall_confidence(facts, contradictions)
    assert score == 0.95


def test_calculate_overall_confidence_with_contradictions():
    agent = AnalystAgent()
    facts = [
        MergedFact(fact="FastAPI is an async framework", confidence=0.9),
        MergedFact(fact="Pydantic provides data validation", confidence=1.0),
    ]
    contradictions = [
        Contradiction(
            statement_a="Ollama is fast",
            statement_b="Ollama is slow",
            explanation="Different benchmarks",
            severity="high",
        )
    ]

    score = agent._calculate_overall_confidence(facts, contradictions)
    assert score == 0.8  # 0.95 - 0.15 high severity penalty


def test_analyst_agent_json_parsing():
    agent = AnalystAgent()
    raw_response = """
    ```json
    {
      "merged_facts": [
        {
          "fact": "Supabase uses PostgreSQL",
          "supporting_sources": ["Supabase Docs"],
          "deduplicated_count": 3,
          "confidence": 0.98
        }
      ],
      "contradictions": [
        {
          "statement_a": "REST is better",
          "statement_b": "GraphQL is better",
          "explanation": "Tradeoff debate",
          "severity": "medium"
        }
      ],
      "synthesized_takeaways": ["Choose based on client query requirements."]
    }
    ```
    """

    facts, contradictions, takeaways = agent._parse_json_analysis(raw_response)
    assert len(facts) == 1
    assert facts[0].fact == "Supabase uses PostgreSQL"
    assert facts[0].deduplicated_count == 3
    assert len(contradictions) == 1
    assert contradictions[0].severity == "medium"
    assert len(takeaways) == 1
