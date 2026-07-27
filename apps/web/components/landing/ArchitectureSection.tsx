"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Server, Cpu, Database, Network, ArrowRight } from "lucide-react";

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/15 relative overflow-hidden bg-[#0a0c12]/80">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>System Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Decoupled Clean Architecture Engine
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Designed for modularity, low latency, and zero vendor lock-in.
          </p>
        </div>

        {/* Architecture Grid Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Layer 1: Client Studio */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">1. Next.js 15 Client</h3>
                <p className="text-xs text-indigo-300">Visual Orchestration Studio</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                React Flow v12 Custom Canvas
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Zustand Real-time Store
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Framer Motion Glass UI
              </li>
            </ul>
          </motion.div>

          {/* Layer 2: FastAPI Engine */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">2. FastAPI Backend</h3>
                <p className="text-xs text-purple-300">DAG Orchestrator & WS Server</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Topological DAG Resolver
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                WebSocket Event Dispatcher
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Async Pydantic Pipelines
              </li>
            </ul>
          </motion.div>

          {/* Layer 3: Intelligence & Storage */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">3. Models & Persistence</h3>
                <p className="text-xs text-emerald-300">Local AI & Database Store</p>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-mono">
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Ollama Local LLM Models
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ChromaDB Vector Memory
              </li>
              <li className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Supabase PostgreSQL Database
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
