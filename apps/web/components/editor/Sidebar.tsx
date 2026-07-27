"use client";

import React from "react";
import { Bot, Wrench, PlayCircle, Flag, Layers, Plus } from "lucide-react";
import { NodeType, useFlowStore } from "@/lib/store/useFlowStore";

interface NodePaletteItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badgeBg: string;
}

const nodeItems: NodePaletteItem[] = [
  {
    type: "agent",
    label: "AI Agent",
    description: "Autonomous LLM reasoning node",
    icon: <Bot className="w-4 h-4 text-indigo-400" />,
    color: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    type: "tool",
    label: "Tool Integration",
    description: "Code interpreter, web search or DB",
    icon: <Wrench className="w-4 h-4 text-emerald-400" />,
    color: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    type: "input",
    label: "Workflow Trigger",
    description: "User prompt / API payload input",
    icon: <PlayCircle className="w-4 h-4 text-purple-400" />,
    color: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/10 text-purple-400",
  },
  {
    type: "output",
    label: "Result Collector",
    description: "Aggregates final workflow output",
    icon: <Flag className="w-4 h-4 text-amber-400" />,
    color: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/10 text-amber-400",
  },
];

export function Sidebar() {
  const { addNode } = useFlowStore();

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-72 glass-panel border-r border-white/10 flex flex-col h-full z-10 select-none">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="font-semibold text-sm text-slate-100">Node Library</h2>
        </div>
        <span className="text-[10px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5">
          Drag & Drop
        </span>
      </div>

      {/* Palette */}
      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
        <p className="text-[11px] font-medium text-slate-400 px-1 uppercase tracking-wider">
          Available Components
        </p>

        {nodeItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            onClick={() => addNode(item.type, { x: 300, y: 200 })}
            className={`group glass-panel-interactive p-3 rounded-xl cursor-grab active:cursor-grabbing border ${item.color} flex items-start gap-3 transition-all duration-200`}
          >
            <div className={`p-2 rounded-lg ${item.badgeBg} border border-white/5 shrink-0`}>
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-xs text-slate-200 group-hover:text-white transition-colors">
                  {item.label}
                </h4>
                <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Presets Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <p className="text-[11px] text-slate-400 mb-2">Preset Workflows</p>
        <button
          onClick={() => {
            // Load sample agent team
          }}
          className="w-full py-1.5 px-3 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          Load Multi-Agent Research Preset
        </button>
      </div>
    </aside>
  );
}
