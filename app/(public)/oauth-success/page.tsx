"use client";

import { useEffect } from "react";
import { setToken } from "@/lib/auth";

export default function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      window.location.href = "/dashboard";
    }
  }, []);

  return <p className="p-10">Signing you in...</p>;
}
