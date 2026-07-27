"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Globe, Terminal, Shield } from "lucide-react";
import { GithubIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050608] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">AgentFlow</span>
            <p className="text-xs text-slate-500">Visual AI Multi-Agent Orchestration</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How it Works
          </a>
          <Link href="/studio" className="hover:text-white transition-colors">
            Studio Canvas
          </Link>
        </div>

        {/* Operational Beacon & Copyright */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Operational</span>
          </div>
          <span className="text-slate-600">© 2026 AgentFlow</span>
        </div>
      </div>
    </footer>
  );
}
