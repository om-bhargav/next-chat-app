import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import directChatHandlers from "./handlers/directChatHandlers";
import statusHandlers from "./handlers/statusHandlers";
import express from "express";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = express();
const httpServer = createServer(app);
const socketToUser = new Map<string, string>();
const onlineUsers = new Map<string, Set<string>>();
const activeChats = new Map<string, Set<string>>();

export type SocketMap = Map<string, string>;
export type OnlineUsersMap = Map<string, Set<string>>;
export type activeChatsType = Map<string, Set<string>>;
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  statusHandlers(io, socket, onlineUsers, socketToUser);
  directChatHandlers(io, socket, socketToUser, activeChats);

  socket.on("disconnect", () => {
    const userId = socketToUser.get(socket.id);

    if (!userId) return;

    socketToUser.delete(socket.id);

    const sockets = onlineUsers.get(userId);

    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(userId);

      io.emit("user_status_change", {
        userId,
        isOnline: false,
      });
    }
  });
});
httpServer.listen(port, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});
