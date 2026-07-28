"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "error";

type StreamEventData = {
  content?: string;
  tokens_per_sec?: number;
  state?: string;
} & Record<string, unknown>;

export interface StreamEvent {
  workflow_id: string;
  event_type: "state_change" | "token_stream" | "step_progress" | "metrics" | "error";
  data: StreamEventData;
}

export function useWorkflowStream(workflowId: string | null) {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [tokenStream, setTokenStream] = useState<string>("");
  const [currentState, setCurrentState] = useState<string>("IDLE");
  const [tokensPerSec, setTokensPerSec] = useState<number>(0);
  const [stepLogs, setStepLogs] = useState<StreamEventData[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 3;

  const clearTimers = () => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const connect = useCallback(function connect() {
    if (!workflowId) return;

    clearTimers();
    if (reconnectAttemptsRef.current === 0) {
      setTokenStream("");
      setStepLogs([]);
    }

    const wsUrl = `ws://localhost:8000/api/v1/ws/workflows/${workflowId}`;
    setStatus(reconnectAttemptsRef.current > 0 ? "reconnecting" : "connecting");

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      reconnectAttemptsRef.current = 0;
      clearTimers();

      // Start heartbeat ping
      heartbeatTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, 15000);
    };

    ws.onmessage = (event) => {
      if (event.data === "pong") return;

      try {
        const payload: StreamEvent = JSON.parse(event.data);
        const { event_type, data } = payload;

        if (event_type === "token_stream") {
          setTokenStream((prev) => prev + (data.content || ""));
          if (data.tokens_per_sec) setTokensPerSec(data.tokens_per_sec);
        } else if (event_type === "state_change") {
          setCurrentState(data.state || "IDLE");
          setStepLogs((prev) => [...prev, data]);
        } else if (event_type === "metrics") {
          if (data.tokens_per_sec) setTokensPerSec(data.tokens_per_sec);
        }
      } catch (err) {
        console.warn("[WebSocket] Failed to parse event payload:", err);
      }
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      clearTimers();
      setStatus("disconnected");

      // Controlled reconnect attempts
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const timeout = 3000 * (reconnectAttemptsRef.current + 1);
        reconnectAttemptsRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, timeout);
      }
    };
  }, [workflowId]);

  useEffect(() => {
    if (workflowId) {
      reconnectAttemptsRef.current = 0;
      connect();
    }

    return () => {
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [workflowId, connect]);

  const clearStream = useCallback(() => {
    setTokenStream("");
  }, []);

  return {
    status,
    tokenStream,
    currentState,
    tokensPerSec,
    stepLogs,
    clearStream,
  };
}
