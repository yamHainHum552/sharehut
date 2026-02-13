import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export const useRoomSocket = (roomId: string) => {
  const [text, setText] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    socket.emit("join-room", { roomId });

    socket.on("text-update", setText);
    socket.on("user-list", setUsers);
    socket.on("room-lock-updated", ({ locked }) => {
      setIsReadOnly(locked);
    });

    socket.on("kicked", () => {
      alert("You were kicked");
      window.location.href = "/";
    });

    socket.on("room-abandoned", () => {
      alert("Room closed by owner");
      window.location.href = "/";
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off();
      socket.disconnect();
    };
  }, [roomId]);

  const updateText = (value: string) => {
    setText(value);
    socket.emit("text-update", { roomId, text: value });
  };

  return {
    text,
    users,
    isReadOnly,
    updateText,
  };
};
