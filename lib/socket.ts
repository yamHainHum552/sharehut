import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "@/config/constants";

export const socket: Socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true, // 🔥 ADD THIS
});
