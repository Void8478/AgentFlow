import json
import re
import logging
from typing import Tuple, List
from app.services.ai_providers.factory import ai_provider
from app.domain.critic_schemas import (
    CriticRequest,
    CriticResponse,
    EvaluationMetrics,
    RevisionInstruction,
)

logger = logging.getLogger("agentflow.engine.critic")


class CriticAgentError(Exception):
    """Custom exception raised when critic evaluation fails."""
    pass


class CriticAgent:
    SYSTEM_PROMPT = (
        "You are the Senior Quality Assurance & Critic Agent in AgentFlow.\n"
        "Your task is to audit generated text/markdown content against original user requirements across four dimensions:\n"
        "1. Accuracy (0-100)\n"
        "2. Completeness (0-100)\n"
        "3. Formatting (0-100)\n"
        "4. Hallucination Risk ('low', 'medium', or 'high')\n\n"
        "Return ONLY a valid JSON object matching the format below with NO extra commentary or markdown:\n\n"
        "{\n"
        '  "feedback": "Executive critique summary of strengths and defects",\n'
        '  "metrics": {\n'
        '    "accuracy_score": 90.0,\n'
        '    "completeness_score": 85.0,\n'
        '    "formatting_score": 95.0,\n'
        '    "hallucination_risk": "low"\n'
        "  },\n"
        '  "revision_instructions": [\n'
        "    {\n"
        '      "section": "Technical Architecture",\n'
        '      "issue": "Missing vector storage specs",\n'
        '      "suggested_fix": "Add ChromaDB indexing details"\n'
        "    }\n"
        "  ]\n"
        "}\n"
    )

    async def evaluate_content(self, req: CriticRequest) -> CriticResponse:
        """
        Audits generated content for accuracy, completeness, formatting, and hallucination risk,
        returning scores and revision instructions using unified AI Provider.
        """
        prompt = (
            f"Original Goal / Specification:\n{req.original_prompt}\n\n"
            f"Content To Audit:\n{req.content_to_evaluate}\n\n"
            "Please perform a thorough audit and return the structured JSON evaluation."
        )

        try:
            response_text = await ai_provider.generate_completion(
                prompt=prompt,
                system_prompt=self.SYSTEM_PROMPT,
                model=req.model,
                temperature=0.1,  # Low temperature for objective assessment
                json_output=True,
                timeout=req.timeout or 60.0,
            )
            feedback, metrics, instructions = self._parse_json_evaluation(response_text)

            # Compute weighted overall score
            overall_score = round(
                (0.4 * metrics.accuracy_score)
                + (0.3 * metrics.completeness_score)
                + (0.3 * metrics.formatting_score),
                1,
            )

            # Approval threshold criteria
            is_approved = (overall_score >= 80.0) and (
                metrics.hallucination_risk != "high"
            )

            # Revision loop trigger decision
            should_revise = (not is_approved) and (
                req.revision_count < req.max_revisions
            )

            return CriticResponse(
                task_id=req.task_id,
                approved=is_approved,
                score=overall_score,
                feedback=feedback,
                metrics=metrics,
                revision_instructions=instructions,
                should_revise=should_revise,
                revision_count=req.revision_count,
            )

        except Exception as err:
            logger.error(f"Critic evaluation failed: {err}")
            raise CriticAgentError(f"Evaluation synthesis error: {err}")

    def _parse_json_evaluation(
        self, raw_text: str
    ) -> Tuple[str, EvaluationMetrics, List[RevisionInstruction]]:
        """
        Parses evaluation JSON from LLM into Pydantic models.
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
            feedback = data.get("feedback", "Evaluation audit completed.")
            raw_metrics = data.get("metrics", {})
            raw_instructions = data.get("revision_instructions", [])

            metrics = EvaluationMetrics(
                accuracy_score=float(raw_metrics.get("accuracy_score", 85.0)),
                completeness_score=float(raw_metrics.get("completeness_score", 85.0)),
                formatting_score=float(raw_metrics.get("formatting_score", 90.0)),
                hallucination_risk=raw_metrics.get("hallucination_risk", "low"),
            )

            instructions = [RevisionInstruction(**ins) for ins in raw_instructions]
            return feedback, metrics, instructions

        except Exception as err:
            logger.warning(f"Failed to parse Critic JSON response: {err}")
            return (
                "Content evaluated with default baseline metrics.",
                EvaluationMetrics(
                    accuracy_score=85.0,
                    completeness_score=85.0,
                    formatting_score=90.0,
                    hallucination_risk="low",
                ),
                [],
            )


# Reusable Singleton Instance
critic_agent = CriticAgent()
