# 🚀 Production Deployment Reference Guide

This document details how to deploy the Next.js frontend, FastAPI backend, and Supabase database infrastructure of **AgentFlow** to cloud hosting providers.

---

## 🌐 1. Next.js Frontend Deployment (Vercel)

The Next.js 16 Web Studio can be deployed to Vercel in a few clicks.

### Steps
1. Push your code to your GitHub fork (e.g., `https://github.com/Void8478/AgentFlow`).
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import the `AgentFlow` repository.
4. Set the **Root Directory** option to: `apps/web`.
5. Add the following **Environment Variables**:

| Variable Key | Expected Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your production Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your production Supabase anonymous client key |
| `NEXT_PUBLIC_API_URL` | The deployed URL of your FastAPI backend (e.g., `https://api.yourdomain.com/api/v1`) |
| `NEXT_PUBLIC_WS_URL` | The WebSocket URL of your FastAPI backend (e.g., `wss://api.yourdomain.com/api/v1/ws`) |

6. Click **Deploy**.

---

## 🚀 2. FastAPI Backend Deployment

The backend service runs inside a Python environment and can be containerized using Docker.

### Dockerfile Example (`apps/api/Dockerfile`)
```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Hosting on Render / Railway
1. Create a new Web Service pointing to your `apps/api` directory.
2. Select **Docker** or **Python** build runtime.
3. Configure the following environment variables:

| Variable Key | Value Example | Description |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` | Set environment mode |
| `SECRET_KEY` | `your-secure-random-key` | Session security |
| `OLLAMA_BASE_URL` | `http://ollama-service:11434` | Endpoint to your Ollama runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase admin operations key |
| `TAVILY_API_KEY` | `tvly-...` | Pluggable search tool token |

---

## ⚡ 3. Supabase Migrations & DB Provisioning

To deploy your database structure to production:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** on the Supabase dashboard.
3. Copy and run the migration files in order:
   1. `supabase/migrations/20260727000000_init_agentflow.sql`
   2. `supabase/migrations/20260727010000_agentflow_core.sql`
   3. `supabase/migrations/20260727020000_security_rls.sql`
4. Setup your OAuth providers (Google / GitHub) in **Authentication -> Providers** and configure the redirect URLs pointing to your production Supabase endpoint:
   `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`

---

## 🦙 4. Production Ollama Deployment

To run Ollama in production alongside the API:
- **Cloud VM**: Deploy Ollama on a GPU-enabled VM (e.g. AWS EC2 `g4dn` or RunPod).
- **Run Service**:
  ```bash
  ollama serve
  ```
- **Pre-load Models**: Initialize models in a startup script:
  ```bash
  ollama pull llama3:latest
  ```
- **Access**: Ensure the FastAPI backend has access to Ollama's port (`11434`). Set `OLLAMA_BASE_URL` in the FastAPI env vars.
