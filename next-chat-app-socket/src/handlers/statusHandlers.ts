import "dotenv/config";
import { Server, Socket } from "socket.io";
import { OnlineUsersMap, SocketMap } from "../server";

export default function statusHandlers(
  io: Server,
  socket: Socket,
  onlineUsers: OnlineUsersMap,
  socketToUser: SocketMap
) {
  socket.on("user_connected", (userId: string) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    const userSockets = onlineUsers.get(userId)!;
    userSockets.add(socket.id);
    socketToUser.set(socket.id, userId);
    socket.join(`user:${userId}`);
    if (userSockets.size === 1) {
      io.emit("user_status_change", { userId, isOnline: true });
    }
  });

  socket.on("check_multiple_users_status", (userIds: string[]) => {
    if (!Array.isArray(userIds)) return;

    const statuses: Record<string, boolean> = {};
    userIds.forEach((id) => {
      statuses[id] = onlineUsers.has(id) && onlineUsers.get(id)!.size > 0;
    });

    socket.emit("multiple_users_status_result", statuses);
  });
}
