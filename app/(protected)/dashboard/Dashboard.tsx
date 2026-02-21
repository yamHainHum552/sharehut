"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Plus, LogIn, Loader2 } from "lucide-react";

type Room = {
  id: string;
  name: string;
  room_code: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);

  /* ---------------- Fetch My Rooms ---------------- */

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await api("/rooms/my", "GET");
        if (res.rooms) setMyRooms(res.rooms);
      } catch {
        setError("Failed to load rooms");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  /* ---------------- Create Room ---------------- */

  const createRoom = async () => {
    setError("");

    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setLoadingCreate(true);

    try {
      const res = await api("/rooms", "POST", { name: roomName });

      if (res.roomId && res.roomCode) {
        router.push(`/room/${res.roomId}?code=${res.roomCode}`);
      } else {
        setError(res.error || "Failed to create room");
      }
    } catch (err: any) {
      setError(err?.error || "Failed to create room");
    } finally {
      setLoadingCreate(false);
    }
  };

  /* ---------------- Join Room ---------------- */

  const joinRoom = async () => {
    setError("");

    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }

    try {
      const res = await api("/rooms/join", "POST", {
        roomCode: roomCode.toUpperCase(),
      });

      if (!res.roomId) {
        setError(res.error || "Invalid room code");
        return;
      }

      if (res.requiresApproval) {
        router.push(`/room/${res.roomId}?code=${roomCode}&pending=true`);
      } else {
        router.push(`/room/${res.roomId}?code=${roomCode}`);
      }
    } catch (err: any) {
      setError(err?.error || "Failed to join room");
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white px-6 py-14">
      {/* Background Glow */}
      <div className="absolute inset-0 blur-3xl opacity-20  pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-3 text-neutral-400">
            Create new rooms, join existing ones, or manage your sessions.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Create + Join Section */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Create */}
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Create Room</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Start a new private workspace.
              </p>
            </div>

            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={createRoom}
              disabled={loadingCreate}
            >
              {loadingCreate ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Room
                </>
              )}
            </Button>
          </Card>

          {/* Join */}
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Join Room</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Enter a room using its invite code.
              </p>
            </div>

            <Input
              placeholder="Room code (SH-XXXXXX)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={joinRoom}
            >
              <LogIn size={16} />
              Join Room
            </Button>
          </Card>
        </div>

        {/* My Rooms Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold">My Rooms</h2>

          {loadingRooms ? (
            /* Skeleton Loader */
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-neutral-900 animate-pulse border border-neutral-800"
                />
              ))}
            </div>
          ) : myRooms.length === 0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
              <p className="text-neutral-400">
                You haven't created any rooms yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {myRooms.map((room) => (
                <Card
                  key={room.id}
                  className="p-6 hover:border-purple-500/40 transition"
                >
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    Code: <span className="font-mono">{room.room_code}</span>
                  </p>

                  <Button
                    className="mt-6 w-full"
                    onClick={() =>
                      router.push(`/room/${room.id}?code=${room.room_code}`)
                    }
                  >
                    Enter Room
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
