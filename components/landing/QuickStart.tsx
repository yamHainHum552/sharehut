"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setGuestToken, getGuestToken } from "@/lib/guest";
import { refreshSocketAuth } from "@/lib/socketAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function QuickStart() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- Create Room ---------------- */

  const handleCreate = async () => {
    if (!roomName.trim()) {
      setError("Please enter a room name.");
      return;
    }

    setError("");
    setLoadingCreate(true);

    try {
      const res = await api("/rooms/guest", "POST", {
        name: roomName.trim(),
        guestOwnerToken: getGuestToken() || null,
      });

      setGuestToken(res.ownerToken);
      refreshSocketAuth();

      router.push(`/room/${res.roomId}?code=${res.roomCode}`);
    } catch (err: any) {
      setError(err?.error || "Failed to create room.");
    } finally {
      setLoadingCreate(false);
    }
  };

  /* ---------------- Join Room ---------------- */

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code.");
      return;
    }

    setError("");
    setLoadingJoin(true);

    try {
      const res = await api("/rooms/join", "POST", {
        roomCode: roomCode.toUpperCase(),
      });

      refreshSocketAuth();

      if (res.requiresApproval) {
        router.push(
          `/room/${res.roomId}?code=${roomCode}&pending=true`
        );
      } else {
        router.push(`/room/${res.roomId}?code=${roomCode}`);
      }
    } catch {
      setError("Invalid or expired room code.");
    } finally {
      setLoadingJoin(false);
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <section className="w-full max-w-3xl mx-auto mt-16 px-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-center">
          Start Sharing Instantly
        </h2>
        <p className="text-neutral-400 text-center mt-2 text-sm">
          No sign-up required. Rooms expire automatically after 1 hour.
        </p>

        {error && (
          <p className="mt-6 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        {/* Create Room */}
        <div className="mt-8 space-y-4">
          <Input
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleCreate}
            disabled={loadingCreate}
          >
            {loadingCreate ? "Creating..." : "Create Instant Room"}
          </Button>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-neutral-800 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 px-3 text-xs text-neutral-500">
            OR
          </span>
        </div>

        {/* Join Room */}
        <div className="space-y-4">
          <Input
            placeholder="Enter room code (SH-XXXXXX)"
            value={roomCode}
            onChange={(e) =>
              setRoomCode(e.target.value.toUpperCase())
            }
          />

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleJoin}
            disabled={loadingJoin}
          >
            {loadingJoin ? "Joining..." : "Join Room"}
          </Button>
        </div>
      </div>
    </section>
  );
}
