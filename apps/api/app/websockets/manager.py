from fastapi import WebSocket
from typing import Dict, Set, Any
import json
import logging
import asyncio

logger = logging.getLogger("agentflow.websockets")


class ConnectionManager:
    def __init__(self):
        # Maps workflow_id -> Set[WebSocket]
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, workflow_id: str):
        """Accepts WebSocket connection and subscribes it to workflow_id channel."""
        await websocket.accept()
        if workflow_id not in self.active_connections:
            self.active_connections[workflow_id] = set()
        self.active_connections[workflow_id].add(websocket)
        logger.info(f"WebSocket client connected to workflow channel [{workflow_id}].")

    def disconnect(self, websocket: WebSocket, workflow_id: str):
        """Removes WebSocket connection from channel."""
        if workflow_id in self.active_connections:
            self.active_connections[workflow_id].discard(websocket)
            if not self.active_connections[workflow_id]:
                del self.active_connections[workflow_id]
        logger.info(f"WebSocket client disconnected from workflow channel [{workflow_id}].")

    async def broadcast_event(self, workflow_id: str, event_type: str, data: Any):
        """
        Broadcasts structured JSON telemetry event to all clients listening on workflow_id.
        Event Types: 'state_change', 'token_stream', 'step_progress', 'metrics', 'error'
        """
        if workflow_id not in self.active_connections:
            return

        payload = {
            "workflow_id": workflow_id,
            "event_type": event_type,
            "data": data,
        }
        message = json.dumps(payload)
        dead_connections = set()

        for connection in self.active_connections[workflow_id]:
            try:
                await connection.send_text(message)
            except Exception as err:
                logger.warning(f"Error broadcasting to WebSocket client: {err}")
                dead_connections.add(connection)

        # Cleanup closed connections
        for dead_conn in dead_connections:
            self.disconnect(dead_conn, workflow_id)


# Reusable Singleton Instance
ws_manager = ConnectionManager()
