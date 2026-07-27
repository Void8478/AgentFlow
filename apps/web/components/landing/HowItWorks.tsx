"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sliders, Play, Terminal, Layers } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Design Visual DAG Topology",
    description:
      "Drag and drop specialized agent nodes, tool integrations, and entry triggers onto the canvas.",
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: "02",
    title: "Configure Agent System Directives",
    description:
      "Set system prompt guardrails, assign local Ollama models (Llama 3, Mistral), and tune temperatures.",
    icon: <Sliders className="w-5 h-5 text-purple-400" />,
  },
  {
    step: "03",
    title: "Execute Multi-Agent Swarm",
    description:
      "Trigger execution. The FastAPI engine topologically resolves dependencies and runs agents concurrently.",
    icon: <Play className="w-5 h-5 text-emerald-400" />,
  },
  {
    step: "04",
    title: "Inspect Stream Telemetry",
    description:
      "Watch step-by-step reasoning unfold live with WebSocket streams, node status pulses, and logs.",
    icon: <Terminal className="w-5 h-5 text-amber-400" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How AgentFlow Works
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          From prompt trigger to final execution output in four intuitive steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-panel rounded-2xl p-6 border border-white/10 relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-indigo-400/40">
                  {item.step}
                </span>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
