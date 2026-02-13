import { socket } from "@/lib/socket";
import { getGuestToken } from "@/lib/guest";
import {
  getOrCreateGuestSession,
  getOrCreateGuestName,
} from "@/lib/guestSession";

export const refreshSocketAuth = () => {
  if (typeof window === "undefined") return;

  if (socket.connected) {
    socket.disconnect();
  }

  const guestOwnerToken = getGuestToken();

  if (guestOwnerToken) {
    socket.auth = { guestOwnerToken };
  } else {
    socket.auth = {
      guestSessionId: getOrCreateGuestSession(),
      guestName: getOrCreateGuestName(),
    };
  }

  socket.connect();
};
