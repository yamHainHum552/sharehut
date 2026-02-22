"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
// import { refreshSocketAuth } from "@/lib/socketAuth";

export default function JoinRoomClient({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const join = async () => {
      try {
        const res = await api("/rooms/join", "POST", {
          roomCode: code.toUpperCase(),
        });

        // refreshSocketAuth();

        if (res.requiresApproval) {
          router.replace(`/room/${res.roomId}?code=${code}&pending=true`);
        } else {
          router.replace(`/room/${res.roomId}?code=${code}`);
        }
      } catch (err: any) {
        if (err?.status === 401) {
          router.replace(`/login?redirect=/join/${code}`);
          return;
        }

        setError(err?.error || "Invalid or expired link.");
      }
    };

    join();
  }, [code, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-neutral-400">Joining room...</p>
    </div>
  );
}
