import { refreshSocketAuth } from "@/lib/socketAuth";
import { BACKEND_URL } from "@/config/constants";

export const logout = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("Logout request failed.");
    }
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // Reset socket auth state
    refreshSocketAuth();

    // Force full page reload to reset middleware + server state
    window.location.href = "/login";
  }
};
