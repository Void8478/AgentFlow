"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Shield, Code, ArrowRight } from "lucide-react";
import { GithubIcon } from "./Icons";

export function OpenSourceSection() {
  return (
    <section id="open-source" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-[#0a0c12]/90 to-[#07080a] text-center relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-6">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>Community Driven & Transparent</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            100% Open Source. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300">
              Own Your AI Orchestration Stack.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300">
            No telemetry lock-in. No per-agent fees. Run locally on Ollama or deploy to
            Railway & Vercel with standard Docker containers.
          </p>

          {/* GitHub CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-semibold text-sm bg-white text-slate-950 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95"
            >
              <GithubIcon className="w-4 h-4 fill-current" />
              <span>Star on GitHub (1.4k Stars)</span>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Read Documentation</span>
            </a>
          </div>

          {/* Badges */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> MIT Permissive License
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <GithubIcon className="w-4 h-4 text-purple-400" /> 100% Public Repository
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-400" /> Developer Friendly API
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
