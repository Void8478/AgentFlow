-- ====================================================================
-- AgentFlow Core Schema Migration
-- Tables: users, agents, runs, events, logs, settings
-- Includes: Foreign Keys, Indexes, RLS Policies, Triggers
-- ====================================================================

-- 1. Helper Function: Automatic Updated At Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. USERS Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user'::text,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for users updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. AGENTS Table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    model TEXT DEFAULT 'llama3:latest'::text NOT NULL,
    system_prompt TEXT,
    temperature NUMERIC(3, 2) DEFAULT 0.70 CHECK (temperature >= 0.0 AND temperature <= 1.0),
    status TEXT DEFAULT 'idle'::text NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for agents updated_at
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. RUNS Table (Workflow Executions)
CREATE TABLE IF NOT EXISTS public.runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    workflow_type TEXT DEFAULT 'FULL_PIPELINE'::text NOT NULL,
    status TEXT DEFAULT 'IDLE'::text NOT NULL,
    prompt TEXT NOT NULL,
    revision_count INT DEFAULT 0 NOT NULL,
    max_revisions INT DEFAULT 3 NOT NULL,
    result JSONB,
    error TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. EVENTS Table (Telemetry & Token Streams)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. LOGS Table (Execution & Error Logs)
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.runs(id) ON DELETE CASCADE,
    level TEXT DEFAULT 'info'::text NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. SETTINGS Table (User Preferences & Config)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    ollama_host TEXT DEFAULT 'http://localhost:11434'::text NOT NULL,
    default_model TEXT DEFAULT 'llama3:latest'::text NOT NULL,
    enable_telemetry BOOLEAN DEFAULT true NOT NULL,
    theme TEXT DEFAULT 'dark'::text NOT NULL,
    api_keys JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for settings updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- Performance Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON public.runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON public.runs(status);
CREATE INDEX IF NOT EXISTS idx_events_run_id ON public.events(run_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_run_id ON public.logs(run_id);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- USERS Policies
CREATE POLICY "Users can select their own profile"
    ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- AGENTS Policies
CREATE POLICY "Users can manage their own agents"
    ON public.agents FOR ALL USING (auth.uid() = user_id);

-- RUNS Policies
CREATE POLICY "Users can manage their own workflow runs"
    ON public.runs FOR ALL USING (auth.uid() = user_id);

-- EVENTS Policies
CREATE POLICY "Users can select events for their runs"
    ON public.events FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.runs WHERE public.runs.id = public.events.run_id AND public.runs.user_id = auth.uid()));

CREATE POLICY "Users can insert events for their runs"
    ON public.events FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.runs WHERE public.runs.id = public.events.run_id AND public.runs.user_id = auth.uid()));

-- LOGS Policies
CREATE POLICY "Users can select logs for their runs"
    ON public.logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.runs WHERE public.runs.id = public.logs.run_id AND public.runs.user_id = auth.uid()));

CREATE POLICY "Users can insert logs for their runs"
    ON public.logs FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.runs WHERE public.runs.id = public.logs.run_id AND public.runs.user_id = auth.uid()));

-- SETTINGS Policies
CREATE POLICY "Users can manage their own settings"
    ON public.settings FOR ALL USING (auth.uid() = user_id);
