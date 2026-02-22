"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
          { credentials: "include" },
        );

        if (!res.ok) {
          router.replace("/");
          return;
        }

        const data = await res.json();

        if (data.role !== "superadmin") {
          router.replace("/");
          return;
        }

        setAuthorized(true);
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  // 🔒 Prevent UI flash before auth check
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Verifying admin access...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
