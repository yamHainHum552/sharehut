"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setGuestToken } from "@/lib/guest";
import { refreshSocketAuth } from "@/lib/socketAuth";
import { getGuestToken } from "@/lib/guest";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SharePage() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const createGuestRoom = async () => {
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const existingToken = getGuestToken();

      const res = await api("/rooms/guest", "POST", {
        name: roomName.trim(),
        guestOwnerToken: getGuestToken() || null,
      });

      setGuestToken(res.ownerToken); // always trust backend
      refreshSocketAuth();
      router.push(`/room/${res.roomId}?code=${res.roomCode}`);
    } catch (err: any) {
      if (err?.error === "Guest users can only create one active room.") {
        setError("You already have an active guest room.");

        // 🔥 Redirect to login after 1.5s
        setTimeout(() => {
          router.push("/login");
        }, 1500);

        return;
      }

      setError(err?.error || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }

    setJoining(true);
    setError("");

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
      setError("Invalid or expired room code");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">Quick Share</h1>
      <p className="mt-2 text-neutral-400">
        Create or join a collaborative room instantly.
      </p>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Create Temporary Room */}
        <Card>
          <h2 className="text-xl font-semibold">Create Temporary Room</h2>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <Button
              className="w-full"
              onClick={createGuestRoom}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Room"}
            </Button>

            <p className="text-xs text-neutral-500">
              Rooms expire automatically after 1 hour.
            </p>
          </div>
        </Card>

        {/* Join Room */}
        <Card>
          <h2 className="text-xl font-semibold">Join Room</h2>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Room code (SH-XXXXXX)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />

            <Button
              variant="secondary"
              className="w-full"
              onClick={joinRoom}
              disabled={joining}
            >
              {joining ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
