"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { refreshSocketAuth } from "@/lib/socketAuth";
import RoomHeader from "./RoomHeader";
import RoomStatus from "./RoomStatus";
import ParticipantsList from "./ParticipantsList";
import TextEditor from "./TextEditor";
import RoomSettingsModal from "./RoomSettingsModal";
import JoinRequests from "@/components/room/JoinRequests";

interface RoomState {
  isOwner: boolean;
  isReadOnly: boolean;
  allowJoins: boolean;
  code: string;
  name: string;
  currentUserId: string;
  isGuestRoom: boolean;
  expiresAt?: string | null;
}

export default function Editor({
  roomId,
  roomCode,
}: {
  roomId: string;
  roomCode: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPending = searchParams.get("pending") === "true";

  const [text, setText] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [refreshJoinRequests, setRefreshJoinRequests] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [joined, setJoined] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const [room, setRoom] = useState<RoomState>({
    isOwner: false,
    isReadOnly: false,
    allowJoins: true,
    code: roomCode,
    name: "",
    currentUserId: "",
    isGuestRoom: false,
  });

  /* ---------------- Fetch Room Meta ---------------- */

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api(`/rooms/${roomId}/meta`, "GET");

        setRoom({
          isOwner: res.isOwner,
          isReadOnly: res.isReadOnly,
          allowJoins: res.allowJoins,
          code: res.roomCode,
          name: res.name,
          currentUserId: res.currentUserId ?? "guest",
          isGuestRoom: res.isGuestRoom ?? false,
          expiresAt: res.expiresAt ?? null,
        });
      } catch {
        router.push("/");
      }
    };

    fetchMeta();
  }, [roomId]);

  /* ---------------- Join Socket Room ---------------- */

  const joinSocketRoom = () => {
    refreshSocketAuth();
    socket.emit("join-room", { roomId });
    setJoined(true);
  };

  useEffect(() => {
    if (!isPending && !joined) {
      joinSocketRoom();
    }

    const handleApproved = async ({ userId }: { userId: string }) => {
      if (userId === room.currentUserId) {
        await api("/rooms/join", "POST", { roomCode });
        router.replace(`/room/${roomId}`);
        joinSocketRoom();
      }
    };

    socket.on("join-request-approved", handleApproved);

    return () => {
      socket.off("join-request-approved", handleApproved);
    };
  }, [isPending, room.currentUserId, joined]);

  /* ---------------- Socket Listeners ---------------- */

  useEffect(() => {
    if (!joined) return;

    const handleUserList = (list: any[]) => setUsers(list);
    const handleTextUpdate = (value: string) => setText(value);
    const handleTypingUpdate = (list: any[]) => setTypingUsers(list);

    socket.on("user-list", handleUserList);
    socket.on("text-update", handleTextUpdate);
    socket.on("typing-update", handleTypingUpdate);

    socket.on("room-settings-updated", (data) => {
      setRoom((prev) => ({ ...prev, ...data }));
    });

    socket.on("room-expired", () => {
      alert("This room has expired.");
      router.push("/");
    });

    return () => {
      socket.emit("leave-room");

      socket.off("user-list", handleUserList);
      socket.off("text-update", handleTextUpdate);
      socket.off("typing-update", handleTypingUpdate);
      socket.off("room-settings-updated");
      socket.off("room-expired");
    };
  }, [joined]);

  /* ---------------- Render ---------------- */

  if (isPending && !joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Waiting for approval...</h2>
          <p className="text-neutral-400">
            The room owner must approve your request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="flex-1 flex flex-col border-r border-neutral-800">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <RoomHeader
            roomId={roomId}
            code={room.code}
            isOwner={room.isOwner}
            roomName={room.name}
            expiresAt={room.expiresAt}
            typingUsers={typingUsers}
            currentUserId={room.currentUserId}
            onOpenSettings={() => setShowSettings(true)}
            onOpenParticipants={() => setShowParticipants(true)}
          />

          <RoomStatus room={room} />

          {room.isOwner && !room.isGuestRoom && (
            <JoinRequests roomId={roomId} refreshKey={refreshJoinRequests} />
          )}

          <TextEditor
            text={text}
            isReadOnly={room.isReadOnly}
            isOwner={room.isOwner}
            roomId={roomId}
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
              onUpdate={(updates) =>
                setRoom((prev) => ({ ...prev, ...updates }))
              }
            />
          )}
        </div>
      </div>

      <ParticipantsList
        users={users}
        isOwner={room.isOwner}
        currentUserId={room.currentUserId}
        roomId={roomId}
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
      />
    </div>
  );
}
