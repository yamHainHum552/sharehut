"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

import RoomHeader from "./RoomHeader";
import RoomStatus from "./RoomStatus";
import ParticipantsList from "./ParticipantsList";
import TextEditor from "./TextEditor";
import RoomSettingsModal from "./RoomSettingsModal";
import JoinRequests from "@/components/room/JoinRequests";

export default function Editor({ roomId, roomCode }: any) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState({
    isOwner: false,
    isReadOnly: false,
    allowJoins: true,
    code: roomCode,
    currentUserId: "",
  });
  const [showSettings, setShowSettings] = useState(false);

  /**
   * Fetch room meta
   */
  useEffect(() => {
    (async () => {
      const res = await api(
        `/rooms/${roomId}/meta`,
        "GET",
        undefined,
        getToken()!,
      );

      setRoom({
        isOwner: res.isOwner,
        isReadOnly: res.isReadOnly,
        allowJoins: res.allowJoins,
        code: res.roomCode,
        currentUserId: res.currentUserId,
      });
    })();
  }, [roomId]);

  /**
   * Socket lifecycle
   */
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("join-room", { roomId });

    socket.on("user-list", setUsers);
    socket.on("text-update", setText);

    socket.on("room-lock-updated", ({ locked }) => {
      setRoom((r) => ({ ...r, allowJoins: !locked }));
    });

    socket.on("room-abandoned", () => {
      alert("The room owner has left. This room is now closed.");
      window.location.href = "/dashboard";
    });

    socket.on("kicked", () => {
      alert("You were removed from the room.");
      window.location.href = "/dashboard";
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off();
    };
  }, [roomId]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <RoomHeader
        roomId={roomId}
        code={room.code}
        isOwner={room.isOwner}
        onOpenSettings={() => setShowSettings(true)}
      />

      <RoomStatus room={room} />

      {room.isOwner && <JoinRequests roomId={roomId} />}

      <ParticipantsList
        users={users}
        isOwner={room.isOwner}
        currentUserId={room.currentUserId}
        roomId={roomId}
      />

      <TextEditor
        text={text}
        isReadOnly={room.isReadOnly}
        isOwner={room.isOwner}
        onChange={(value) => {
          setText(value);
          socket.emit("text-update", { roomId, text: value });
        }}
      />

      {showSettings && (
        <RoomSettingsModal
          room={room}
          roomId={roomId}
          onClose={() => setShowSettings(false)}
          onUpdate={(updates) => setRoom((r) => ({ ...r, ...updates }))}
        />
      )}
    </div>
  );
}
