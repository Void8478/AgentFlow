"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  FastForward,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export interface TimelineStep {
  step_index: number;
  state: string;
  active_node_id: string;
  timestamp: string;
  token_chunk?: string;
  description: string;
}

interface TimelineReplayProps {
  steps?: TimelineStep[];
  onStepChange?: (step: TimelineStep) => void;
}

const defaultSteps: TimelineStep[] = [
  {
    step_index: 0,
    state: "PLANNING",
    active_node_id: "node-1",
    timestamp: "00:00",
    description: "Planner Agent decomposing user prompt into DAG tasks.",
    token_chunk: "Planner: Initializing task breakdown...",
  },
  {
    step_index: 1,
    state: "RESEARCHING",
    active_node_id: "node-2",
    timestamp: "00:04",
    description: "Research Agent gathering technical context & docs.",
    token_chunk: "Researching vector database performance metrics...",
  },
  {
    step_index: 2,
    state: "ANALYZING",
    active_node_id: "node-3",
    timestamp: "00:09",
    description: "Analyst Agent deduplicating facts & computing confidence.",
    token_chunk: "Analyzing: 18 facts merged. 0 high severity contradictions.",
  },
  {
    step_index: 3,
    state: "WRITING",
    active_node_id: "node-4",
    timestamp: "00:15",
    description: "Writer Agent generating Markdown documentation.",
    token_chunk: "# Executive Summary\n\nFastAPI handles async WebSockets at 54 t/s.",
  },
  {
    step_index: 4,
    state: "CRITIQUING",
    active_node_id: "node-5",
    timestamp: "00:22",
    description: "Critic Agent evaluating accuracy & hallucination risk.",
    token_chunk: "Critic: Overall score 94/100. Approved for completion.",
  },
];

export function TimelineReplay({
  steps = defaultSteps,
  onStepChange,
}: TimelineReplayProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 2, 4

  const activeStep = steps[currentStepIdx] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = ((currentStepIdx + 1) / totalSteps) * 100;

  // Auto playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  // Notify parent on step change
  useEffect(() => {
    if (onStepChange && activeStep) {
      onStepChange(activeStep);
    }
  }, [currentStepIdx, onStepChange, activeStep]);

  const handlePlayPause = () => {
    if (currentStepIdx >= totalSteps - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentStepIdx((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3 shadow-2xl bg-[#07080a]">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <h4 className="text-xs font-extrabold text-white tracking-tight">
            Timeline Replay Controller
          </h4>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            Frame {currentStepIdx + 1}/{totalSteps}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Active Node:</span>
          <span className="text-emerald-400 font-bold">{activeStep.state}</span>
        </div>
      </div>

      {/* Progress Slider Track */}
      <div className="relative py-1">
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIdx}
          onChange={(e) => setCurrentStepIdx(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Control Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Step Description */}
        <div className="text-xs text-slate-300 font-mono truncate max-w-xs sm:max-w-md">
          <span className="text-indigo-400 font-bold mr-2">[{activeStep.timestamp}]</span>
          {activeStep.description}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset to frame 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Jump Back */}
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Previous step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Primary Trigger */}
          <button
            onClick={handlePlayPause}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20"
            title={isPlaying ? "Pause replay" : "Play replay"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
          </button>

          {/* Jump Forward */}
          <button
            onClick={handleNext}
            disabled={currentStepIdx === totalSteps - 1}
            className="p-2 rounded-xl glass-panel border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Next step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 glass-panel p-1 rounded-xl border border-white/10 text-[11px] font-mono text-slate-400 ml-1">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  speed === spd
                    ? "bg-indigo-600 text-white font-bold"
                    : "hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
