import Card from "@/components/ui/Card";
import { socket } from "@/lib/socket";

type User = {
  id: string;
  name: string;
};

export default function ParticipantsList({
  users,
  isOwner,
  currentUserId,
  roomId,
}: {
  users: User[];
  isOwner: boolean;
  currentUserId: string;
  roomId: string;
}) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Participants</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1 text-sm"
          >
            <span>{u.name}</span>

            {isOwner && u.id !== currentUserId && (
              <button
                onClick={() =>
                  socket.emit("kick-user", { roomId, userId: u.id })
                }
                className="text-red-400 hover:text-red-300"
                title="Kick user"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
