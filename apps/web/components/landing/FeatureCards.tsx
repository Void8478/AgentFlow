"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Workflow,
  Cpu,
  Database,
  Zap,
  Server,
  ShieldCheck,
  Code2,
  Sparkles,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  gradient: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    icon: <Workflow className="w-6 h-6 text-indigo-400" />,
    title: "Visual DAG Flow Engine",
    description:
      "Construct multi-agent topologies with drag-and-drop custom nodes, topological execution ordering, and visual dependency edges.",
    badge: "React Flow v12",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    borderColor: "hover:border-indigo-500/50",
  },
  {
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    title: "Local Ollama LLM Swarm",
    description:
      "Run open models locally (Llama 3, Mistral, CodeLlama) with 0 third-party API costs, zero data leakage, and full prompt privacy.",
    badge: "Ollama Async Client",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    borderColor: "hover:border-purple-500/50",
  },
  {
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    title: "ChromaDB Semantic Memory",
    description:
      "Vector memory retrieval allowing autonomous agents to query historical execution contexts, docs, and prior reasoning steps.",
    badge: "Vector Store",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    borderColor: "hover:border-emerald-500/50",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Real-Time WebSocket Streams",
    description:
      "Watch agents collaborate live. Telemetry logs, token streams, and execution node status pulses stream directly to the browser UI.",
    badge: "FastAPI WebSockets",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    borderColor: "hover:border-amber-500/50",
  },
  {
    icon: <Server className="w-6 h-6 text-cyan-400" />,
    title: "Supabase PostgreSQL Persistence",
    description:
      "Production-grade relational schema storing flow graphs, execution run histories, agent specifications, and audit logs.",
    badge: "Supabase MCP Connected",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    borderColor: "hover:border-cyan-500/50",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
    title: "Clean Architecture & SOLID",
    description:
      "Built for enterprise extensibility. Strictly decoupled domain models, Pydantic schemas, and modular Next.js components.",
    badge: "Production Ready",
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    borderColor: "hover:border-rose-500/50",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Engineered for High-Performance <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Multi-Agent Intelligence
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Everything you need to build, test, and monitor autonomous AI workflows in a single open-source platform.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`glass-panel-interactive rounded-2xl p-6 relative overflow-hidden border border-white/10 ${feature.borderColor} group`}
          >
            {/* Ambient Background Gradient Accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1 text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
