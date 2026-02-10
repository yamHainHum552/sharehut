import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RoomHeader({
  roomId,
  code,
  isOwner,
  onOpenSettings,
}: {
  roomId: string;
  code: string;
  isOwner: boolean;
  onOpenSettings: () => void;
}) {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Room</h2>
          <p className="font-mono text-neutral-400">{roomId}</p>
          <p className="text-sm text-neutral-400 mt-1">
            Code: <span className="font-mono">{code}</span>
          </p>
        </div>

        <div className="flex gap-2">
          {isOwner && (
            <Button variant="secondary" onClick={onOpenSettings}>
              ⚙️ Settings
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Leave
          </Button>
        </div>
      </div>
    </Card>
  );
}
