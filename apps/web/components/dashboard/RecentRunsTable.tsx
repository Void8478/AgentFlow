"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface ExecutionRun {
  id: string;
  flowTitle: string;
  trigger: "manual" | "api" | "cron";
  status: "completed" | "running" | "failed";
  duration: string;
  startedAt: string;
}

const runs: ExecutionRun[] = [
  {
    id: "exec-9482",
    flowTitle: "Agent Orchestration Pipeline",
    trigger: "manual",
    status: "completed",
    duration: "4.2s",
    startedAt: "2 mins ago",
  },
  {
    id: "exec-9481",
    flowTitle: "Automated Code Security Audit",
    trigger: "api",
    status: "running",
    duration: "1.8s",
    startedAt: "5 mins ago",
  },
  {
    id: "exec-9480",
    flowTitle: "Vector Memory Indexing Swarm",
    trigger: "cron",
    status: "completed",
    duration: "12.4s",
    startedAt: "1 hour ago",
  },
  {
    id: "exec-9479",
    flowTitle: "Research & Synthesis Workflow",
    trigger: "manual",
    status: "completed",
    duration: "8.1s",
    startedAt: "3 hours ago",
  },
  {
    id: "exec-9478",
    flowTitle: "Database Migration Synthesizer",
    trigger: "api",
    status: "failed",
    duration: "0.9s",
    startedAt: "5 hours ago",
  },
];

export function RecentRunsTable() {
  const getStatusBadge = (status: ExecutionRun["status"]) => {
    switch (status) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Loader2 className="w-3 h-3 animate-spin" /> Executing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
            Recent Workflow Execution Runs
          </h3>
        </div>
        <Link
          href="/studio"
          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="pb-3 pt-1 font-semibold">Run ID</th>
              <th className="pb-3 pt-1 font-semibold">Flow DAG Title</th>
              <th className="pb-3 pt-1 font-semibold">Trigger</th>
              <th className="pb-3 pt-1 font-semibold">Status</th>
              <th className="pb-3 pt-1 font-semibold">Duration</th>
              <th className="pb-3 pt-1 font-semibold text-right">Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-3 font-semibold text-indigo-400">{run.id}</td>
                <td className="py-3 text-slate-200 font-sans font-medium">
                  {run.flowTitle}
                </td>
                <td className="py-3 text-slate-400 capitalize">{run.trigger}</td>
                <td className="py-3">{getStatusBadge(run.status)}</td>
                <td className="py-3 text-slate-400">{run.duration}</td>
                <td className="py-3 text-slate-500 text-right">{run.startedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
