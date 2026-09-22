const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log("Connected to WebSocket");
//   ws.send("hello from CLI");
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

ws.onclose = () => {
  console.log("WebSocket disconnected");
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

export default ws;