const WS_URL = process.env.KAIROS_WS_URL || "ws://localhost:3000/ws";
console.log("WS URL:", WS_URL);
const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  console.log("Connected to WebSocket");  
};

let onmessage: ((message: any) => void) | null = null;

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "new_message" || data.type === "file_share") {
    onmessage?.(data);
  }
};

export function setMessageHandler(
  handler: (message: any) => void,
) {
  onmessage = handler;
}

ws.onclose = (event) => {
  console.log("WebSocket CLOSED");
  console.log("code:", event.code);
  console.log("reason:", event.reason);
};

ws.onerror = (error) => {
  console.log("WebSocket error:", error);
};


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

let oncooneectionchange: ((connected: boolean)=> void) | null = null;

export function setconncetionhandler(handler:(connected:boolean)=>void){
  oncooneectionchange = handler;
}

ws.onopen = () => {
  oncooneectionchange?.(true)
}

ws.onclose = () => {
  oncooneectionchange?.(false)
}

ws.onerror = () => {
  oncooneectionchange?.(false)
}

export default ws;