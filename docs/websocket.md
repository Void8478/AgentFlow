# ⚡ WebSocket Streaming Protocol

AgentFlow uses a full-duplex WebSocket connection to stream real-time agent output tokens, execute UI state updates (e.g., node highlight controls), and monitor orchestrator transitions.

---

## 🔌 Connection Setup

Once a workflow is initialized via `POST /api/v1/workflows`, the client opens a WebSocket connection to the following endpoint:
```
ws://localhost:8000/api/v1/ws/{workflow_id}
```

### Connection Flow
1. **Initiate**: The client sends a connection handshake.
2. **Authorize**: The server authorizes the connection check using the path parameters.
3. **Loop**: The server streams telemetry messages as events occur.
4. **Heartbeat**: The server keeps the socket connection open with regular heartbeat checks.
5. **Disconnect**: The server closes the socket gracefully when the workflow reaches `COMPLETED`, `FAILED`, or `CANCELLED`.

---

## 📡 Message Payloads

All messages are sent as serialized JSON strings. The messages follow a common structure:
```json
{
  "type": "string",
  "workflow_id": "string",
  "timestamp": "string",
  "payload": {}
}
```

### 1. Connection Status Message
Sent immediately upon connection acceptance:
```json
{
  "type": "connection_established",
  "workflow_id": "wf-a8c7b3d2",
  "timestamp": "2026-07-27T11:20:00Z",
  "payload": {
    "status": "connected",
    "heartbeat_interval_seconds": 30
  }
}
```

### 2. State Transition Message
Broadcast when the orchestrator changes state (e.g., transitioning from `PLANNING` to `RESEARCHING`):
```json
{
  "type": "state_transition",
  "workflow_id": "wf-a8c7b3d2",
  "timestamp": "2026-07-27T11:20:02Z",
  "payload": {
    "from_state": "PLANNING",
    "to_state": "RESEARCHING",
    "details": "Executing deep research on planned topics."
  }
}
```

### 3. Agent Execution Output (Token Stream)
Streams individual tokens in real time when the Writer Agent is drafting a report:
```json
{
  "type": "agent_stream_token",
  "workflow_id": "wf-a8c7b3d2",
  "timestamp": "2026-07-27T11:20:45Z",
  "payload": {
    "agent_role": "writer",
    "revision_index": 0,
    "token": "architecture",
    "total_tokens_streamed": 142,
    "tokens_per_second": 24.5
  }
}
```

### 4. Step Complete Message
Sent when a task completes, delivering findings or reports:
```json
{
  "type": "step_completed",
  "workflow_id": "wf-a8c7b3d2",
  "timestamp": "2026-07-27T11:21:05Z",
  "payload": {
    "step_name": "WRITING",
    "results_preview": "# Architecture Overview...",
    "score": 85
  }
}
```

---

## 🛠️ Reconnection & Timeout Strategy
The frontend client in [hooks/useWorkflowStream.ts](file:///c:/Users/Void/Projects/AgentFlow/apps/web/hooks/useWorkflowStream.ts) implements safety features for WebSockets:
1. **Exponential Backoff**: If the socket drops unexpectedly, the client attempts reconnection with an escalating delay up to `30s`.
2. **Heartbeat Fail-Safe**: If no heartbeat or update is received from the server for `45s`, the client declares a timeout, terminates the socket, and transitions state to `error`.
3. **Graceful Cleanup**: Heartbeat timers and active WebSocket instances are registered to `useRef` hooks to prevent memory leaks during page navigation.
