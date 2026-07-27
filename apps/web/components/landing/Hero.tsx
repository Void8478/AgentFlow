"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Bot,
  Wrench,
  PlayCircle,
  Flag,
  CheckCircle2,
  Activity,
  Cpu,
} from "lucide-react";
import { GithubIcon } from "./Icons";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      {/* Announcement Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <span>Open Source AI Agent Orchestration Platform</span>
        <span className="text-white/40">|</span>
        <span className="text-indigo-200 flex items-center gap-1">
          Explore Studio <ArrowRight className="w-3 h-3" />
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
      >
        Orchestrate Autonomous <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
          AI Agent Swarms
        </span>{" "}
        Visually.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
      >
        Watch multiple specialized AI agents collaborate in real time on an interactive
        node-based flow canvas. Built with Next.js 15, FastAPI, Ollama, and WebSockets.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          href="/studio"
          className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 group active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Launch Interactive Studio</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <GithubIcon className="w-4 h-4 text-slate-300" />
          <span>View Source Code</span>
        </a>
      </motion.div>

      {/* Interactive Agent Flow Visual Mockup Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-16 relative max-w-5xl mx-auto"
      >
        <div className="glass-panel rounded-2xl border border-white/15 p-2 sm:p-4 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl relative overflow-hidden">
          {/* Mockup Toolbar Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/40 rounded-t-xl mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                AgentFlow Studio — Research & Architecture Swarm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Execution
              </span>
            </div>
          </div>

          {/* Simulated Canvas Layout with Floating Nodes */}
          <div className="relative h-[340px] sm:h-[400px] w-full rounded-xl bg-black/50 border border-white/5 bg-grid-pattern p-6 flex flex-col justify-between overflow-hidden">
            {/* SVG Connecting Edges with Animated Flow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <line
                x1="20%"
                y1="50%"
                x2="45%"
                y2="30%"
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <line
                x1="20%"
                y1="50%"
                x2="45%"
                y2="70%"
                stroke="rgba(99, 102, 241, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <line
                x1="45%"
                y1="30%"
                x2="80%"
                y2="50%"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <line
                x1="45%"
                y1="70%"
                x2="80%"
                y2="50%"
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            </svg>

            {/* Input Trigger Node (Left) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[5%] top-[40%] glass-panel rounded-xl p-3 border border-purple-500/40 shadow-lg shadow-purple-500/10 min-w-[170px] text-left z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <PlayCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-white">Prompt Input</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Build Rust Backend API</p>
            </motion.div>

            {/* Agent Node 1 (Top Center) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[38%] top-[15%] glass-panel rounded-xl p-3.5 border border-indigo-500/50 shadow-lg shadow-indigo-500/20 min-w-[210px] text-left z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Lead Architect</h4>
                    <p className="text-[10px] text-slate-400">System Designer</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 animate-spin" />
                  Thinking
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-black/40 p-1.5 rounded border border-white/5">
                <Cpu className="w-3 h-3 text-indigo-400" />
                <span>llama3:latest</span>
              </div>
            </motion.div>

            {/* Agent Node 2 (Bottom Center) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[38%] top-[60%] glass-panel rounded-xl p-3.5 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 min-w-[210px] text-left z-10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Code Reviewer</h4>
                    <p className="text-[10px] text-slate-400">Security Audit</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Passed
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-black/40 p-1.5 rounded border border-white/5">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>codellama:latest</span>
              </div>
            </motion.div>

            {/* Output Node (Right) */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[5%] top-[40%] glass-panel rounded-xl p-3 border border-amber-500/40 shadow-lg shadow-amber-500/10 min-w-[170px] text-left z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Flag className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-white">Final Output</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for Deploy
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
