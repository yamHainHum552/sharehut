"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { refreshSocketAuth } from "@/lib/socketAuth";

import RoomHeader from "./RoomHeader";
import RoomStatus from "./RoomStatus";
import ParticipantsList from "./ParticipantsList";
import RoomSettingsModal from "./RoomSettingsModal";
import WorkspaceToolbar from "./WorkspaceToolbar";
import TextWorkspace from "./workspace/TextWorkspace";
import FileWorkspace from "./workspace/FilesWorkspace";
import DrawWorkspace from "./workspace/DrawWorkspace";

type WorkspaceMode = "text" | "files" | "draw";

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

  const [mode, setMode] = useState<WorkspaceMode>("text");
  const [text, setText] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [joined, setJoined] = useState(false);

  const [room, setRoom] = useState<RoomState>({
    isOwner: false,
    isReadOnly: false,
    allowJoins: true,
    code: roomCode,
    name: "",
    currentUserId: "",
    isGuestRoom: false,
  });

  /* -------------------------------------------------- */
  /*                   Fetch Room Meta                  */
  /* -------------------------------------------------- */

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
  }, [roomId, router]);

  /* -------------------------------------------------- */
  /*                 Stable Join Function               */
  /* -------------------------------------------------- */

  const emitJoin = useCallback(() => {
    socket.emit("join-room", { roomId });
  }, [roomId]);

  /* -------------------------------------------------- */
  /*              Join Room (Connection Safe)           */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (isPending) return;

    refreshSocketAuth();

    if (socket.connected) {
      emitJoin();
    } else {
      socket.connect();
      socket.once("connect", emitJoin);
    }

    return () => {
      socket.off("connect", emitJoin);
    };
  }, [emitJoin, isPending]);

  /* -------------------------------------------------- */
  /*           Auto Re-Join On Reconnect (Important)   */
  /* -------------------------------------------------- */

  useEffect(() => {
    const handleReconnect = () => {
      emitJoin();
    };

    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("reconnect", handleReconnect);
    };
  }, [emitJoin]);

  /* -------------------------------------------------- */
  /*                Socket Event Listeners              */
  /* -------------------------------------------------- */

  useEffect(() => {
    const handleUserList = (list: any[]) => {
      setUsers(list);
      setJoined(true);
    };

    const handleTextUpdate = (newText: string) => {
      setText(newText);
    };

    const handleTypingUpdate = (list: any[]) => {
      setTypingUsers(list);
    };

    const handleRoomSettingsUpdated = (data: any) => {
      setRoom((prev) => ({ ...prev, ...data }));
    };

    const handleRoomExpired = () => {
      alert("Room expired");
      router.push("/");
    };

    socket.on("user-list", handleUserList);
    socket.on("text-update", handleTextUpdate);
    socket.on("typing-update", handleTypingUpdate);
    socket.on("room-settings-updated", handleRoomSettingsUpdated);
    socket.on("room-expired", handleRoomExpired);

    return () => {
      socket.off("user-list", handleUserList);
      socket.off("text-update", handleTextUpdate);
      socket.off("typing-update", handleTypingUpdate);
      socket.off("room-settings-updated", handleRoomSettingsUpdated);
      socket.off("room-expired", handleRoomExpired);

      socket.emit("leave-room");
    };
  }, [router]);

  /* -------------------------------------------------- */
  /*                       Pending                      */
  /* -------------------------------------------------- */

  if (isPending && !joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Waiting for approval...
      </div>
    );
  }

  /* -------------------------------------------------- */
  /*                        Render                      */
  /* -------------------------------------------------- */

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

          <WorkspaceToolbar mode={mode} setMode={setMode} />

          {mode === "text" && (
            <TextWorkspace
              text={text}
              setText={setText}
              roomId={roomId}
              room={room}
            />
          )}

          {mode === "files" && <FileWorkspace roomId={roomId} room={room} />}

          {mode === "draw" && (
            <DrawWorkspace
              roomId={roomId}
              isOwner={room.isOwner}
              isReadOnly={room.isReadOnly}
            />
          )}

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
