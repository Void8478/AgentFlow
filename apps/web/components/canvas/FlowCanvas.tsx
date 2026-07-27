"use client";

import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/lib/store/useFlowStore";
import { AgentNode } from "./AgentNode";
import { ToolNode } from "./ToolNode";
import { InputNode } from "./InputNode";
import { OutputNode } from "./OutputNode";
import { RouterNode } from "./RouterNode";
import { AnimatedDataEdge } from "./AnimatedDataEdge";
import { Maximize, Plus, RotateCcw, Sparkles } from "lucide-react";

function CanvasToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { addNode, resetExecutionState } = useFlowStore();

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 glass-panel p-1.5 rounded-xl border border-white/10 shadow-xl">
      <button
        onClick={() => addNode("agent", { x: 400, y: 250 })}
        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Agent</span>
      </button>

      <button
        onClick={() => fitView({ padding: 0.2, duration: 400 })}
        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        title="Zoom to Fit Canvas"
      >
        <Maximize className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={resetExecutionState}
        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        title="Reset Canvas States"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    addNode,
  } = useFlowStore();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      agent: AgentNode,
      tool: ToolNode,
      input: InputNode,
      output: OutputNode,
      router: RouterNode,
    }),
    []
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      animatedData: AnimatedDataEdge,
    }),
    []
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - 300,
        y: event.clientY - 120,
      };

      addNode(type as any, position);
    },
    [addNode]
  );

  return (
    <div
      className="w-full h-full relative bg-[#07080a]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={2.5}
        colorMode="dark"
        defaultEdgeOptions={{
          type: "animatedData",
          animated: true,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="rgba(255, 255, 255, 0.08)"
        />

        <CanvasToolbar />

        <Controls className="!bg-[#12141a]/90 !border-white/10 shadow-2xl" />

        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "agent":
                return "#6366f1";
              case "tool":
                return "#10b981";
              case "input":
                return "#8b5cf6";
              case "output":
                return "#f59e0b";
              case "router":
                return "#ec4899";
              default:
                return "#64748b";
            }
          }}
          maskColor="rgba(7, 8, 10, 0.85)"
          className="!bg-[#12141a]/90 !border-white/10 !rounded-xl shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
}
