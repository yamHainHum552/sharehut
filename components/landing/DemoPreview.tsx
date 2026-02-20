"use client";

import { useEffect, useState } from "react";

export default function DemoPreview() {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  const script = [
    "Planning sprint tasks...",
    "• Setup authentication",
    "• Implement real-time sync",
    "• Add auto-expiry feature",
    "• Vibe code with members",
    "Room ready for collaboration 🚀",
  ];

  /* ---------------- Infinite Safe Typing ---------------- */

  useEffect(() => {
    let index = 0;
    let active = true;

    const loop = async () => {
      while (active) {
        setTyping(true);

        await new Promise((res) => setTimeout(res, 800));

        if (!active) return;

        setText((prev) => prev + script[index] + "\n");
        setTyping(false);

        index = (index + 1) % script.length;

        if (index === 0) {
          await new Promise((res) => setTimeout(res, 2000));
          if (!active) return;
          setText("");
        }

        await new Promise((res) => setTimeout(res, 1200));
      }
    };

    loop();

    return () => {
      active = false;
    };
  }, []);

  /* ---------------- Countdown ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 60 * 60));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  /* ---------------- Copy Link ---------------- */

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://sharehutlive.com/share");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      <div className="bg-neutral-900 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-semibold tracking-wide">
              Sprint Planning Room
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Code: SH-9X7A21
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-green-400 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live
            </span>

            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 bg-neutral-800 rounded-md hover:bg-neutral-700 transition font-medium"
            >
              {copied ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-3 mb-5">
          {["A", "P", "D"].map((char, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs flex items-center justify-center font-bold shadow-md"
            >
              {char}
            </div>
          ))}
          <span className="text-xs text-neutral-400">
            3 participants collaborating
          </span>
        </div>

        {/* Content Area */}
        <div className="relative">
          <pre className="w-full h-48 bg-neutral-950 text-sm p-4 font-mono rounded-lg whitespace-pre-wrap leading-relaxed text-neutral-200 shadow-inner">
            {text}
          </pre>

          {typing && (
            <div className="absolute bottom-3 left-4 text-xs text-blue-400 animate-pulse">
              Someone is typing...
            </div>
          )}

          <div className="absolute bottom-3 right-4 text-xs text-yellow-400 font-mono">
            ⏳ Expires in {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
