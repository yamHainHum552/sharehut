"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "text" | "files" | "draw";

export default function DemoPreview() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const script = [
    "Planning sprint tasks...",
    "• Setup authentication",
    "• Implement real-time sync",
    "• Add auto-expiry feature",
    "• Vibe code with members",
    "Room ready for collaboration 🚀",
  ];

  /* ---------------- Typing Simulation ---------------- */

  useEffect(() => {
    let index = 0;
    let active = true;

    const loop = async () => {
      while (active) {
        setTyping(true);
        await new Promise((res) => setTimeout(res, 700));
        if (!active) return;

        setText((prev) => prev + script[index] + "\n");
        setTyping(false);

        index = (index + 1) % script.length;

        if (index === 0) {
          await new Promise((res) => setTimeout(res, 2000));
          if (!active) return;
          setText("");
        }

        await new Promise((res) => setTimeout(res, 1000));
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

  /* ---------------- Copy ---------------- */

  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://sharehutlive.com/share");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  /* ---------------- Drawing Demo ---------------- */

  useEffect(() => {
    if (mode !== "draw") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 250;

    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;

    let x = 0;

    const interval = setInterval(() => {
      ctx.beginPath();
      ctx.moveTo(x, 120);
      ctx.lineTo(x + 10, 120 + Math.sin(x / 20) * 40);
      ctx.stroke();
      x += 10;
      if (x > canvas.width) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = 0;
      }
    }, 80);

    return () => clearInterval(interval);
  }, [mode]);

  /* ---------------- Fake Files ---------------- */

  const files = [
    { name: "project-plan.pdf", size: "1.2 MB" },
    { name: "design-mockup.png", size: "860 KB" },
    { name: "requirements.docx", size: "540 KB" },
  ];

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

        {/* Workspace Tabs */}
        <div className="flex gap-2 mb-4">
          {(["text", "files", "draw"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs rounded-md transition ${
                mode === m
                  ? "bg-purple-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {m === "text" && "Text"}
              {m === "files" && "Files"}
              {m === "draw" && "Draw"}
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="relative w-full h-52 bg-neutral-950 rounded-lg p-4 overflow-hidden">
          {mode === "text" && (
            <>
              <pre className="text-sm font-mono whitespace-pre-wrap text-neutral-200">
                {text}
              </pre>
              {typing && (
                <div className="absolute bottom-3 left-4 text-xs text-blue-400 animate-pulse">
                  Someone is typing...
                </div>
              )}
            </>
          )}

          {mode === "files" && (
            <div className="space-y-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-md"
                >
                  <span className="text-sm text-neutral-200">{file.name}</span>
                  <span className="text-xs text-neutral-400">{file.size}</span>
                </div>
              ))}
            </div>
          )}

          {mode === "draw" && (
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-md bg-neutral-950"
            />
          )}

          <div className="absolute bottom-3 right-4 text-xs text-yellow-400 font-mono">
            ⏳ Expires in {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
