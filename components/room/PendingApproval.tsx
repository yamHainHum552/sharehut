"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Card from "@/components/ui/Card";

export default function PendingApproval({ roomId }: { roomId: string }) {
  const sentRef = useRef(false); // 👈 prevent duplicate requests

  useEffect(() => {
    // 1️⃣ Send join request ONCE
    const sendJoinRequest = async () => {
      if (sentRef.current) return;
      sentRef.current = true;

      try {
        await api(`/requests/${roomId}`, "POST", undefined, getToken()!);
      } catch {
        // ignore duplicate / already requested
      }
    };

    sendJoinRequest();

    // 2️⃣ Poll membership
    const interval = setInterval(async () => {
      const res = await api(
        `/rooms/${roomId}/membership`,
        "GET",
        undefined,
        getToken()!,
      );

      if (res.isMember) {
        window.location.href = `/room/${roomId}`;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [roomId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <h2 className="text-xl font-semibold">Waiting for approval</h2>
        <p className="mt-2 text-neutral-400">
          The host must approve your request before you can join.
        </p>
      </Card>
    </div>
  );
}
