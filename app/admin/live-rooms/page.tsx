"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

export default function LiveRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const load = () => adminApi("/live-rooms").then(setRooms);

    load();
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl">
      <table className="w-full text-sm">
        <thead className="border-b border-neutral-800 text-neutral-400">
          <tr>
            <th className="p-4 text-left">Room</th>
            <th>Participants</th>
            <th>Type</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b border-neutral-800">
              <td className="p-4">{room.name}</td>
              <td>{room.participantsCount}</td>
              <td>{room.is_guest_room ? "Guest" : "Auth"}</td>
              <td>
                {room.expires_at
                  ? new Date(room.expires_at).toLocaleString()
                  : "Permanent"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
