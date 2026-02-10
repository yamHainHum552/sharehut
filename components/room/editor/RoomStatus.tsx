import Card from "@/components/ui/Card";

export default function RoomStatus({
  room,
}: {
  room: { allowJoins: boolean; isReadOnly: boolean };
}) {
  if (!room.allowJoins) {
    return (
      <Card className="border-yellow-600 bg-yellow-950/40">
        <p className="text-sm text-yellow-400">
          🔒 This room is locked. New users cannot join.
        </p>
      </Card>
    );
  }

  if (room.isReadOnly) {
    return (
      <Card className="border-blue-600 bg-blue-950/40">
        <p className="text-sm text-blue-400">
          🛑 Read-only mode enabled. Editing is disabled.
        </p>
      </Card>
    );
  }

  return null;
}
