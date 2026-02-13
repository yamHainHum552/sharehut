import { refreshSocketAuth } from "@/lib/socketAuth";
import { BACKEND_URL } from "@/config/constants";
export const logout = async () => {
  await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  refreshSocketAuth();

  window.location.href = "/";
};
