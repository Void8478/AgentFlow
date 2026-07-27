"use client";

import React from "react";
import { Workflow, Activity, Zap, Database, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function StatisticsCards() {
  const stats = [
    {
      title: "Active Flow DAGs",
      value: "12",
      metric: "+2 created today",
      icon: <Workflow className="w-5 h-5 text-indigo-400" />,
      borderColor: "border-indigo-500/30",
      bgGradient: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    },
    {
      title: "Swarm Executions",
      value: "1,482",
      metric: "99.4% success rate",
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      borderColor: "border-emerald-500/30",
      bgGradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    },
    {
      title: "Avg Step Latency",
      value: "240ms",
      metric: "Local Ollama GPU",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      borderColor: "border-amber-500/30",
      bgGradient: "from-amber-500/15 via-amber-500/5 to-transparent",
    },
    {
      title: "Vector Memory Records",
      value: "18,420",
      metric: "ChromaDB indexed",
      icon: <Database className="w-5 h-5 text-purple-400" />,
      borderColor: "border-purple-500/30",
      bgGradient: "from-purple-500/15 via-purple-500/5 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.08 }}
          className={`glass-panel p-5 rounded-2xl border ${stat.borderColor} relative overflow-hidden group`}
        >
          {/* Ambient Glow Accent */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none`}
          />

          <div className="relative z-10 flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stat.title}</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              {stat.icon}
            </div>
          </div>

          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{stat.metric}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
