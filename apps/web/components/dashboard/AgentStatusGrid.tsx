"use client";

import React from "react";
import { Bot, Cpu, CheckCircle2, Activity, HardDrive, Zap } from "lucide-react";

interface AgentWorker {
  name: string;
  role: string;
  model: string;
  status: "idle" | "running" | "streaming";
  vram: string;
  temperature: number;
}

const workers: AgentWorker[] = [
  {
    name: "Lead System Architect",
    role: "DAG Planner & Decomposition",
    model: "llama3:8b-instruct",
    status: "running",
    vram: "4.8 GB VRAM",
    temperature: 0.7,
  },
  {
    name: "Code Reviewer & Auditor",
    role: "Static Analysis & AST Verification",
    model: "codellama:13b",
    status: "streaming",
    vram: "7.2 GB VRAM",
    temperature: 0.2,
  },
  {
    name: "Vector Memory Indexer",
    role: "ChromaDB Semantic Embedding",
    model: "nomic-embed-text",
    status: "idle",
    vram: "1.1 GB VRAM",
    temperature: 0.0,
  },
  {
    name: "Web Scraper & Researcher",
    role: "Information Synthesis Agent",
    model: "mistral:7b-instruct",
    status: "idle",
    vram: "4.2 GB VRAM",
    temperature: 0.6,
  },
];

export function AgentStatusGrid() {
  const getStatusBadge = (status: AgentWorker["status"]) => {
    switch (status) {
      case "running":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Activity className="w-3 h-3 animate-spin" /> Executing Task
          </span>
        );
      case "streaming":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 animate-pulse" /> Streaming Tokens
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Worker Ready
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4.5 h-4.5 text-purple-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
            Local Ollama Agent Workers
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ollama Local GPU Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {workers.map((w) => (
          <div
            key={w.name}
            className="glass-panel p-3.5 rounded-xl border border-white/10 bg-black/30 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-xs font-bold text-white">{w.name}</h4>
                <p className="text-[11px] text-slate-400">{w.role}</p>
              </div>
              {getStatusBadge(w.status)}
            </div>

            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-3 h-3 text-indigo-400" />
                {w.model}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <HardDrive className="w-3 h-3 text-purple-400" />
                {w.vram}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
