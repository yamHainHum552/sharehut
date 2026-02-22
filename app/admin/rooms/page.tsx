"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/adminApi";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const fetchRooms = () => {
    adminApi("/rooms").then(setRooms);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const deleteRoom = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/rooms/${selectedRoom.id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    setSelectedRoom(null);
    fetchRooms();
  };

  return (
    <div>
      <DataTable
        columns={[
          { key: "name", label: "Room Name" },
          { key: "room_code", label: "Code" },
          { key: "is_guest_room", label: "Guest Room" },
          { key: "allow_joins", label: "Allow Joins" },
          { key: "is_read_only", label: "Read Only" },
        ]}
        data={rooms}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedRoom(row)}
            className="px-3 py-1 text-xs bg-red-600 rounded-lg"
          >
            Delete
          </button>
        )}
      />

      <ConfirmModal
        open={!!selectedRoom}
        title="Delete Room"
        description="Are you sure you want to delete this room?"
        onCancel={() => setSelectedRoom(null)}
        onConfirm={deleteRoom}
      />
    </div>
  );
}
