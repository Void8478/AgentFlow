"use client";

import React, { useEffect, useRef } from "react";
import { useWorkflowStream } from "@/hooks/useWorkflowStream";
import { Terminal, Activity, RefreshCw, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface WorkflowStreamViewProps {
  workflowId: string | null;
}

export function WorkflowStreamView({ workflowId }: WorkflowStreamViewProps) {
  const { status, tokenStream, currentState, tokensPerSec, stepLogs, clearStream } =
    useWorkflowStream(workflowId);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of token stream
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tokenStream]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4 font-sans bg-[#07080a]">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-extrabold text-white tracking-tight">
            Live Execution Stream Telemetry
          </h3>
          {workflowId && (
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-400">
              {workflowId}
            </span>
          )}
        </div>

        {/* Connection Status Badge */}
        <div className="flex items-center gap-2">
          {status === "connected" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Connected
            </span>
          )}
          {status === "reconnecting" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Reconnecting...
            </span>
          )}
          {status === "connecting" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Connecting...
            </span>
          )}
          {status === "disconnected" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-full">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="glass-panel p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-400">Active State</span>
          <span className="font-mono font-bold text-indigo-400">{currentState}</span>
        </div>
        <div className="glass-panel p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-400">Token Speed</span>
          <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {tokensPerSec} t/s
          </span>
        </div>
        <div className="glass-panel p-2.5 rounded-xl border border-white/5 flex items-center justify-between col-span-2 sm:col-span-1">
          <span className="text-slate-400">Steps Logged</span>
          <span className="font-mono font-bold text-white">{stepLogs.length}</span>
        </div>
      </div>

      {/* Terminal Token Buffer View */}
      <div className="relative bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-slate-200 h-64 overflow-y-auto space-y-2 selection:bg-indigo-500/30">
        {!tokenStream && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Activity className="w-6 h-6 animate-pulse text-indigo-500/50" />
            <p>Awaiting live token execution stream...</p>
          </div>
        )}

        {tokenStream && (
          <div className="whitespace-pre-wrap leading-relaxed tracking-wide">
            {tokenStream}
            <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
