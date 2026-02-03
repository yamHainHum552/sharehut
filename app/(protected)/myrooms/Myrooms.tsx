"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Room = {
  id: string;
  name: string;
  room_code: string;
};

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await api("/rooms/my", "GET", undefined, getToken()!);
      setRooms(res.rooms || []);
    };

    fetchRooms();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">My Rooms</h1>
      <p className="mt-2 text-neutral-400">Rooms you created or manage</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {rooms.map((room) => (
          <Card key={room.id}>
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Code: <span className="font-mono">{room.room_code}</span>
            </p>

            <Button
              className="mt-4 w-full"
              onClick={() => (window.location.href = `/room/${room.id}`)}
            >
              Open Room
            </Button>
          </Card>
        ))}

        {rooms.length === 0 && (
          <p className="text-neutral-500">No rooms created yet.</p>
        )}
      </div>
    </div>
  );
}
