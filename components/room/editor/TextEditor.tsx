"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { socket } from "@/lib/socket";

export default function TextEditor({
  text,
  isReadOnly,
  isOwner,
  roomId,
  onChange,
}: {
  text: string;
  isReadOnly: boolean;
  isOwner: boolean;
  roomId: string;
  onChange: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const isTyping = useRef(false);

  /* ---------------- Typing Logic ---------------- */

  const handleTyping = () => {
    if (isReadOnly && !isOwner) return;

    if (!isTyping.current) {
      socket.emit("typing-start", { roomId });
      isTyping.current = true;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing-stop", { roomId });
      isTyping.current = false;
    }, 2000);
  };

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (isTyping.current) {
        socket.emit("typing-stop", { roomId });
      }

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [roomId]);

  /* ---------------- Copy ---------------- */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy text");
    }
  };

  /* ---------------- Reset ---------------- */

  const handleReset = () => {
    if (!isOwner) return;

    const confirmReset = confirm(
      "Are you sure you want to clear the entire text?",
    );
    if (!confirmReset) return;

    onChange("");
  };

  /* ---------------- Render ---------------- */

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400 font-medium">
          Collaborative Editor
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="px-4 py-2 text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>

          {isOwner && (
            <Button
              variant="danger"
              onClick={handleReset}
              className="px-4 py-2 text-sm"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <textarea
        value={text}
        disabled={isReadOnly && !isOwner}
        onChange={(e) => {
          onChange(e.target.value);
          handleTyping();
        }}
        className={`w-full h-[60vh] p-4 font-mono rounded resize-none transition outline-none
          ${
            isReadOnly && !isOwner
              ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-900 focus:ring-1 focus:ring-purple-500"
          }
        `}
      />
    </Card>
  );
}
