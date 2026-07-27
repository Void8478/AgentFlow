from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
import asyncio
from app.websockets.manager import ws_manager

logger = logging.getLogger("agentflow.api.ws")
router = APIRouter(prefix="/ws", tags=["WebSockets"])


@router.websocket("/workflows/{workflow_id}")
async def workflow_websocket_endpoint(websocket: WebSocket, workflow_id: str):
    """
    Real-time bidirectional WebSocket endpoint for streaming token outputs, state transitions,
    and telemetry metrics to the frontend client.
    """
    await ws_manager.connect(websocket, workflow_id)
    try:
        while True:
            # Heartbeat ping listener to keep connection alive
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, workflow_id)
    except Exception as err:
        logger.error(f"WebSocket error in workflow channel [{workflow_id}]: {err}")
        ws_manager.disconnect(websocket, workflow_id)
