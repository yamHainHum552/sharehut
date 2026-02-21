"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Copy, Users, Clock, MoreVertical } from "lucide-react";

type TypingUser = {
  id: string;
  name: string;
};

export default function RoomHeader({
  roomId,
  code,
  roomName,
  isOwner,
  expiresAt,
  typingUsers,
  currentUserId,
  onOpenSettings,
  onOpenParticipants,
}: any) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  /* ---------------- Expiry Timer ---------------- */

  useEffect(() => {
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const diff = expiryTime - Date.now();
      if (diff <= 0) {
        router.push("/");
        return;
      }
      setRemaining(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, router]);

  const formattedTime = useMemo(() => {
    if (!remaining) return null;
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remaining]);

  const othersTyping =
    typingUsers?.filter((u: any) => u.id !== currentUserId) || [];

  const typingText =
    othersTyping.length > 0
      ? `${othersTyping[0].name}${
          othersTyping.length > 1 ? ` +${othersTyping.length - 1}` : ""
        } typing...`
      : null;

  const copyInviteLink = async () => {
    const link = `${window.location.origin}/join/${code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  /* ================= MOBILE ================= */

  return (
    <>
      {/* -------- Mobile Compact Header -------- */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{roomName}</h2>
          <p className="text-xs text-neutral-500 font-mono">Code: {code}</p>
          {typingText && <p className="text-xs text-blue-400">{typingText}</p>}
        </div>

        <div className="flex items-center gap-2">
          {formattedTime && (
            <div className="text-xs text-yellow-400 font-mono">
              {formattedTime}
            </div>
          )}

          <button
            onClick={onOpenParticipants}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800"
          >
            <Users size={16} />
          </button>

          {isOwner && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800"
            >
              <MoreVertical size={16} />
            </button>
          )}
        </div>
      </div>

      {/* -------- Desktop Full Header -------- */}
      <div className="hidden md:block">
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">{roomName}</h2>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Room ID: {roomId}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-sm">
                  Code: <span className="font-mono">{code}</span>
                </div>

                <button
                  onClick={copyInviteLink}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy Invite Link"}
                </button>
              </div>

              {typingText && (
                <p className="mt-2 text-sm text-blue-400">{typingText}</p>
              )}
            </div>

            <div className="flex gap-3">
              {isOwner && (
                <Button variant="secondary" onClick={onOpenSettings}>
                  Settings
                </Button>
              )}

              <Button
                variant="danger"
                onClick={() => router.push("/dashboard")}
              >
                Leave
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
