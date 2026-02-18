"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
    if (typeof window === "undefined") return;

    const shareLink = `${window.location.origin}/join/${code}`;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  /* ---------------- Time Formatting ---------------- */

  let formattedTime = null;
  let isDanger = false;

  if (remaining !== null) {
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (remaining < 60000) {
      isDanger = true;
    }
  }

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
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-3 flex-wrap">
            {roomName}

            {formattedTime && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-mono
                ${
                  isDanger
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                ⏳ {formattedTime}
              </span>
            )}
          </h2>

          <p className="font-mono text-neutral-500 text-sm mt-1">{roomId}</p>

          {/* Typing Indicator */}
          {typingText && (
            <p className="text-xs text-blue-400 mt-1 animate-pulse">
              {typingText}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400 flex-wrap">
            <span>
              Code: <span className="font-mono">{code}</span>
            </span>

            <button
              onClick={copyInviteLink}
              className="px-2 py-1 text-xs bg-neutral-800 rounded hover:bg-neutral-700 transition"
            >
              {copied ? "Link Copied" : "Copy Invite Link"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={onOpenParticipants}
            className="lg:hidden px-3 py-1 text-sm bg-neutral-800 rounded hover:bg-neutral-700 transition"
          >
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
