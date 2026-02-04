import { BACKEND_URL } from "@/config/constants";
import { io } from "socket.io-client";
import { getToken } from "@/lib/auth";

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"], // important
  auth: {
    token: getToken(), // 🔐 REQUIRED (your backend expects this)
  },
});
