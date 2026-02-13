"use server";
import { cookies } from "next/headers";

export const getServerAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return {
    isLoggedIn: !!token,
    token,
  };
};
