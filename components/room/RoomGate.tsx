"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/room/Editor";
import PendingApproval from "@/components/room/PendingApproval";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Props {
  roomId: string;
  pending?: string;
  code: string;
}

export default function RoomGate({ roomId, pending, code }: Props) {
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const res = await api(
          `/rooms/${roomId}/membership`,
          "GET",
          undefined,
          getToken()!,
        );
        setIsMember(res.isMember);
      } catch {
        setIsMember(false);
      }
    };

    checkMembership();
  }, [roomId]);

  if (isMember === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Checking access…
      </div>
    );
  }

  if (!isMember && pending === "true") {
    return <PendingApproval roomId={roomId} />;
  }

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        You do not have access to this room.
      </div>
    );
  }

  return <Editor roomId={roomId} roomCode={code} />;
}
