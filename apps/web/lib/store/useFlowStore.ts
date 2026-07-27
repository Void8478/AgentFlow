import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from "@xyflow/react";

export type NodeType = "agent" | "tool" | "input" | "output" | "router";

export interface AgentNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  role?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  tools?: string[];
  status?: "idle" | "running" | "completed" | "failed";
}

export interface ExecutionLog {
  id: string;
  nodeId?: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
}

interface FlowState {
  // Flow Data
  flowId: string | null;
  flowTitle: string;
  flowDescription: string;
  nodes: Node<AgentNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Real-time Execution State
  isExecuting: boolean;
  activeExecutionId: string | null;
  nodeStatuses: Record<string, "idle" | "running" | "completed" | "failed">;
  executionLogs: ExecutionLog[];

  // Actions
  setFlowInfo: (id: string, title: string, description: string) => void;
  onNodesChange: OnNodesChange<Node<AgentNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeConfig: (nodeId: string, data: Partial<AgentNodeData>) => void;
  selectNode: (nodeId: string | null) => void;
  deleteNode: (nodeId: string) => void;

  // Execution Control
  setExecuting: (isExecuting: boolean, executionId?: string) => void;
  setNodeStatus: (nodeId: string, status: "idle" | "running" | "completed" | "failed") => void;
  addExecutionLog: (log: Omit<ExecutionLog, "id" | "timestamp">) => void;
  resetExecutionState: () => void;
}

const defaultInitialNodes: Node<AgentNodeData>[] = [
  {
    id: "input-1",
    type: "input",
    position: { x: 100, y: 200 },
    data: { label: "User Prompt Input", type: "input", status: "idle" },
  },
  {
    id: "agent-1",
    type: "agent",
    position: { x: 450, y: 150 },
    data: {
      label: "Lead Orchestrator",
      type: "agent",
      role: "System Architecture Planner",
      model: "llama3:latest",
      systemPrompt: "Analyze input user requests and decompose into modular execution plans.",
      temperature: 0.7,
      status: "idle",
    },
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 800, y: 200 },
    data: { label: "Final Execution Output", type: "output", status: "idle" },
  },
];

const defaultInitialEdges: Edge[] = [
  { id: "e1-2", source: "input-1", target: "agent-1", animated: true },
  { id: "e2-3", source: "agent-1", target: "output-1", animated: true },
];

export const useFlowStore = create<FlowState>((set, get) => ({
  flowId: null,
  flowTitle: "Agent Orchestration Pipeline",
  flowDescription: "Multi-agent collaborative workflow execution canvas",
  nodes: defaultInitialNodes,
  edges: defaultInitialEdges,
  selectedNodeId: "agent-1",

  isExecuting: false,
  activeExecutionId: null,
  nodeStatuses: {},
  executionLogs: [],

  setFlowInfo: (id, title, description) =>
    set({ flowId: id, flowTitle: title, flowDescription: description }),

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
    }),

  onConnect: (connection: Connection) =>
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    }),

  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node<AgentNodeData> = {
      id,
      type,
      position,
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type,
        model: type === "agent" ? "llama3:latest" : undefined,
        status: "idle",
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id,
    });
  },

  updateNodeConfig: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      }),
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  setExecuting: (isExecuting, executionId) =>
    set({ isExecuting, activeExecutionId: executionId || null }),

  setNodeStatus: (nodeId, status) => {
    set((state) => ({
      nodeStatuses: { ...state.nodeStatuses, [nodeId]: status },
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, status } } : node
      ),
    }));
  },

  addExecutionLog: (log) => {
    const newLog: ExecutionLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({ executionLogs: [newLog, ...state.executionLogs] }));
  },

  resetExecutionState: () => {
    set((state) => ({
      isExecuting: false,
      activeExecutionId: null,
      nodeStatuses: {},
      nodes: state.nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "idle" },
      })),
    }));
  },
}));
