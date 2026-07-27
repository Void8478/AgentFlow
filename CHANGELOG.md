# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-27

This is the initial production-ready open-source release of **AgentFlow**.

### Added
- **Interactive Studio**: Drag-and-drop React Flow canvas layout (`@xyflow/react`) supporting custom nodes (`AgentNode`, `ToolNode`, `InputNode`, `OutputNode`, `RouterNode`) and animated connections showing real-time agent data transfers.
- **5 Specialized AI Agents**:
  - `Planner`: Autonomously parses and schedules tasks using Kahn's topological sort.
  - `Research`: Searches the web, retrieves pages, and summarizes content async.
  - `Analyst`: Deduplicates facts, extracts insights, and computes fact confidence scores.
  - `Writer`: Compiles Markdown reports, structures tables, and builds formatting blocks.
  - `Critic`: Measures quality, audits hallucinations, and controls state machine revision loops.
- **State Machine Orchestrator**: Supports full pipeline execution, research-only mode, and writer-critic only mode with automatic step retry policies.
- **Real-Time WebSockets Engine**: Stream token characters dynamically with connection status monitors and reconnection timers.
- **Supabase Authentication**: Integrated Google & GitHub OAuth providers, secure session cookie middlewares, and protected dashboard paths.
- **Tenant Isolation (RLS)**: Enforced PostgreSQL Row Level Security (RLS) rules across all user resources, including settings, runs, logs, and events.
- **Timeline History Replay**: View previous executions step-by-step with speed controls (`0.5x`, `1x`, `2x`, `4x`).
- **Exporter Engine**: Multi-format exports supporting Markdown, structured JSON, and PDF files.
- **WCAG 2.2 AA Accessibility**: Landmark elements, keyboard arrow navigation for command menus, outline indicators, and screen reader-friendly labels.
- **Backend Test Suite**: 18 unit tests cover core LLM connectors, DAG sorters, and orchestrator execution loops with 100% success rate.
