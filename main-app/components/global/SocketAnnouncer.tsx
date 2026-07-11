"use client";
import { io } from "socket.io-client";
import { useUserStore } from "@/context";
import { useEffect } from "react";
export const globalSocket = io((process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3002"), {
  transports: ["websocket"]
});
export default function SocketAnnouncer() {
    const { id } = useUserStore();
    useEffect(() => {
        if (id) {
            globalSocket.emit("user_connected", id);
        }
        return () => { globalSocket.off("user_connected") }
    }, [id]);
    return null;
}
