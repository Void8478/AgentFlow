import re
import logging
from typing import Optional
from app.services.ai_providers.factory import ai_provider
from app.domain.writer_schemas import WriterRequest, WriterResponse

logger = logging.getLogger("agentflow.engine.writer")


class WriterAgentError(Exception):
    """Custom exception raised when document writing fails."""
    pass


class WriterAgent:
    SYSTEM_PROMPT = (
        "You are the Lead Technical Writer Agent in AgentFlow.\n"
        "Your role is to author publication-grade, professional Markdown technical documentation.\n\n"
        "Formatting Guidelines:\n"
        "1. Use clear Markdown heading hierarchies (# Title, ## Section, ### Sub-section).\n"
        "2. Include a Markdown comparison or metrics table using standard pipe syntax (`| Col 1 | Col 2 |`).\n"
        "3. Include bulleted and numbered lists for clarity.\n"
        "4. Include syntax-highlighted code blocks where relevant (e.g. ```python, ```typescript, ```sql).\n"
        "5. Output ONLY the raw Markdown document content. Do NOT wrap the document in extra json or introductory conversational text.\n"
    )

    async def generate_document(self, req: WriterRequest) -> WriterResponse:
        """
        Synthesizes technical research inputs into a publication-ready Markdown document using unified AI Provider.
        """
        prompt = f"# Document Topic: {req.topic}\n\n"
        if req.research_summary:
            prompt += f"Executive Summary Context:\n{req.research_summary}\n\n"
        if req.facts:
            prompt += "Verified Key Facts:\n" + "\n".join(f"- {f}" for f in req.facts) + "\n\n"

        prompt += (
            "Please generate the complete, beautifully formatted Markdown document following all heading, "
            "table, list, and code block formatting requirements."
        )

        try:
            markdown_content = await ai_provider.generate_completion(
                prompt=prompt,
                system_prompt=self.SYSTEM_PROMPT,
                model=req.model,
                temperature=0.4,
                json_output=False,
                timeout=req.timeout or 90.0,
            )
            markdown_content = markdown_content.strip()

            # Clean markdown if model added outer block wrappers
            markdown_content = self._clean_markdown_output(markdown_content)

            # Compute word count
            word_count = len(re.findall(r"\w+", markdown_content))

            return WriterResponse(
                title=req.topic,
                markdown_content=markdown_content,
                word_count=word_count,
            )

        except Exception as err:
            logger.error(f"Document generation failed: {err}")
            raise WriterAgentError(f"Document synthesis error: {err}")

    def _clean_markdown_output(self, raw_text: str) -> str:
        """Strips surrounding markdown code blocks if the model wrapped the entire output in ```markdown ... ```."""
        if raw_text.startswith("```markdown") and raw_text.endswith("```"):
            raw_text = raw_text[11:-3].strip()
        elif raw_text.startswith("```") and raw_text.endswith("```"):
            lines = raw_text.splitlines()
            if len(lines) >= 2:
                raw_text = "\n".join(lines[1:-1]).strip()
        return raw_text


# Reusable Singleton Instance
writer_agent = WriterAgent()
