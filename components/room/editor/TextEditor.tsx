import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function TextEditor({
  text,
  isReadOnly,
  isOwner,
  onChange,
}: {
  text: string;
  isReadOnly: boolean;
  isOwner: boolean;
  onChange: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy text");
    }
  };

  const handleReset = () => {
    if (!isOwner) return;

    const confirmReset = confirm(
      "Are you sure you want to clear the entire text?",
    );
    if (!confirmReset) return;

    onChange("");
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400 font-medium">
          Collaborative Editor
        </div>

        <div className="flex gap-3">
          {/* Copy Button */}
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="px-4 py-2 text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>

          {/* Reset Button (Owner Only) */}
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
        onChange={(e) => onChange(e.target.value)}
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
