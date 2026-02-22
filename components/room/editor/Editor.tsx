"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { initializeSocketAuth, socket } from "@/lib/socket";
import { api } from "@/lib/api";

import RoomHeader from "./RoomHeader";
import RoomStatus from "./RoomStatus";
import ParticipantsList from "./ParticipantsList";
import RoomSettingsModal from "./RoomSettingsModal";
import WorkspaceToolbar from "./WorkspaceToolbar";
import TextWorkspace from "./workspace/TextWorkspace";
import FileWorkspace from "./workspace/FilesWorkspace";
import DrawWorkspace from "./workspace/DrawWorkspace";
import PendingApproval from "../PendingApproval";
import JoinRequests from "../JoinRequests";

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
  const [requestRefreshKey, setRequestRefreshKey] = useState(0);

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
  /*            Stable Socket Connection + Join        */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (isPending) return;

    initializeSocketAuth();

    if (!socket.connected) {
      socket.connect();
    }

    const joinRoom = () => {
      socket.emit("join-room", { roomId });
    };

    socket.on("connect", joinRoom);

    // If already connected
    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("leave-room");
    };
  }, [roomId, isPending]);

  /* -------------------------------------------------- */
  /*                Socket Event Listeners              */
  /* -------------------------------------------------- */

  useEffect(() => {
    const handleUserList = (list: any[]) => {
      setUsers(list);
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

    const handleApprovalRequired = () => {
      router.push(`/room/${roomId}?code=${room.code}&pending=true`);
    };

    const handleJoinApproved = ({ userId }: { userId: string }) => {
      if (userId === room.currentUserId) {
        router.replace(`/room/${roomId}?code=${room.code}`);
      }
    };

    const handleNewJoinRequest = () => {
      setRequestRefreshKey((prev) => prev + 1);
    };

    socket.on("user-list", handleUserList);
    socket.on("text-update", handleTextUpdate);
    socket.on("typing-update", handleTypingUpdate);
    socket.on("room-settings-updated", handleRoomSettingsUpdated);
    socket.on("room-expired", handleRoomExpired);
    socket.on("approval-required", handleApprovalRequired);
    socket.on("join-request-approved", handleJoinApproved);
    socket.on("new-join-request", handleNewJoinRequest);

    return () => {
      socket.off("user-list", handleUserList);
      socket.off("text-update", handleTextUpdate);
      socket.off("typing-update", handleTypingUpdate);
      socket.off("room-settings-updated", handleRoomSettingsUpdated);
      socket.off("room-expired", handleRoomExpired);
      socket.off("approval-required", handleApprovalRequired);
      socket.off("join-request-approved", handleJoinApproved);
      socket.off("new-join-request", handleNewJoinRequest);
    };
  }, [router, roomId, room.code, room.currentUserId]);
  /* -------------------------------------------------- */
  /*                       Pending                      */
  /* -------------------------------------------------- */

  if (isPending) {
    return <PendingApproval roomId={roomId} />;
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
          {room.isOwner && (
            <JoinRequests roomId={roomId} refreshKey={requestRefreshKey} />
          )}

          <RoomStatus room={room} />

          <div className="hidden md:block">
            <WorkspaceToolbar mode={mode} setMode={setMode} />
          </div>

          {/* Mobile Bottom */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 z-40">
            <WorkspaceToolbar mode={mode} setMode={setMode} mobile />
          </div>

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
