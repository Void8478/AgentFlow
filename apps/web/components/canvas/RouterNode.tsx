import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { GitFork, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { AgentNodeData } from "@/lib/store/useFlowStore";

export const RouterNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as AgentNodeData;
  const status = nodeData.status || "idle";

  return (
    <div
      className={`glass-panel-interactive min-w-[220px] rounded-xl p-3.5 transition-all duration-200 ${
        selected ? "border-pink-500 shadow-lg shadow-pink-500/20" : ""
      } ${
        status === "running"
          ? "border-amber-500/80 shadow-xl shadow-amber-500/30 animate-pulse"
          : status === "completed"
          ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
          : status === "failed"
          ? "border-rose-500 shadow-lg shadow-rose-500/20"
          : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-pink-500 !w-3 !h-3" />

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400">
          <GitFork className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-100 leading-none">
            {nodeData.label}
          </h3>
          <p className="text-[11px] font-mono text-pink-400 mt-1">Conditional Router</p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="true" className="!bg-emerald-500 !w-3 !h-3" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="false" className="!bg-rose-500 !w-3 !h-3" style={{ top: '70%' }} />
    </div>
  );
});

RouterNode.displayName = "RouterNode";
