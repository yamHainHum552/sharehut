"use client";

import { socket } from "@/lib/socket";

type User = {
  id: string;
  name: string;
  type?: "user" | "guest";
};

export default function ParticipantsList({
  users,
  isOwner,
  currentUserId,
  roomId,
  isOpen,
  onClose,
}: {
  users: User[];
  isOwner: boolean;
  currentUserId: string;
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full w-72 bg-neutral-900 border-l border-neutral-800
          flex flex-col z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0
        `}
      >
        <div className="px-5 pt-5 pb-3 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Participants ({users.length})
          </h3>

          <button
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-3">
          {users.map((u) => {
            const canKick =
              isOwner && u.type === "user" && u.id !== currentUserId;

            return (
              <div
                key={u.id}
                className="flex items-center justify-between bg-neutral-800 rounded-lg px-3 py-2 text-sm hover:bg-neutral-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-medium">
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-neutral-400">
                      {u.type === "guest" ? "Guest" : "Member"}
                    </p>
                  </div>
                </div>

                {canKick && (
                  <button
                    onClick={() =>
                      socket.emit("kick-user", { roomId, userId: u.id })
                    }
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
