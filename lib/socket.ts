import { io } from "socket.io-client";
import { getToken } from "@/lib/auth";

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"], // important
  auth: {
    token: getToken(), // 🔐 REQUIRED (your backend expects this)
  },
});
