const rooms = new Map<string, Set<any>>();
const wsserver = Bun.serve({
  port: 3001,

  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }

    return new Response("WebSocket server");
  },

  websocket: {
    open(ws) {
      console.log("WebSocket client connected");
    },

    message(ws: any, message: string) {
      console.log("Received:", message);
      const data = JSON.parse(message);
     if (data.type === "new_message") {
  // console.log("NEW MESSAGE RECEIVED");
  // console.log("Room:", data.roomId);
  // console.log("Content:", data.content);
  // console.log("User:", data.user);
  // console.log("Full data:", data);

  const clients = rooms.get(data.roomId);

  if (!clients) {
    console.log("NO CLIENTS IN ROOM");
    return;
  }

  for (const client of clients) {
    console.log("BROADCASTING TO CLIENT");

    client.send(
      JSON.stringify({
        type: "new_message",
        roomId: data.roomId,
        content: data.content,
        user: data.user,
      }),
    );
  }
}
      if (data.type === "join_room") {
        const roomId = data.roomId;

        ws.roomId = roomId;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }

        rooms.get(roomId)!.add(ws);

        console.log(
          `Client joined room ${roomId}. Members: ${rooms.get(roomId)!.size}`,
        );
      }
    },

    close(ws) {
      console.log("WebSocket client disconnected");
    },
  },
});

console.log(`WebSocket server running on ${wsserver.port}`);
