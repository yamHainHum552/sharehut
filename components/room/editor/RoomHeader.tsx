"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RoomHeader({
  roomId,
  code,
  roomName,
  isOwner,
  onOpenSettings,
}: {
  roomId: string;
  code: string;
  roomName: string;
  isOwner: boolean;
  onOpenSettings: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // fallback (rare case)
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{roomName}</h2>

          <p className="font-mono text-neutral-400">{roomId}</p>

          <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
            <span>
              Code: <span className="font-mono">{code}</span>
            </span>

            <button
              onClick={copyCode}
              className="px-2 py-1 text-xs bg-neutral-800 rounded hover:bg-neutral-700 transition"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwner && (
            <Button variant="secondary" onClick={onOpenSettings}>
              ⚙️ Settings
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Leave
          </Button>
        </div>
      </div>
    </Card>
  );
}
