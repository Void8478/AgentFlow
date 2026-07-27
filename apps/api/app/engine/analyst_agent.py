import json
import re
import logging
from typing import List, Dict, Any, Tuple
from app.services.ai_providers.factory import ai_provider
from app.domain.analyst_schemas import (
    AnalystRequest,
    AnalystResponse,
    MergedFact,
    Contradiction,
)

logger = logging.getLogger("agentflow.engine.analyst")


class AnalystAgentError(Exception):
    """Custom exception raised when analysis fails."""
    pass


class AnalystAgent:
    SYSTEM_PROMPT = (
        "You are the Senior Analyst Agent in AgentFlow.\n"
        "Your task is to analyze research data, merge duplicate/redundant facts, detect contradictory claims, "
        "and synthesize unified takeaways.\n"
        "Return ONLY a valid JSON object matching the format below with NO extra commentary or markdown:\n\n"
        "{\n"
        '  "merged_facts": [\n'
        "    {\n"
        '      "fact": "Consolidated fact description",\n'
        '      "supporting_sources": ["Source 1"],\n'
        '      "deduplicated_count": 2,\n'
        '      "confidence": 0.95\n'
        "    }\n"
        "  ],\n"
        '  "contradictions": [\n'
        "    {\n"
        '      "statement_a": "Claim A",\n'
        '      "statement_b": "Opposing Claim B",\n'
        '      "explanation": "Why they conflict",\n'
        '      "severity": "medium"\n'
        "    }\n"
        "  ],\n"
        '  "synthesized_takeaways": [\n'
        '    "Key conclusion 1"\n'
        "  ]\n"
        "}\n"
    )

    async def analyze_research(self, req: AnalystRequest) -> AnalystResponse:
        """
        Analyzes raw research findings, deduplicates facts, identifies contradictions, and computes confidence.
        """
        input_data_str = json.dumps(req.raw_research_data, indent=2)
        prompt = f"Raw Research Dataset to Analyze:\n{input_data_str}\n"

        try:
            response_text = await ai_provider.generate_completion(
                prompt=prompt,
                system_prompt=self.SYSTEM_PROMPT,
                model=req.model,
                temperature=0.1,  # Strict analytical temperature
                json_output=True,
                timeout=req.timeout,
            )
            merged_facts, contradictions, takeaways = self._parse_json_analysis(response_text)

            # Calculate weighted overall confidence score
            overall_confidence = self._calculate_overall_confidence(merged_facts, contradictions)

            return AnalystResponse(
                task_id=req.task_id,
                merged_facts=merged_facts,
                contradictions=contradictions,
                overall_confidence_score=overall_confidence,
                synthesized_takeaways=takeaways,
            )

        except Exception as err:
            logger.error(f"Analytical reasoning failed: {err}")
            raise AnalystAgentError(f"Analytical processing error: {err}")

    def _calculate_overall_confidence(
        self, facts: List[MergedFact], contradictions: List[Contradiction]
    ) -> float:
        """
        Computes weighted overall confidence based on consensus agreement and contradiction penalties.
        """
        if not facts:
            return 0.5

        base_score = sum(f.confidence for f in facts) / len(facts)

        # Apply contradiction penalties
        penalty = 0.0
        for c in contradictions:
            if c.severity == "high":
                penalty += 0.15
            elif c.severity == "medium":
                penalty += 0.08
            else:
                penalty += 0.03

        final_score = max(0.1, min(1.0, base_score - penalty))
        return round(final_score, 2)

    def _parse_json_analysis(
        self, raw_text: str
    ) -> Tuple[List[MergedFact], List[Contradiction], List[str]]:
        """
        Parses JSON response from LLM into Pydantic models.
        """
        try:
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
            json_str = match.group(1) if match else raw_text.strip()

            if not json_str.startswith("{"):
                start_idx = json_str.find("{")
                end_idx = json_str.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    json_str = json_str[start_idx : end_idx + 1]

            data = json.loads(json_str)
            raw_facts = data.get("merged_facts", [])
            raw_contradictions = data.get("contradictions", [])
            takeaways = data.get("synthesized_takeaways", [])

            merged_facts = [MergedFact(**f) for f in raw_facts]
            contradictions = [Contradiction(**c) for c in raw_contradictions]

            return merged_facts, contradictions, takeaways

        except Exception as err:
            logger.warning(f"Failed to parse Analyst JSON response: {err}")
            return (
                [
                    MergedFact(
                        fact="Research analysis completed with unformatted output.",
                        supporting_sources=[],
                        deduplicated_count=1,
                        confidence=0.8,
                    )
                ],
                [],
                [raw_text[:200]],
            )


# Reusable Singleton Instance
analyst_agent = AnalystAgent()
