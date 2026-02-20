"use client";

import { socket } from "@/lib/socket";
import { Crown, User as UserIcon, X } from "lucide-react";

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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full w-80
          bg-neutral-950/95 backdrop-blur-md
          border-l border-neutral-800
          flex flex-col z-45
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Participants</h3>
            <p className="text-xs text-neutral-500">
              {users.length} active in this room
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          {users.map((u) => {
            const isCurrent = u.id === currentUserId;
            const canKick = isOwner && u.type === "user" && !isCurrent;

            return (
              <div
                key={u.id}
                className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 hover:border-neutral-700 transition"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-md">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-neutral-950 rounded-full" />
                  </div>

                  {/* Name & Role */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white text-sm">
                        {u.name}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-purple-400">
                            (You)
                          </span>
                        )}
                      </p>

                      {isOwner && isCurrent && (
                        <Crown size={14} className="text-yellow-400" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-500">
                      {u.type === "guest" ? "Guest User" : "Registered Member"}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                {canKick && (
                  <button
                    onClick={() =>
                      socket.emit("kick-user", {
                        roomId,
                        userId: u.id,
                      })
                    }
                    className="text-xs px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
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
