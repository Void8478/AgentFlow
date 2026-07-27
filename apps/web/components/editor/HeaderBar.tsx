"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFlowStore } from "@/lib/store/useFlowStore";
import { createClient } from "@/lib/supabase/client";
import { Play, RotateCcw, Activity, Sparkles, User, LogOut } from "lucide-react";

export function HeaderBar() {
  const {
    flowTitle,
    isExecuting,
    setExecuting,
    resetExecutionState,
    addExecutionLog,
    setNodeStatus,
    nodes,
  } = useFlowStore();

  const [wsConnected, setWsConnected] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    }
    fetchUser();
  }, [supabase]);

  const handleRunWorkflow = () => {
    if (isExecuting) return;

    setExecuting(true, `exec-${Date.now()}`);
    addExecutionLog({
      level: "info",
      message: "Starting AgentFlow DAG execution sequence...",
    });

    const agentNodes = nodes.filter((n) => n.type === "agent");
    const inputNodes = nodes.filter((n) => n.type === "input");
    const outputNodes = nodes.filter((n) => n.type === "output");

    inputNodes.forEach((n) => setNodeStatus(n.id, "running"));

    setTimeout(() => {
      inputNodes.forEach((n) => setNodeStatus(n.id, "completed"));
      addExecutionLog({
        level: "success",
        message: "Workflow entry trigger payload parsed.",
      });

      agentNodes.forEach((n) => setNodeStatus(n.id, "running"));
      addExecutionLog({
        level: "info",
        message: "Delegating task to Lead Orchestrator agent...",
      });

      setTimeout(() => {
        agentNodes.forEach((n) => setNodeStatus(n.id, "completed"));
        addExecutionLog({
          level: "success",
          message: "Ollama LLM agent generated modular architecture plan.",
        });

        outputNodes.forEach((n) => setNodeStatus(n.id, "running"));

        setTimeout(() => {
          outputNodes.forEach((n) => setNodeStatus(n.id, "completed"));
          addExecutionLog({
            level: "success",
            message: "Workflow completed successfully with 0 errors.",
          });
          setExecuting(false);
        }, 1200);
      }, 2000);
    }, 1000);
  };

  return (
    <header className="h-14 glass-panel border-b border-white/10 px-4 flex items-center justify-between z-20 select-none">
      {/* Title & Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-slate-100">{flowTitle}</h1>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              v0.1.0-alpha
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Production AI Agent Orchestration</p>
        </div>
      </div>

      {/* Execution Actions & User Profile */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-400 mr-2">
          <span
            className={`w-2 h-2 rounded-full ${
              wsConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className="text-[11px] font-mono">
            {wsConnected ? "WebSocket Connected" : "Disconnected"}
          </span>
        </div>

        <button
          onClick={handleRunWorkflow}
          disabled={isExecuting}
          className={`py-1.5 px-4 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            isExecuting
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95"
          }`}
        >
          {isExecuting ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin" />
              Running Flow...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Execute Flow
            </>
          )}
        </button>

        <button
          onClick={resetExecutionState}
          disabled={isExecuting}
          className="p-2 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors disabled:opacity-50"
          title="Reset Flow Execution"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        {/* User Account Trigger */}
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
        >
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline text-[11px] font-mono">
            {userEmail || "Account"}
          </span>
        </Link>
      </div>
    </header>
  );
}
