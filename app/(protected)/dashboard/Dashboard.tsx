"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api("/rooms/my", "GET");
        if (res.rooms) setMyRooms(res.rooms);
      } catch {
        setError("Failed to load rooms");
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    setError("");
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setLoading(true);

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
      setLoading(false);
    }
  };

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-2 text-neutral-400">
        Create, join, or re-enter your rooms.
      </p>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Create Room</h2>
          <div className="mt-6 space-y-4">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button className="w-full" onClick={createRoom} disabled={loading}>
              {loading ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Join Room</h2>
          <div className="mt-6 space-y-4">
            <Input
              placeholder="Room code (SH-XXXXXX)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <Button variant="secondary" className="w-full" onClick={joinRoom}>
              Join Room
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-semibold">My Rooms</h2>

        {myRooms.length === 0 ? (
          <p className="mt-4 text-neutral-400">No rooms created yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {myRooms.map((room) => (
              <Card key={room.id}>
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Code: <span className="font-mono">{room.room_code}</span>
                </p>
                <Button
                  className="mt-4 w-full"
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
  );
}
