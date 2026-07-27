"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  Zap,
  HardDrive,
  Hash,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Terminal,
  Radio,
} from "lucide-react";

export type AgentCardStatus = "idle" | "running" | "streaming" | "completed" | "failed";

export interface AgentCardProps {
  id: string;
  name: string;
  role: string;
  model: string;
  status: AgentCardStatus;
  progress: number; // 0 to 100
  latencyMs: number;
  memoryUsage: string;
  tokensGenerated: number;
  currentTask: string;
  tokensPerSec?: number;
  onRun?: (id: string) => void;
  onPause?: (id: string) => void;
  onInspectLogs?: (id: string) => void;
}

export function AgentCard({
  id,
  name,
  role,
  model,
  status,
  progress,
  latencyMs,
  memoryUsage,
  tokensGenerated,
  currentTask,
  tokensPerSec = 42,
  onRun,
  onPause,
  onInspectLogs,
}: AgentCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "streaming":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
            Streaming {tokensPerSec} t/s
          </span>
        );
      case "running":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <Activity className="w-3 h-3 text-amber-400 animate-spin" />
            Executing
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2.5 py-0.5 rounded-full">
            Ready
          </span>
        );
    }
  };

  const getBorderGlow = () => {
    switch (status) {
      case "streaming":
        return "border-indigo-500/60 shadow-xl shadow-indigo-500/20";
      case "running":
        return "border-amber-500/70 shadow-xl shadow-amber-500/20 animate-pulse";
      case "completed":
        return "border-emerald-500/60 shadow-lg shadow-emerald-500/15";
      case "failed":
        return "border-rose-500/60 shadow-lg shadow-rose-500/15";
      default:
        return "border-white/10 hover:border-white/20";
    }
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group ${getBorderGlow()}`}
    >
      {/* Background Ambient Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 pointer-events-none ${
          status === "streaming"
            ? "from-indigo-500/15 via-purple-500/5 to-transparent opacity-100"
            : status === "running"
            ? "from-amber-500/15 via-amber-500/5 to-transparent opacity-100"
            : status === "completed"
            ? "from-emerald-500/15 via-emerald-500/5 to-transparent opacity-100"
            : "from-white/5 to-transparent opacity-40 group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border transition-colors ${
                status === "streaming"
                  ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                  : status === "running"
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : status === "completed"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-none">
                {name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{role}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Current Task Directive */}
        <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>CURRENT DIRECTIVE</span>
            {status === "streaming" && (
              <span className="text-indigo-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Active Stream
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-200 line-clamp-2 leading-relaxed">
            {currentTask}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Task Progress</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/50 border border-white/5 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                status === "streaming" || status === "running"
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 shadow-md shadow-indigo-500/50"
                  : status === "completed"
                  ? "bg-emerald-500"
                  : status === "failed"
                  ? "bg-rose-500"
                  : "bg-slate-600"
              }`}
            />
          </div>
        </div>

        {/* Telemetry Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          {/* Latency */}
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400 text-[10px] block flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Latency
            </span>
            <span className="text-slate-100 font-semibold mt-0.5 block">
              {latencyMs}ms
            </span>
          </div>

          {/* Memory */}
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400 text-[10px] block flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-purple-400" /> Memory
            </span>
            <span className="text-slate-100 font-semibold mt-0.5 block">
              {memoryUsage}
            </span>
          </div>

          {/* Tokens */}
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400 text-[10px] block flex items-center gap-1">
              <Hash className="w-3 h-3 text-emerald-400" /> Tokens
            </span>
            <span className="text-slate-100 font-semibold mt-0.5 block">
              {tokensGenerated.toLocaleString()} t
            </span>
          </div>

          {/* Model */}
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <span className="text-slate-400 text-[10px] block flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" /> Model
            </span>
            <span className="text-slate-100 font-semibold mt-0.5 block truncate">
              {model}
            </span>
          </div>
        </div>

        {/* Controls Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {status === "running" || status === "streaming" ? (
              <button
                onClick={() => onPause?.(id)}
                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs transition-colors"
                title="Pause Agent Execution"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onRun?.(id)}
                className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs transition-colors"
                title="Trigger Agent Run"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={() => onInspectLogs?.(id)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors flex items-center gap-1 font-mono"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px]">Logs</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            ID: {id}
          </span>
        </div>
      </div>
    </div>
  );
}
