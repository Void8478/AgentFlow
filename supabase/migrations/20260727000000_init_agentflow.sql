-- AgentFlow Supabase PostgreSQL Initial Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Flows Table
CREATE TABLE IF NOT EXISTS public.flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Nodes Table
CREATE TABLE IF NOT EXISTS public.nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('agent', 'tool', 'input', 'output', 'router')),
    name VARCHAR(255) NOT NULL,
    position_x FLOAT NOT NULL DEFAULT 0.0,
    position_y FLOAT NOT NULL DEFAULT 0.0,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Edges Table
CREATE TABLE IF NOT EXISTS public.edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    source_handle VARCHAR(100),
    target_handle VARCHAR(100),
    label VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reusable Agent Specifications Table
CREATE TABLE IF NOT EXISTS public.agent_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    default_model VARCHAR(100) DEFAULT 'llama3:latest',
    temperature FLOAT DEFAULT 0.7,
    tools_allowed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Executions Table
CREATE TABLE IF NOT EXISTS public.executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    trigger_type VARCHAR(50) DEFAULT 'manual',
    error_message TEXT
);

-- 6. Execution Step Logs Table
CREATE TABLE IF NOT EXISTS public.execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES public.executions(id) ON DELETE CASCADE,
    node_id UUID REFERENCES public.nodes(id) ON DELETE SET NULL,
    log_level VARCHAR(20) DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warning', 'error')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high performance real-time queries
CREATE INDEX IF NOT EXISTS idx_nodes_flow_id ON public.nodes(flow_id);
CREATE INDEX IF NOT EXISTS idx_edges_flow_id ON public.edges(flow_id);
CREATE INDEX IF NOT EXISTS idx_executions_flow_id ON public.executions(flow_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_execution_id ON public.execution_logs(execution_id);
