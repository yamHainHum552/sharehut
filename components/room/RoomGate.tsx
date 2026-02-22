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
    let retryTimeout: NodeJS.Timeout;

    const checkAccess = async (retry = false) => {
      try {
        const res = await api(`/rooms/${roomId}/membership`, "GET");

        if (!mounted) return;

        setIsMember(res.isMember === true);
        setChecking(false);
      } catch (err) {
        if (!mounted) return;

        console.error("Membership check failed:", err);

        // 🔥 Retry once after small delay (handles guest token race)
        if (!retry) {
          retryTimeout = setTimeout(() => {
            checkAccess(true);
          }, 300);
        } else {
          // After retry fails, then deny
          setIsMember(false);
          setChecking(false);
        }
      }
    };

    checkAccess();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [roomId]);

  /* -------------------- LOADING -------------------- */

  if (checking || isMember === null) {
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
