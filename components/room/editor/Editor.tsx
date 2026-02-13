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
  const [refreshJoinRequests, setRefreshJoinRequests] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [joined, setJoined] = useState(false);
  const [guestBlocked, setGuestBlocked] = useState(false);

  const [room, setRoom] = useState<RoomState>({
    isOwner: false,
    isReadOnly: false,
    allowJoins: true,
    code: roomCode,
    name: "",
    currentUserId: "",
    isGuestRoom: false,
  });

  /* -------------------------------------------------------------------------- */
  /*                               Fetch Room Meta                              */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                               Join Socket Room                             */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                               Socket Listeners                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!joined) return;

    const handleUserList = (list: any[]) => setUsers(list);
    const handleTextUpdate = (value: string) => setText(value);
    const handleJoinRequestCreated = () => setRefreshJoinRequests((v) => v + 1);

    const handleJoinDenied = ({ reason }: { reason: string }) => {
      alert(reason || "Access denied");
      router.push("/");
    };

    const handleRoomAbandoned = () => {
      alert("The room owner has left. This room is now closed.");
      router.push("/");
    };

    const handleKicked = () => {
      alert("You were removed from the room.");
      router.push("/");
    };

    const handleGuestLimit = () => {
      setGuestBlocked(true);
    };

    socket.on("user-list", handleUserList);
    socket.on("text-update", handleTextUpdate);
    socket.on("guest-limit-reached", handleGuestLimit);
    socket.on("join-request-created", handleJoinRequestCreated);
    socket.on("join-denied", handleJoinDenied);
    socket.on("room-abandoned", handleRoomAbandoned);
    socket.on("kicked", handleKicked);

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
      socket.off("guest-limit-reached", handleGuestLimit);
      socket.off("join-request-created", handleJoinRequestCreated);
      socket.off("join-denied", handleJoinDenied);
      socket.off("room-abandoned", handleRoomAbandoned);
      socket.off("kicked", handleKicked);
      socket.off("room-settings-updated");
      socket.off("room-expired");
    };
  }, [joined]);

  /* -------------------------------------------------------------------------- */
  /*                               Pending UI                                   */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                               Render                                        */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <RoomHeader
        roomId={roomId}
        code={room.code}
        isOwner={room.isOwner}
        roomName={room.name}
        expiresAt={room.expiresAt}
        onOpenSettings={() => setShowSettings(true)}
      />

      <RoomStatus room={room} />

      {guestBlocked && (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          Guest edit limit reached (15 edits). Please sign in for unlimited
          collaboration.
        </div>
      )}

      {/* 🔥 Only render join requests for authenticated rooms */}
      {room.isOwner && !room.isGuestRoom && (
        <JoinRequests roomId={roomId} refreshKey={refreshJoinRequests} />
      )}

      <ParticipantsList
        users={users}
        isOwner={room.isOwner}
        currentUserId={room.currentUserId}
        roomId={roomId}
      />

      <TextEditor
        text={text}
        isReadOnly={room.isReadOnly || guestBlocked}
        isOwner={room.isOwner}
        onChange={(value) => {
          if (guestBlocked) return;
          setText(value);
          socket.emit("text-update", { roomId, text: value });
        }}
      />

      {showSettings && (
        <RoomSettingsModal
          room={room}
          roomId={roomId}
          onClose={() => setShowSettings(false)}
          onUpdate={(updates) => setRoom((prev) => ({ ...prev, ...updates }))}
        />
      )}
    </div>
  );
}
