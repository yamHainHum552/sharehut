"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { socket } from "@/lib/socket";

export default function RoomSettingsModal({
  room,
  roomId,
  onClose,
  onUpdate,
}: {
  room: {
    isReadOnly: boolean;
    allowJoins: boolean;
  };
  roomId: string;
  onClose: () => void;
  onUpdate: (updates: Partial<typeof room>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Room Settings</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* ================= READ ONLY ================= */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Read-only mode</p>
            <p className="text-sm text-neutral-400">
              Prevent others from editing
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              const next = !room.isReadOnly;

              // optimistic update
              onUpdate({ isReadOnly: next });

              socket.emit("update-settings", {
                roomId,
                isReadOnly: next,
              });
            }}
          >
            {room.isReadOnly ? "Disable" : "Enable"}
          </Button>
        </div>

        {/* ================= LOCK ROOM ================= */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Lock room</p>
            <p className="text-sm text-neutral-400">
              Prevent new users from joining
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              const locked = room.allowJoins;

              // optimistic update
              onUpdate({ allowJoins: !locked });

              socket.emit("toggle-room-lock", {
                roomId,
                locked,
              });
            }}
          >
            {room.allowJoins ? "Lock" : "Unlock"}
          </Button>
        </div>

        {/* Footer */}
        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
      </Card>
    </div>
  );
}
