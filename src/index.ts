import express from "express";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import roomsRouter from './routes/rooms.ts';
import messagesRouter from "./routes/message.ts";

dotenv.config();

const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use("/api/rooms", roomsRouter);
app.use("/api/rooms/:roomId/messages", messagesRouter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});