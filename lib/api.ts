import { BACKEND_URL } from "@/config/constants";
import { getGuestToken } from "@/lib/guest";
import {
  getOrCreateGuestSession,
  getOrCreateGuestName,
} from "@/lib/guestSession";

const API_URL = `${BACKEND_URL}/api`;

export const api = async (path: string, method: string, body?: any) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ✅ Inject guest identity
  if (typeof window !== "undefined") {
    const guestOwnerToken = getGuestToken();

    if (guestOwnerToken) {
      headers["x-guest-owner-token"] = guestOwnerToken;
    } else {
      headers["x-guest-session-id"] = getOrCreateGuestSession();
      headers["x-guest-name"] = getOrCreateGuestName();
    }
  }

  const res = await fetch(`${API_URL}${normalizedPath}`, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};
