import { BACKEND_URL } from "@/config/constants";
import { getGuestToken } from "@/lib/guest";
import {
  getOrCreateGuestSession,
  getOrCreateGuestName,
} from "@/lib/guestSession";

const API_URL = `${BACKEND_URL}/api`;

export const api = async (
  path: string,
  method: string,
  body?: any,
  isFormData: boolean = false,
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers: Record<string, string> = {};

  // Guest identity headers
  // Attach guest identity ONLY if no auth cookie
  if (typeof window !== "undefined") {
    const hasAuthCookie = document.cookie.includes("token=");

    if (!hasAuthCookie) {
      const guestOwnerToken = getGuestToken();

      if (guestOwnerToken) {
        headers["x-guest-owner-token"] = guestOwnerToken;
      } else {
        headers["x-guest-session-id"] = getOrCreateGuestSession();
        headers["x-guest-name"] = getOrCreateGuestName();
      }
    }
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${normalizedPath}`, {
    method,
    credentials: "include",
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};
