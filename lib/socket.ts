import { io } from "socket.io-client";
import { getToken } from "@/lib/auth";

export const socket = io("http://localhost:4000", {
  autoConnect: false,
  transports: ["websocket"], // important
  auth: {
    token: getToken(), // 🔐 REQUIRED (your backend expects this)
  },
});
