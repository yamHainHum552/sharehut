"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/room/editor/Editor";
import PendingApproval from "@/components/room/PendingApproval";
import { api } from "@/lib/api";

interface Props {
  roomId: string;
  pending?: string;
  code: string;
}

export default function RoomGate({ roomId, pending, code }: Props) {
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        // 🔥 SINGLE SOURCE OF TRUTH
        const res = await api(`/rooms/${roomId}/membership`, "GET");

        if (!mounted) return;

        setIsMember(res.isMember === true);
      } catch (err) {
        if (!mounted) return;
        setIsMember(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [roomId]);

  /* -------------------- LOADING -------------------- */

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Checking access…
      </div>
    );
  }

  /* -------------------- PENDING -------------------- */

  if (!isMember && pending === "true") {
    return <PendingApproval roomId={roomId} />;
  }

  /* -------------------- DENIED -------------------- */

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        You do not have access to this room.
      </div>
    );
  }

  /* -------------------- ALLOWED -------------------- */

  return <Editor roomId={roomId} roomCode={code} />;
}
