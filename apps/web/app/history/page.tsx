"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  History,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  Sparkles,
} from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  workflow_type: string;
  status: string;
  prompt: string;
  revision_count: number;
  started_at: string;
  completed_at?: string;
  final_output_preview?: string;
}

const initialHistory: HistoryItem[] = [
  {
    id: "run-101",
    title: "Microservice Architecture Plan",
    workflow_type: "FULL_PIPELINE",
    status: "COMPLETED",
    prompt: "Design a high-throughput microservices architecture with FastAPI and Kafka.",
    revision_count: 1,
    started_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3300000).toISOString(),
    final_output_preview: "# Microservice Architecture\n\n- FastAPI Gateway\n- Kafka Event Bus",
  },
  {
    id: "run-102",
    title: "ChromaDB HNSW Performance Benchmark",
    workflow_type: "RESEARCH_ONLY",
    status: "COMPLETED",
    prompt: "Compare ChromaDB HNSW cosine similarity latency against Pgvector.",
    revision_count: 0,
    started_at: new Date(Date.now() - 7200000).toISOString(),
    completed_at: new Date(Date.now() - 7000000).toISOString(),
    final_output_preview: "Benchmark results show ChromaDB HNSW yields 4.2ms search latency.",
  },
  {
    id: "run-103",
    title: "Ollama Stream Cancellation Audit",
    workflow_type: "WRITER_CRITIC_ONLY",
    status: "FAILED",
    prompt: "Audit async socket disconnection during streaming token responses.",
    revision_count: 3,
    started_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "run-104",
    title: "Supabase RLS Policy Audit & Verification",
    workflow_type: "FULL_PIPELINE",
    status: "COMPLETED",
    prompt: "Verify Row Level Security policies across users, runs, and settings tables.",
    revision_count: 0,
    started_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 86000000).toISOString(),
    final_output_preview: "All 6 core tables verified with active RLS tenant isolation.",
  },
];

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>(initialHistory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || item.status.toUpperCase() === selectedStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setIsDeleting(null);
    }, 400);
  };

  const handleReplay = (item: HistoryItem) => {
    // Navigate to studio with replayed prompt query
    router.push(`/studio?prompt=${encodeURIComponent(item.prompt)}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080a] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <DashboardHeader />

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 relative bg-grid-pattern">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <History className="w-6 h-6 text-indigo-400" />
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  Workflow Execution History
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Inspect, search, replay, and manage past AI agent swarm executions.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 glass-panel px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{filteredItems.length} Executions Recorded</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search workflows by prompt or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white placeholder:text-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
              />
            </div>

            {/* Filter Status Pills */}
            <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10 text-xs text-slate-400 overflow-x-auto">
              <Filter className="w-3.5 h-3.5 ml-1.5 text-slate-500 flex-shrink-0" />
              {["ALL", "COMPLETED", "FAILED", "RUNNING"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    selectedStatus === st
                      ? "bg-indigo-600 text-white font-semibold"
                      : "hover:text-white"
                  }`}
                >
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* History Runs List */}
          <div className="space-y-3">
            {filteredItems.length === 0 && (
              <div className="glass-panel p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <History className="w-8 h-8 text-slate-600" />
                <p className="text-sm font-medium">No workflow executions found.</p>
                <p className="text-xs">Try adjusting your search query or status filter.</p>
              </div>
            )}

            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all space-y-3 ${
                  isDeleting === item.id ? "opacity-30 scale-95" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    {item.status === "COMPLETED" && (
                      <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    {item.status === "FAILED" && (
                      <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                    {item.status === "RUNNING" && (
                      <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
                        <Clock className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {item.id} • Topology: {item.workflow_type}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleReplay(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
                      title="Replay workflow prompt in studio"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Replay
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete run"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt Directive */}
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
                  {item.prompt}
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-2 font-mono">
                  <span>Revisions: {item.revision_count}</span>
                  <span>Started: {new Date(item.started_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-slate-400 font-mono">
              Page {page} of 1
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={true}
                className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
