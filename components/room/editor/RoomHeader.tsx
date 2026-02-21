"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Copy, Users, Clock, MoreVertical, QrCode } from "lucide-react";
import RoomQRModal from "../RoomQrModel";

interface TypingUser {
  id: string;
  name: string;
}

interface Props {
  roomId: string;
  code: string;
  roomName: string;
  isOwner: boolean;
  expiresAt?: string | null;
  typingUsers?: TypingUser[];
  currentUserId: string;
  onOpenSettings: () => void;
  onOpenParticipants: () => void;
}

export default function RoomHeader({
  roomId,
  code,
  roomName,
  isOwner,
  expiresAt,
  typingUsers = [],
  currentUserId,
  onOpenSettings,
  onOpenParticipants,
}: Props) {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);

  /* ---------------- Expiry Timer ---------------- */

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(null);
      return;
    }

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

  const formattedTime = useMemo(() => {
    if (remaining === null) return null;

    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [remaining]);

  /* ---------------- Typing Indicator ---------------- */

  const othersTyping = typingUsers?.filter((u) => u.id !== currentUserId) || [];

  const typingText =
    othersTyping.length > 0
      ? `${othersTyping[0].name}${
          othersTyping.length > 1 ? ` +${othersTyping.length - 1}` : ""
        } typing...`
      : null;

  /* ---------------- Copy Link ---------------- */

  const copyInviteLink = async () => {
    try {
      const link = `${window.location.origin}/join/${code}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = `${window.location.origin}/join/${code}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden mb-4 space-y-3">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{roomName}</h2>

            <p className="text-xs text-neutral-500 font-mono">Code: {code}</p>

            {typingText && (
              <p className="text-xs text-blue-400 animate-pulse">
                {typingText}
              </p>
            )}
          </div>

          {formattedTime && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
              <Clock size={12} />
              {formattedTime}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenParticipants}
            className="flex items-center gap-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition"
          >
            <Users size={14} />
            Participants
          </button>

          <button
            onClick={copyInviteLink}
            className="flex items-center gap-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition"
          >
            <Copy size={14} />
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition"
          >
            <QrCode size={14} />
            QR
          </button>

          {isOwner && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition"
            >
              <MoreVertical size={14} />
              Settings
            </button>
          )}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <Card>
          <div className="flex justify-between items-start">
            {/* Left Side */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">{roomName}</h2>

                {formattedTime && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono">
                    <Clock size={14} />
                    {formattedTime}
                  </div>
                )}
              </div>

              <p className="text-xs text-neutral-500 font-mono">
                Room ID: {roomId}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-sm">
                  Code: <span className="font-mono">{code}</span>
                </div>

                <button
                  onClick={copyInviteLink}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy Invite Link"}
                </button>

                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition"
                >
                  <QrCode size={14} />
                  QR Code
                </button>
              </div>

              {typingText && (
                <p className="text-sm text-blue-400 animate-pulse">
                  {typingText}
                </p>
              )}
            </div>

            {/* Right Side */}
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

      {/* QR Modal */}
      {showQR && <RoomQRModal code={code} onClose={() => setShowQR(false)} />}
    </>
  );
}
