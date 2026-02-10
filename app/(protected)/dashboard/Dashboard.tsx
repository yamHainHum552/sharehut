"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

type Room = {
  id: string;
  name: string;
  room_code: string;
};

export default function Dashboard() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await api("/rooms/my", "GET", undefined, getToken()!);
      if (res.rooms) setMyRooms(res.rooms);
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    setError("");
    setLoading(true);
    if (!roomName.trim()) return setError("Room name is required");

    const res = await api("/rooms", "POST", { name: roomName }, getToken()!);

    if (res.roomId && res.roomCode) {
      window.location.href = `/room/${res.roomId}?code=${res.roomCode}`;
    } else {
      setError(res.error || "Failed to create room");
    }
    setLoading(false);
  };

  const joinRoom = async () => {
    setError("");
    if (!roomCode.trim()) return setError("Room code is required");

    const res = await api(
      "/rooms/join",
      "POST",
      { roomCode: roomCode.toUpperCase() },
      getToken()!,
    );

    if (!res.roomId) {
      setError(res.error || "Invalid room code");
      return;
    }

    // 🔐 Private room → wait for approval
    if (res.requiresApproval) {
      window.location.href = `/room/${res.roomId}?code=${roomCode}&pending=true`;
    } else {
      window.location.href = `/room/${res.roomId}?code=${roomCode}`;
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
        {/* Create Room */}
        <Card>
          <h2 className="text-xl font-semibold">Create Room</h2>
          <div className="mt-6 space-y-4">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button className="w-full" onClick={createRoom}>
              {loading ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </Card>

        {/* Join Room */}
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

      {/* My Rooms */}
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
                    (window.location.href = `/room/${room.id}?code=${room.room_code}`)
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
