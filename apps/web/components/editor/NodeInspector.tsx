"use client";

import React from "react";
import { useFlowStore } from "@/lib/store/useFlowStore";
import { Sliders, Trash2, Cpu, Sparkles, Code2, ShieldAlert } from "lucide-react";

export function NodeInspector() {
  const { nodes, selectedNodeId, updateNodeConfig, deleteNode, selectNode } =
    useFlowStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-80 glass-panel border-l border-white/10 p-5 flex flex-col items-center justify-center text-center select-none text-slate-500">
        <Sliders className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
        <p className="text-xs font-medium">Select a node on the canvas</p>
        <p className="text-[11px] text-slate-600 mt-1 max-w-[180px]">
          Click any agent or tool node to inspect and tune parameters.
        </p>
      </aside>
    );
  }

  const { data } = selectedNode;

  return (
    <aside className="w-80 glass-panel border-l border-white/10 flex flex-col h-full z-10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="font-semibold text-sm text-slate-100">Node Configuration</h2>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Close
        </button>
      </div>

      {/* Configuration Form */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Node Title
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => updateNodeConfig(selectedNode.id, { label: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Role (Agent Node) */}
        {selectedNode.type === "agent" && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Agent Role
              </label>
              <input
                type="text"
                value={data.role || ""}
                placeholder="e.g. Code Reviewer, Researcher"
                onChange={(e) => updateNodeConfig(selectedNode.id, { role: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Ollama Model
              </label>
              <select
                value={data.model || "llama3:latest"}
                onChange={(e) => updateNodeConfig(selectedNode.id, { model: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="llama3:latest">Llama 3 (8B)</option>
                <option value="mistral:latest">Mistral (7B)</option>
                <option value="codellama:latest">CodeLlama</option>
                <option value="phi3:latest">Phi-3 Mini</option>
                <option value="qwen2:latest">Qwen 2</option>
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                System Directive Prompt
              </label>
              <textarea
                rows={5}
                value={data.systemPrompt || ""}
                placeholder="Define precise instructions and guardrails for this agent..."
                onChange={(e) => updateNodeConfig(selectedNode.id, { systemPrompt: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none"
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Temperature
                </label>
                <span className="text-xs font-mono text-indigo-400">
                  {data.temperature ?? 0.7}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={data.temperature ?? 0.7}
                onChange={(e) =>
                  updateNodeConfig(selectedNode.id, {
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </>
        )}
      </div>

      {/* Footer Delete */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full py-2 px-3 rounded-lg text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Node
        </button>
      </div>
    </aside>
  );
}
