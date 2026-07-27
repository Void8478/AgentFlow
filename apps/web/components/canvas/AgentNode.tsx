"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Bot, Cpu, Zap, Activity, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export interface AgentNodeData {
  label: string;
  role: string;
  model: string;
  status: "idle" | "running" | "streaming" | "completed" | "failed";
  progress?: number;
  tokensPerSec?: number;
  latencyMs?: number;
  [key: string]: unknown;
}

function AgentNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as AgentNodeData;
  const { label, role, model, status, progress = 0, tokensPerSec = 0, latencyMs = 0 } = nodeData;

  const isRunning = status === "running" || status === "streaming";
  const isCompleted = status === "completed";
  const isFailed = status === "failed";

  return (
    <div
      className={`glass-panel p-4 rounded-2xl min-w-[240px] max-w-[300px] border transition-all duration-300 relative group hardware-accelerated ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/20"
          : isRunning
          ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
          : isCompleted
          ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
          : isFailed
          ? "border-rose-500/50 shadow-lg shadow-rose-500/10"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* Target Connection Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-indigo-500 !border-2 !border-[#07080a] transition-all hover:scale-125"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-xl border ${
              isRunning
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isFailed
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            }`}
          >
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white tracking-tight leading-none">
              {label}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{role}</p>
          </div>
        </div>

        {/* Status Badge */}
        {isRunning && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            Active
          </span>
        )}
        {isCompleted && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Done
          </span>
        )}
        {isFailed && (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <AlertTriangle className="w-2.5 h-2.5" />
            Failed
          </span>
        )}
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 mb-3">
        <div className="bg-white/5 p-1.5 rounded-lg border border-white/5 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="truncate">{model}</span>
        </div>
        <div className="bg-white/5 p-1.5 rounded-lg border border-white/5 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>{tokensPerSec} t/s</span>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-slate-400">
            <span>Executing...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Source Connection Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-indigo-500 !border-2 !border-[#07080a] transition-all hover:scale-125"
      />
    </div>
  );
}

// Export memoized node to prevent unnecessary re-renders during React Flow pan/zoom
export const AgentNode = memo(AgentNodeComponent);
