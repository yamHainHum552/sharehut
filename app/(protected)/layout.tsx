"use client";

import { useEffect } from "react";
import { getToken, logout } from "@/lib/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!getToken()) logout();
  }, []);

  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
}
