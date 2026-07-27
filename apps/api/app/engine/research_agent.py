import json
import re
import logging
from typing import List, Dict, Any, Optional
from app.services.ai_providers.factory import ai_provider
from app.domain.tools import BaseTool, WebSearchToolInterface
from app.domain.research_schemas import (
    ResearchRequest,
    ResearchResponse,
    ResearchFinding,
)

logger = logging.getLogger("agentflow.engine.research")


class ResearchAgentError(Exception):
    """Custom exception raised when research execution fails."""
    pass


class ResearchAgent:
    SYSTEM_PROMPT = (
        "You are the Senior Research Agent in AgentFlow.\n"
        "Your task is to analyze research query topics and synthesize structured, verified technical findings.\n"
        "Return ONLY a valid JSON object matching the format below with NO extra commentary or markdown text:\n\n"
        "{\n"
        '  "summary": "Executive summary of technical research findings",\n'
        '  "findings": [\n'
        "    {\n"
        '      "topic": "Architecture & Specs",\n'
        '      "key_points": [\n'
        '        "Key insight bullet 1",\n'
        '        "Key insight bullet 2"\n'
        "      ],\n"
        '      "confidence_score": 0.95,\n'
        '      "sources": ["https://docs.agentflow.dev"]\n'
        "    }\n"
        "  ],\n"
        '  "references": ["https://docs.agentflow.dev"]\n'
        "}\n"
    )

    def __init__(self):
        self.tools: Dict[str, BaseTool] = {}
        # Register default web search interface tool
        self.register_tool(WebSearchToolInterface())

    def register_tool(self, tool: BaseTool) -> None:
        """Registers a tool into the research agent's toolkit."""
        self.tools[tool.name] = tool
        logger.info(f"Registered tool '{tool.name}' in ResearchAgent.")

    async def execute_research(self, req: ResearchRequest) -> ResearchResponse:
        """
        Executes deep technical research on a topic using tools and unified AI Provider synthesis.
        """
        context_data = ""
        references: List[str] = []

        # Execute web search tool if enabled and registered
        if req.enable_web_search and "web_search" in self.tools:
            try:
                res = await self.tools["web_search"].execute(req.query)
                if res.success and isinstance(res.data, dict):
                    results = res.data.get("results", [])
                    for item in results:
                        context_data += f"Source Title: {item.get('title')}\nSnippet: {item.get('snippet')}\n\n"
                        if item.get("url"):
                            references.append(item.get("url"))
            except Exception as err:
                logger.warning(f"Web search tool execution failed: {err}")

        prompt = f"Research Question / Topic: {req.query}\n"
        if context_data:
            prompt += f"\nExternal Search Context:\n{context_data}\n"

        try:
            response_text = await ai_provider.generate_completion(
                prompt=prompt,
                system_prompt=self.SYSTEM_PROMPT,
                model=req.model,
                temperature=0.2,
                json_output=True,
                timeout=req.timeout,
            )
            summary, findings, parsed_refs = self._parse_json_research(response_text)

            combined_refs = list(set(references + parsed_refs))

            return ResearchResponse(
                task_id=req.task_id,
                query=req.query,
                summary=summary,
                findings=findings,
                references=combined_refs,
            )

        except Exception as err:
            logger.error(f"Research synthesis failed: {err}")
            raise ResearchAgentError(f"Research synthesis error: {err}")

    def _parse_json_research(self, raw_text: str):
        """
        Parses JSON research response text from LLM.
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
            summary = data.get("summary", "Technical research completed.")
            raw_findings = data.get("findings", [])
            references = data.get("references", [])

            findings = []
            for item in raw_findings:
                findings.append(ResearchFinding(**item))

            if not findings:
                findings = [
                    ResearchFinding(
                        topic="General Overview",
                        key_points=[raw_text[:200]],
                        confidence_score=0.9,
                    )
                ]

            return summary, findings, references

        except Exception as err:
            logger.warning(f"Failed to parse research JSON: {err}")
            return (
                "Technical research analysis complete.",
                [
                    ResearchFinding(
                        topic="Core Research Insights",
                        key_points=[raw_text[:250]],
                        confidence_score=0.85,
                    )
                ],
                [],
            )


# Reusable Singleton Instance
research_agent = ResearchAgent()
