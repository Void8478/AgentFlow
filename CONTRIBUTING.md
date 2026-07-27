# 🤝 Contributing to AgentFlow

Thank you for your interest in contributing to **AgentFlow**! We welcome contributions from everyone.

This document provides guidelines and instructions to help you get started with contributing to this open-source project.

---

## 🗺️ Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [support@agentflow.dev](mailto:support@agentflow.dev).

---

## 🛠️ Development Setup

AgentFlow is a monorepo consisting of:
- **`apps/web`**: Next.js 16 Web Studio (React, TypeScript, React Flow, Tailwind CSS)
- **`apps/api`**: FastAPI Python Backend Engine (FastAPI, Ollama, ChromaDB, Pytest)
- **`supabase`**: Database Schema & Migration files

### Prerequisites
- **Node.js** v18.0.0 or higher
- **Python** v3.11 or higher
- **Ollama** installed locally (see [Ollama.ai](https://ollama.com))

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Void8478/AgentFlow.git
   cd AgentFlow
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

3. **Frontend Development (`apps/web`)**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

4. **Backend Development (`apps/api`)**
   ```bash
   cd apps/api
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --port 8000
   ```

---

## 🧪 Testing Guidelines

Before submitting any Pull Request, you **must** ensure that all tests pass.

### Backend Tests
Run the pytest suite to verify agent logic, orchestrator state machine transitions, and service connectors:
```bash
cd apps/api
python -m pytest
```

### Frontend Builds
Verify that Next.js compiles cleanly with no TypeScript or linting errors:
```bash
cd apps/web
npm run build
```

---

## 🌿 Git Branching Policy

We use a simple branching structure for updates:
- **`main`**: The stable branch. Do not commit directly to `main`.
- **`feature/your-feature`**: For new components, agent features, or visual improvements.
- **`fix/your-fix`**: For resolving bugs, performance bottlenecks, or security improvements.

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new user-facing features (e.g., `feat: add PDF export option`)
- `fix:` for bug fixes (e.g., `fix: resolve WebSocket disconnection loop`)
- `docs:` for documentation modifications (e.g., `docs: update setup guidelines`)
- `style:` for changes that do not affect code logic (e.g., formatting, CSS alignment)
- `refactor:` for code restructurings that neither fix bugs nor add features
- `test:` for adding or fixing tests

Example:
```
feat: add timeline speed controls for history replay

- Integrated speed sliders for 0.5x, 1x, 2x, and 4x replay
- Updated state machine to respect ticks-per-second interval multiplier
```

---

## 🚀 Submitting a Pull Request

1. Fork the repository and create your branch from `main`.
2. Implement your changes, keeping coding style consistent.
3. Write/update unit tests if relevant.
4. Run verification steps (`python -m pytest` and `npm run build`).
5. Commit your changes following the commit conventions.
6. Push to your fork and submit a Pull Request to `main`.
7. Ensure all CI status checks pass.

Thank you for making AgentFlow better!
