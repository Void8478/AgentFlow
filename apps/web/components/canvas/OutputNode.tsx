import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Flag, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { AgentNodeData } from "@/lib/store/useFlowStore";

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as AgentNodeData;
  const status = nodeData.status || "idle";

  return (
    <div
      className={`glass-panel min-w-[200px] rounded-xl p-3.5 transition-all duration-300 ${
        selected ? "border-amber-500 shadow-lg shadow-amber-500/20" : ""
      } ${
        status === "running"
          ? "border-amber-500/80 shadow-xl shadow-amber-500/30 animate-pulse"
          : status === "completed"
          ? "border-emerald-500/80 shadow-lg shadow-emerald-500/20"
          : status === "failed"
          ? "border-rose-500/80 shadow-lg shadow-rose-500/20"
          : "border-white/10"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-3 !h-3" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 leading-none">
              {nodeData.label}
            </h3>
            <p className="text-[11px] text-amber-400 mt-1">Final Result Destination</p>
          </div>
        </div>

        {status === "running" && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />}
        {status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        {status === "failed" && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
      </div>
    </div>
  );
});

OutputNode.displayName = "OutputNode";
