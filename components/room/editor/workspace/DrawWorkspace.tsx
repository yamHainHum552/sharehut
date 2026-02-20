"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { socket } from "@/lib/socket";
import { v4 as uuid } from "uuid";
import { Pencil, Eraser, RotateCcw, Trash2 } from "lucide-react";

type Tool = "pen" | "eraser";

interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  size: number;
  tool: Tool;
}

export default function DrawWorkspace({
  roomId,
  isOwner,
  isReadOnly,
}: {
  roomId: string;
  isOwner: boolean;
  isReadOnly: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#a855f7");
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<Tool>("pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  const canDraw = isOwner || !isReadOnly;

  /* ---------------- Setup Canvas ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 520;
      redrawAll();
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    socket.emit("request-draw-sync", { roomId });
  }, [roomId]);

  /* ---------------- Drawing Engine ---------------- */

  const drawStroke = (stroke: Stroke) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineWidth = stroke.size;

    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.color;
    }

    ctx.beginPath();
    stroke.points.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  };

  const redrawAll = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(drawStroke);
  };

  /* ---------------- Mouse Events ---------------- */

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canDraw) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const stroke: Stroke = {
      id: uuid(),
      points: [{ x: e.clientX - rect.left, y: e.clientY - rect.top }],
      color,
      size,
      tool,
    };

    currentStrokeRef.current = stroke;
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentStrokeRef.current || !canDraw) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    currentStrokeRef.current.points.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    drawStroke(currentStrokeRef.current);
  };

  const handleMouseUp = () => {
    if (!currentStrokeRef.current || !canDraw) return;

    const stroke = currentStrokeRef.current;
    setStrokes((prev) => [...prev, stroke]);
    socket.emit("draw-event", { roomId, stroke });

    currentStrokeRef.current = null;
    setDrawing(false);
  };

  /* ---------------- Undo / Clear ---------------- */

  const handleUndo = () => {
    if (!canDraw || !strokes.length) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    socket.emit("draw-undo", { roomId, strokeId: last.id });
  };

  const handleClear = () => {
    if (!canDraw) return;
    setStrokes([]);
    socket.emit("draw-clear", { roomId });
  };

  /* ---------------- Socket Sync ---------------- */

  useEffect(() => {
    socket.on("draw-event", (stroke: Stroke) =>
      setStrokes((prev) => [...prev, stroke]),
    );
    socket.on("draw-undo", (strokeId: string) =>
      setStrokes((prev) => prev.filter((s) => s.id !== strokeId)),
    );
    socket.on("draw-clear", () => setStrokes([]));
    socket.on("draw-sync", (serverStrokes: Stroke[]) =>
      setStrokes(serverStrokes),
    );

    return () => {
      socket.off("draw-event");
      socket.off("draw-undo");
      socket.off("draw-clear");
      socket.off("draw-sync");
    };
  }, []);

  useEffect(() => {
    redrawAll();
  }, [strokes]);

  /* ---------------- UI ---------------- */

  return (
    <Card>
      {/* TOOLBAR */}
      <div className="mb-6 flex flex-wrap items-center gap-5 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        {/* Color */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Color</label>
          <input
            type="color"
            value={color}
            disabled={!canDraw}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded cursor-pointer border border-neutral-700"
          />
        </div>

        {/* Size */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-400">Size</label>
          <input
            type="range"
            min={1}
            max={30}
            value={size}
            disabled={!canDraw}
            onChange={(e) => setSize(Number(e.target.value))}
            className="accent-purple-500"
          />
          <span className="text-xs text-neutral-400 w-6 text-right">
            {size}
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={tool === "pen" ? "primary" : "secondary"}
            disabled={!canDraw}
            onClick={() => setTool("pen")}
          >
            <Pencil size={14} />
          </Button>

          <Button
            variant={tool === "eraser" ? "primary" : "secondary"}
            disabled={!canDraw}
            onClick={() => setTool("eraser")}
          >
            <Eraser size={14} />
          </Button>

          <Button variant="secondary" disabled={!canDraw} onClick={handleUndo}>
            <RotateCcw size={14} />
          </Button>

          <Button variant="danger" disabled={!canDraw} onClick={handleClear}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* CANVAS */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-inner">
        {!canDraw && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-sm text-neutral-300 z-10">
            Room is in read-only mode
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full bg-neutral-950"
          style={{ height: 520, cursor: canDraw ? "crosshair" : "not-allowed" }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
    </Card>
  );
}
