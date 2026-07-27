from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class ToolResult(BaseModel):
    tool_name: str
    success: bool
    data: Any
    error: Optional[str] = None


class BaseTool(ABC):
    name: str
    description: str

    @abstractmethod
    async def execute(self, query: str, **kwargs) -> ToolResult:
        """Executes tool logic asynchronously and returns ToolResult."""
        pass


class WebSearchToolInterface(BaseTool):
    """
    Abstract interface for Web Search tools (Tavily, Exa, Serper).
    """
    name: str = "web_search"
    description: str = "Searches the web for real-time information, documentation, and data."

    async def execute(self, query: str, **kwargs) -> ToolResult:
        # Architecture placeholder interface ready for Tavily / Exa API key binding
        return ToolResult(
            tool_name=self.name,
            success=True,
            data={
                "query": query,
                "results": [
                    {
                        "title": f"Web Search Result for {query}",
                        "snippet": f"Detailed technical research details regarding {query}.",
                        "url": "https://docs.agentflow.dev/research",
                    }
                ],
            },
        )
