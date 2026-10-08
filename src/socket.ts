const WS_URL = process.env.KAIROS_WS_URL || "ws://localhost:3000/ws";
console.log("WS URL:", WS_URL);
const ws = new WebSocket(WS_URL);

let onmessage: ((message: any) => void) | null = null;

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === "new_message" || data.type === "file_share") {
      onmessage?.(data);
    }
  } catch (err) {
    console.error("Failed to parse websocket message:", err);
  }
};

export function setMessageHandler(handler: (message: any) => void) {
  onmessage = handler;
}



export function joinroomies(roomId: string) {
  ws.send(
    JSON.stringify({
      type: "join_room",
      roomId,
    }),
  );
}

export function sendSocketMessage(
  roomId: string,
  content: string,
  user: any,
) {
  ws.send(
    JSON.stringify({
      type: "new_message",
      roomId,
      content,
      user,
    }),
  );
}

export function sendFileShare(
  roomId: string,
  shareId: string,
  fileName: string,
  fileSize: number,
  user: any,
) {
  ws.send(
    JSON.stringify({
      type: "file_share",
      roomId,
      shareId,
      fileName,
      fileSize,
      user,
    }),
  );
}

let oncooneectionchange: ((connected: boolean) => void) | null = null;

export function setconncetionhandler(handler: (connected: boolean) => void) {
  oncooneectionchange = handler;
  // If socket is already open or closed when handler registers, notify immediately!
  if (ws.readyState === 1) {
    handler(true);
  } else if (ws.readyState === 2 || ws.readyState === 3) {
    handler(false);
  }
}

ws.onopen = () => {
  console.log("Connected to WebSocket");
  oncooneectionchange?.(true);
};

ws.onclose = (event) => {
  console.log("WebSocket CLOSED, code:", event.code, "reason:", event.reason);
  oncooneectionchange?.(false);
};

ws.onerror = (error) => {
  console.log("WebSocket error:", error);
  oncooneectionchange?.(false);
};

export default ws;