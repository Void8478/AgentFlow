"use client";

import React from "react";
import Link from "next/link";
import { Plus, Bot, Radio, Shield, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create Agent Flow DAG",
      description: "Build a new visual orchestration workflow on the canvas.",
      href: "/studio",
      icon: <Plus className="w-5 h-5 text-indigo-400" />,
      badge: "Canvas Studio",
      border: "border-indigo-500/30 hover:border-indigo-500/60",
    },
    {
      title: "Configure Agent Spec",
      description: "Define system prompts, roles, and allowed tool permissions.",
      href: "/studio",
      icon: <Bot className="w-5 h-5 text-purple-400" />,
      badge: "LLM Directive",
      border: "border-purple-500/30 hover:border-purple-500/60",
    },
    {
      title: "Inspect WebSockets",
      description: "Connect to live FastAPI execution stream telemetry.",
      href: "/studio",
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      badge: "Real-time Stream",
      border: "border-emerald-500/30 hover:border-emerald-500/60",
    },
    {
      title: "Security & Guardrails Audit",
      description: "Test prompt safety filters and model isolation settings.",
      href: "/studio",
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      badge: "Sanitization",
      border: "border-amber-500/30 hover:border-amber-500/60",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
          Quick Control Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className={`glass-panel-interactive p-4 rounded-2xl border ${act.border} flex flex-col justify-between group transition-all`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                  {act.icon}
                </div>
                <span className="text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full">
                  {act.badge}
                </span>
              </div>

              <h4 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-slate-200">
              <span>Execute Action</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
