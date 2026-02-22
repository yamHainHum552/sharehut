import { io } from "socket.io-client";
import { BACKEND_URL } from "@/config/constants";
import { getGuestToken } from "@/lib/guest";
import {
  getOrCreateGuestSession,
  getOrCreateGuestName,
} from "@/lib/guestSession";

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export const initializeSocketAuth = () => {
  const hasAuthCookie =
    typeof document !== "undefined" && document.cookie.includes("token=");

  if (!hasAuthCookie) {
    socket.auth = {
      guestOwnerToken: getGuestToken(),
      guestSessionId: getOrCreateGuestSession(),
      guestName: getOrCreateGuestName(),
    };
  }
};
