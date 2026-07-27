"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Command, Workflow } from "lucide-react";
import { CommandBar } from "./CommandBar";
import { GitHubRepoButton, StarOnGitHubButton } from "@/components/common/GitHubButton";

export function DashboardHeader() {
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  return (
    <>
      <header className="h-16 glass-panel border-b border-white/10 px-6 flex items-center justify-between select-none z-20">
        {/* Left: Operational Status Beacon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>ALL SYSTEMS NOMINAL</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-300">12ms Telemetry</span>
          </div>
        </div>

        {/* Right: Command Bar, GitHub & Studio Actions */}
        <div className="flex items-center gap-3">
          {/* Command Bar Trigger Button */}
          <button
            onClick={() => setCommandBarOpen(true)}
            aria-label="Open Command Menu (Ctrl+K)"
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs text-slate-400 transition-all hover:border-white/20 focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">Search commands or flows...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* GitHub Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <StarOnGitHubButton />
            <GitHubRepoButton />
          </div>

          {/* Launch Studio CTA */}
          <Link
            href="/studio"
            className="py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <Workflow className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Launch Studio</span>
          </Link>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
      />
    </>
  );
}
