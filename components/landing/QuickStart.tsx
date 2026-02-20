"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setGuestToken, getGuestToken } from "@/lib/guest";
import { refreshSocketAuth } from "@/lib/socketAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, LogIn } from "lucide-react";

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
        router.push(`/room/${res.roomId}?code=${roomCode}&pending=true`);
      } else {
        router.push(`/room/${res.roomId}?code=${roomCode}`);
      }
    } catch {
      setError("Invalid or expired room code.");
    } finally {
      setLoadingJoin(false);
    }
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto mt-24 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-purple-600 to-blue-600 pointer-events-none" />

      <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Start Sharing Instantly
          </h2>
          <p className="text-neutral-400 mt-3 text-sm">
            No sign-up required. Secure temporary rooms expire automatically
            after 1 hour.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {/* Create Room */}
          <div className="space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-neutral-500">
              Create a Room
            </h3>

            <Input
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleCreate}
              disabled={loadingCreate}
            >
              <Plus size={16} />
              {loadingCreate ? "Creating..." : "Create Instant Room"}
            </Button>
          </div>

          {/* Join Room */}
          <div className="space-y-5">
            <h3 className="text-sm uppercase tracking-wide text-neutral-500">
              Join Existing Room
            </h3>

            <Input
              placeholder="Enter room code (SH-XXXXXX)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleJoin}
              disabled={loadingJoin}
            >
              <LogIn size={16} />
              {loadingJoin ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
