"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Copy, Users, Clock } from "lucide-react";

type TypingUser = {
  id: string;
  name: string;
  type?: string;
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
}: {
  roomId: string;
  code: string;
  roomName: string;
  isOwner: boolean;
  expiresAt?: string | null;
  typingUsers: TypingUser[];
  currentUserId: string;
  onOpenSettings: () => void;
  onOpenParticipants: () => void;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  /* ---------------- Expiry Timer ---------------- */

  useEffect(() => {
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const diff = expiryTime - Date.now();

      if (diff <= 0) {
        setRemaining(0);
        router.push("/");
        return;
      }

      setRemaining(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, router]);

  /* ---------------- Copy Invite Link ---------------- */

  const copyInviteLink = async () => {
    const shareLink = `${window.location.origin}/join/${code}`;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ---------------- Time Formatting ---------------- */

  const formattedTime = useMemo(() => {
    if (remaining === null) return null;

    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remaining]);

  const isDanger = remaining !== null && remaining < 60000;

  /* ---------------- Typing Logic ---------------- */

  const othersTyping = typingUsers?.filter((u) => u.id !== currentUserId) || [];

  const typingText =
    othersTyping.length === 1
      ? `${othersTyping[0].name} is typing...`
      : othersTyping.length > 1
        ? `${othersTyping
            .slice(0, 2)
            .map((u) => u.name)
            .join(", ")}${
            othersTyping.length > 2 ? ` +${othersTyping.length - 2} more` : ""
          } are typing...`
        : null;

  /* ---------------- Render ---------------- */

  return (
    <Card>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* LEFT */}
        <div className="flex-1">
          {/* Room Title */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              {roomName}
            </h2>

            {formattedTime && (
              <div
                className={`
                  flex items-center gap-2
                  px-3 py-1 rounded-full text-xs font-mono
                  border
                  ${
                    isDanger
                      ? "bg-red-500/20 text-red-400 border-red-500/40"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  }
                `}
              >
                <Clock size={12} />
                {formattedTime}
              </div>
            )}
          </div>

          {/* Room ID */}
          <p className="mt-2 text-xs text-neutral-500 font-mono">
            Room ID: {roomId}
          </p>

          {/* Typing Indicator */}
          {typingText && (
            <p className="mt-2 text-sm text-blue-400 animate-pulse">
              {typingText}
            </p>
          )}

          {/* Invite Section */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-neutral-300">
              Code: <span className="font-mono">{code}</span>
            </div>

            <button
              onClick={copyInviteLink}
              className="
                flex items-center gap-2
                px-3 py-1 rounded-lg text-sm
                bg-neutral-900 border border-neutral-800
                hover:bg-neutral-800 transition
              "
            >
              <Copy size={14} />
              {copied ? "Copied" : "Copy Invite Link"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenParticipants}
            className="
              lg:hidden flex items-center gap-2
              px-3 py-2 rounded-lg text-sm
              bg-neutral-900 border border-neutral-800
              hover:bg-neutral-800 transition
            "
          >
            <Users size={14} />
            Participants
          </button>

          {isOwner && (
            <Button variant="secondary" onClick={onOpenSettings}>
              ⚙️ Settings
            </Button>
          )}

          <Button variant="danger" onClick={() => router.push("/dashboard")}>
            Leave
          </Button>
        </div>
      </div>
    </Card>
  );
}
