import pytest
from app.engine.research_agent import ResearchAgent
from app.domain.tools import BaseTool, ToolResult


class CustomSearchTool(BaseTool):
    name = "custom_search"
    description = "Custom test search tool"

    async def execute(self, query: str, **kwargs) -> ToolResult:
        return ToolResult(
            tool_name=self.name,
            success=True,
            data={"results": [{"title": "Test Title", "snippet": "Test snippet", "url": "https://test.org"}]},
        )


def test_research_agent_tool_registration():
    agent = ResearchAgent()
    custom_tool = CustomSearchTool()
    agent.register_tool(custom_tool)

    assert "custom_search" in agent.tools
    assert agent.tools["custom_search"].name == "custom_search"


def test_research_agent_json_parsing():
    agent = ResearchAgent()
    raw_response = """
    ```json
    {
      "summary": "Technical review of vector database performance.",
      "findings": [
        {
          "topic": "ChromaDB Indexing",
          "key_points": ["Supports HNSW indexing", "Fast cosine distance search"],
          "confidence_score": 0.98,
          "sources": ["https://chromadb.org"]
        }
      ],
      "references": ["https://chromadb.org"]
    }
    ```
    """

    summary, findings, refs = agent._parse_json_research(raw_response)
    assert "Technical review" in summary
    assert len(findings) == 1
    assert findings[0].topic == "ChromaDB Indexing"
    assert findings[0].confidence_score == 0.98
    assert refs == ["https://chromadb.org"]
