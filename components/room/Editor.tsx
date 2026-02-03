"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import JoinRequests from "@/components/room/JoinRequests";

type User = {
  id: string;
  name: string;
};

export default function Editor({
  roomId,
  roomCode,
}: {
  roomId: string;
  roomCode: string;
}) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [code, setCode] = useState(roomCode);

  /**
   * 🔐 Fetch room meta (OWNER CHECK + ROOM CODE)
   */
  useEffect(() => {
    const fetchMeta = async () => {
      const res = await api(
        `/rooms/${roomId}/meta`,
        "GET",
        undefined,
        getToken()!,
      );

      setIsOwner(res.isOwner);

      if (!code && res.roomCode) {
        setCode(res.roomCode);
      }
    };

    fetchMeta();
  }, [roomId, code]);

  /**
   * 🔌 Socket lifecycle
   */
  useEffect(() => {
    if (!roomId) return;

    socket.off("user-list");
    socket.off("text-update");

    if (!socket.connected) {
      socket.connect();
    }

    const joinRoom = () => {
      console.log("Joining socket room:", roomId);
      socket.emit("join-room", { roomId });
    };

    socket.on("connect", joinRoom);
    joinRoom();

    socket.on("user-list", setUsers);
    socket.on("text-update", setText);

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("connect", joinRoom);
      socket.off("user-list");
      socket.off("text-update");
    };
  }, [roomId]);

  /**
   * ✍️ Text update
   */
  const update = (value: string) => {
    setText(value);
    socket.emit("text-update", { roomId, text: value });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      {/* Room Info */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Room ID</h2>
            <p className="font-mono text-neutral-400">{roomId}</p>
            <p className="text-sm text-neutral-400 mt-1">
              Code: <span className="font-mono">{code}</span>
            </p>
          </div>

          <Button
            variant="danger"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Leave Room
          </Button>
        </div>
      </Card>

      {/* 👑 Host-only join requests */}
      {isOwner && <JoinRequests roomId={roomId} />}

      {/* Participants */}
      <Card>
        <h3 className="text-lg font-semibold">Participants</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {users.map((u) => (
            <span
              key={u.id}
              className="rounded-full bg-neutral-800 px-3 py-1 text-sm"
            >
              {u.name}
            </span>
          ))}
        </div>
      </Card>

      {/* Editor */}
      <Card>
        <textarea
          value={text}
          onChange={(e) => update(e.target.value)}
          className="w-full h-[60vh] bg-neutral-900 p-4 font-mono rounded resize-none"
        />

        <div className="mt-4 flex gap-4">
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(text)}
          >
            Copy
          </Button>

          <Button variant="danger" onClick={() => update("")}>
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
}
