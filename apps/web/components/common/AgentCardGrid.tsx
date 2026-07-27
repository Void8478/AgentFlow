"use client";

import React, { useState } from "react";
import { AgentCard, AgentCardProps } from "./AgentCard";
import { Bot, Sparkles, Filter } from "lucide-react";

const initialAgents: AgentCardProps[] = [
  {
    id: "agent-01",
    name: "Lead System Architect",
    role: "DAG Decomposition & System Design",
    model: "llama3:latest",
    status: "streaming",
    progress: 72,
    latencyMs: 180,
    memoryUsage: "4.8 GB",
    tokensGenerated: 1420,
    tokensPerSec: 54,
    currentTask: "Generating Pydantic schemas for FastAPI multi-agent WebSocket dispatcher.",
  },
  {
    id: "agent-02",
    name: "Security & Vulnerability Auditor",
    role: "Static Analysis & Sanitization",
    model: "codellama:13b",
    status: "running",
    progress: 45,
    latencyMs: 310,
    memoryUsage: "7.2 GB",
    tokensGenerated: 890,
    tokensPerSec: 38,
    currentTask: "Scanning JWT session middleware for token expiration and cookie security flags.",
  },
  {
    id: "agent-03",
    name: "ChromaDB Vector Indexer",
    role: "Semantic Embedding & Retrieval",
    model: "nomic-embed-text",
    status: "completed",
    progress: 100,
    latencyMs: 45,
    memoryUsage: "1.1 GB",
    tokensGenerated: 3200,
    tokensPerSec: 0,
    currentTask: "Indexed 18,420 historical execution log vectors into persistent storage.",
  },
  {
    id: "agent-04",
    name: "Web Scraper & Synthesizer",
    role: "External Intelligence Gathering",
    model: "mistral:7b",
    status: "idle",
    progress: 0,
    latencyMs: 0,
    memoryUsage: "4.2 GB",
    tokensGenerated: 0,
    tokensPerSec: 0,
    currentTask: "Standing by for external RSS news feed ingestion directive.",
  },
];

export function AgentCardGrid() {
  const [agents, setAgents] = useState<AgentCardProps[]>(initialAgents);
  const [filter, setFilter] = useState<string>("all");

  const filteredAgents = agents.filter((a) => {
    if (filter === "active") return a.status === "running" || a.status === "streaming";
    if (filter === "completed") return a.status === "completed";
    return true;
  });

  const handleRun = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "streaming", progress: 15 } : a))
    );
  };

  const handlePause = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "idle" } : a))
    );
  };

  return (
    <div className="space-y-4">
      {/* Grid Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-extrabold text-white tracking-tight">
            Active Agent Swarm Monitor
          </h2>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            {agents.length} Agents
          </span>
        </div>

        <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === "all" ? "bg-indigo-600 text-white font-semibold" : "hover:text-white"
            }`}
          >
            All ({agents.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === "active" ? "bg-indigo-600 text-white font-semibold" : "hover:text-white"
            }`}
          >
            Active ({agents.filter((a) => a.status === "running" || a.status === "streaming").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === "completed" ? "bg-indigo-600 text-white font-semibold" : "hover:text-white"
            }`}
          >
            Completed ({agents.filter((a) => a.status === "completed").length})
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            {...agent}
            onRun={handleRun}
            onPause={handlePause}
          />
        ))}
      </div>
    </div>
  );
}
