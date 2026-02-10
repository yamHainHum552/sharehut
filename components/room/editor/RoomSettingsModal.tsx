import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Room Settings</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Read-only */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Read-only mode</p>
            <p className="text-sm text-neutral-400">
              Prevent others from editing
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={async () => {
              const next = !room.isReadOnly;
              onUpdate({ isReadOnly: next }); // optimistic
              await api(
                `/rooms/${roomId}/settings`,
                "PATCH",
                { isReadOnly: next },
                getToken()!,
              );
            }}
          >
            {room.isReadOnly ? "Disable" : "Enable"}
          </Button>
        </div>

        {/* Lock room */}
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
              onUpdate({ allowJoins: !room.allowJoins }); // optimistic
              socket.emit("toggle-room-lock", {
                roomId,
                locked: room.allowJoins,
              });
            }}
          >
            {room.allowJoins ? "Lock" : "Unlock"}
          </Button>
        </div>

        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
      </Card>
    </div>
  );
}
