import { BACKEND_URL } from "@/config/constants";

const BASE = `${BACKEND_URL}/api/admin`;

export const adminApi = async (path: string) => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Admin API error");
  }

  return res.json();
};
