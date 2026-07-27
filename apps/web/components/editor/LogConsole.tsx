"use client";

import React, { useState } from "react";
import { useFlowStore } from "@/lib/store/useFlowStore";
import { Terminal, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export function LogConsole() {
  const [isOpen, setIsOpen] = useState(true);
  const { executionLogs } = useFlowStore();

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "error":
        return <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div
      className={`glass-panel border-t border-white/10 transition-all duration-300 z-20 flex flex-col ${
        isOpen ? "h-48" : "h-9"
      }`}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 flex items-center justify-between cursor-pointer border-b border-white/5 bg-black/40 hover:bg-black/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-xs text-slate-200">Execution Console</span>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full">
            {executionLogs.length} logs
          </span>
        </div>

        <button className="text-slate-400 hover:text-slate-200">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Logs View */}
      {isOpen && (
        <div className="p-3 font-mono text-xs space-y-1.5 flex-1 overflow-y-auto bg-black/60">
          {executionLogs.length === 0 ? (
            <p className="text-slate-500 text-[11px] italic">
              No execution logs yet. Click "Execute Flow" above to start multi-agent orchestration.
            </p>
          ) : (
            executionLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-300"
              >
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                {getLogIcon(log.level)}
                <span className="flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
