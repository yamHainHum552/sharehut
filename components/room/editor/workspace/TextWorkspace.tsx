"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { socket } from "@/lib/socket";
import { FileText, Copy } from "lucide-react";

export default function TextWorkspace({ text, setText, roomId, room }: any) {
  const [copied, setCopied] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const isTyping = useRef(false);

  const isLocked = room.isReadOnly && !room.isOwner;

  /* ---------------- Typing Logic ---------------- */

  const handleTyping = () => {
    if (isLocked) return;

    if (!isTyping.current) {
      socket.emit("typing-start", { roomId });
      isTyping.current = true;
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing-stop", { roomId });
      isTyping.current = false;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (isTyping.current) {
        socket.emit("typing-stop", { roomId });
      }
    };
  }, [roomId]);

  /* ---------------- Copy ---------------- */

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ---------------- Stats ---------------- */

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      words,
      characters: text.length,
    };
  }, [text]);

  /* ---------------- Render ---------------- */

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
            <FileText size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Collaborative Editor
            </h3>
            <p className="text-xs text-neutral-500">
              Real-time shared text workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-xs text-neutral-400 gap-3">
            <span>{stats.words} words</span>
            <span>{stats.characters} chars</span>
          </div>

          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={handleCopy}
          >
            <Copy size={14} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative group">
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-sm text-neutral-300 rounded-xl z-10">
            Room is in read-only mode
          </div>
        )}

        <div className="rounded-xl p-[1px] bg-gradient-to-r from-purple-600/40 via-indigo-600/30 to-purple-600/40 transition-all group-focus-within:from-purple-600 group-focus-within:to-indigo-600">
          <textarea
            value={text}
            disabled={isLocked}
            onChange={(e) => {
              setText(e.target.value);
              socket.emit("text-update", {
                roomId,
                text: e.target.value,
              });
              handleTyping();
            }}
            placeholder="Start typing your shared notes..."
            className={`
              w-full h-[60vh]
              p-6
              bg-neutral-950
              text-neutral-100
              font-mono text-sm leading-relaxed
              rounded-xl
              resize-none
              outline-none
              border border-neutral-800
              focus:border-transparent
              transition-all duration-200
            `}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-xs text-neutral-500 flex justify-between">
        <span>
          {isLocked ? "Read-only mode enabled" : "You can edit this document"}
        </span>

        <span className="hidden sm:block">Auto-synced in real time</span>
      </div>
    </Card>
  );
}
