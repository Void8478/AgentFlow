"use client";

import React, { useState } from "react";
import { FlowCanvas } from "@/components/canvas/FlowCanvas";
import { WorkflowStreamView } from "@/components/studio/WorkflowStreamView";
import { TimelineReplay, TimelineStep } from "@/components/studio/TimelineReplay";
import {
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  Layers,
  Settings2,
  ChevronRight,
  Shield,
  Activity,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function StudioPage() {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>("wf-demo-01");
  const [activeReplayStep, setActiveReplayStep] = useState<TimelineStep | null>(null);

  const handleStepChange = (step: TimelineStep) => {
    setActiveReplayStep(step);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07080a] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Studio Header Bar */}
      <header className="h-14 border-b border-white/10 glass-panel px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">
                Live Orchestration Studio
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Multi-Agent DAG Canvas & Timeline Replay Engine
              </p>
            </div>
          </div>
        </div>

        {/* Status Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active Session
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/20">
            <Play className="w-3.5 h-3.5 fill-white" />
            Run Execution
          </button>
        </div>
      </header>

      {/* Main Studio Viewport split */}
      <div className="flex-1 flex min-h-0 relative">
        {/* React Flow Live Canvas Area */}
        <div className="flex-1 relative h-full min-w-0">
          <FlowCanvas />

          {/* Timeline Replay Floating Controller at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-30 max-w-4xl mx-auto">
            <TimelineReplay onStepChange={handleStepChange} />
          </div>
        </div>

        {/* Telemetry Stream Sidebar */}
        <div className="w-80 lg:w-96 border-l border-white/10 glass-panel p-4 flex flex-col gap-4 overflow-y-auto z-20">
          <WorkflowStreamView workflowId={activeWorkflowId} />
        </div>
      </div>
    </div>
  );
}
