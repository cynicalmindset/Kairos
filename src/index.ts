import express from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import roomsRouter from './routes/rooms.ts';
import messagesRouter from "./routes/message.ts";
import profileRouter from "./routes/profile.ts";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/api/rooms", roomsRouter);
app.use("/api/rooms/:roomId/messages", messagesRouter);
app.use("/api/profile", profileRouter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
  });
});

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

const onlineUsers = new Map<string, {
  userId: string;
  username: string;
  ws: any;
  status: "online" | "away";
}>();


const rooms = new Map<string, Set<any>>();

const httpServer = createServer(app);

const wss = new WebSocketServer({
  server: httpServer,
  path: "/ws",
});

function braodcastpresence(){
  const user = Array.from(onlineUsers.values())
  const message = JSON.stringify({
    type:"presence:online",
    user
  });

  wss.clients.forEach((client)=>{
    if (client.readyState === 1) {
      client.send(message);
    }
  })
}

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");


  (ws as any).roomId = null;

  ws.on("message", (message) => {

    console.log("Received:", message.toString());
    const data = JSON.parse(message.toString());

    if (data.type === "join_room") {
      const roomId = data.roomId;

      (ws as any).roomId = roomId;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(ws);

      console.log(
        `Client joined room ${roomId}. Members: ${rooms.get(roomId)!.size}`,
      );

      return;
    }

    if (data.type === "new_message") {
      const clients = rooms.get(data.roomId);

      if (!clients) {
        console.log("NO CLIENTS IN ROOM");
        return;
      }

      for (const client of clients) {
        if (client.readyState === 1) {
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

      return;
    }

    if (data.type === "file_share") {
      const clients = rooms.get(data.roomId);

      if (!clients) {
        console.log("NO CLIENTS IN ROOM");
        return;
      }

      for (const client of clients) {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: "file_share",
              roomId: data.roomId,
              shareId: data.shareId,
              fileName: data.fileName,
              fileSize: data.fileSize,
              user: data.user,
            }),
          );
        }
      }
    }

    if(data.type === "presence:online"){
      (ws as any).userId = data.userId;
      (ws as any).username = data.username;

      onlineUsers.set(data.userId,{
        userId:data.userId,
        username:data.username,
        ws:ws,
        status:"online"
      })
    }
    braodcastpresence();

  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");

    const roomId = (ws as any).roomId;

    const userId = (ws as any).userId

    if(userId){
      onlineUsers.delete(userId)
      braodcastpresence();
    } 

    if (!roomId) return;

    const clients = rooms.get(roomId);

    if (clients) {
      clients.delete(ws);

      if (clients.size === 0) {
        rooms.delete(roomId);
      }
    }
  });
});

const PORT = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, () => {
  console.log(`Kairos server running on port ${PORT}`);
});