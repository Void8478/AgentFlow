import pytest
from app.engine.writer_agent import WriterAgent


def test_clean_markdown_output_wrapped():
    agent = WriterAgent()
    wrapped_text = """```markdown
# Title
## Section
| Col 1 | Col 2 |
| --- | --- |
| Val 1 | Val 2 |
```"""

    cleaned = agent._clean_markdown_output(wrapped_text)
    assert cleaned.startswith("# Title")
    assert cleaned.endswith("| Val 1 | Val 2 |")


def test_clean_markdown_output_normal():
    agent = WriterAgent()
    normal_text = "# Title\n\nParagraph text."
    cleaned = agent._clean_markdown_output(normal_text)
    assert cleaned == normal_text
