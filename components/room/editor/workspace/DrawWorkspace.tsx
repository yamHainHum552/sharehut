"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const currentStrokeRef = useRef<Stroke | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#a855f7");
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<Tool>("pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const canDraw = isOwner || !isReadOnly;

  /* --------------------- Setup Canvas --------------------- */

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = 520 * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `520px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;
    redrawAll();
  }, [strokes]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    socket.emit("request-draw-sync", { roomId });
  }, [roomId]);

  /* --------------------- Drawing Engine --------------------- */

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

  useEffect(() => {
    redrawAll();
  }, [strokes]);

  /* --------------------- Pointer Events (Mobile + Desktop) --------------------- */

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canDraw) return;

    e.preventDefault();

    const stroke: Stroke = {
      id: uuid(),
      points: [getPoint(e)],
      color,
      size,
      tool,
    };

    currentStrokeRef.current = stroke;
    setDrawing(true);

    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentStrokeRef.current || !canDraw) return;

    const point = getPoint(e);
    currentStrokeRef.current.points.push(point);

    drawStroke(currentStrokeRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current || !canDraw) return;

    const stroke = currentStrokeRef.current;

    setStrokes((prev) => [...prev, stroke]);
    socket.emit("draw-event", { roomId, stroke });

    currentStrokeRef.current = null;
    setDrawing(false);

    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  /* --------------------- Undo / Clear --------------------- */

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

  /* --------------------- Socket Sync --------------------- */

  useEffect(() => {
    const onDraw = (stroke: Stroke) => setStrokes((prev) => [...prev, stroke]);

    const onUndo = (strokeId: string) =>
      setStrokes((prev) => prev.filter((s) => s.id !== strokeId));

    const onClear = () => setStrokes([]);
    const onSync = (serverStrokes: Stroke[]) => setStrokes(serverStrokes);

    socket.on("draw-event", onDraw);
    socket.on("draw-undo", onUndo);
    socket.on("draw-clear", onClear);
    socket.on("draw-sync", onSync);

    return () => {
      socket.off("draw-event", onDraw);
      socket.off("draw-undo", onUndo);
      socket.off("draw-clear", onClear);
      socket.off("draw-sync", onSync);
    };
  }, []);

  /* --------------------- UI --------------------- */

  return (
    <Card>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Color</label>
          <input
            type="color"
            value={color}
            disabled={!canDraw}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 rounded border border-neutral-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400">Size</label>
          <input
            type="range"
            min={1}
            max={30}
            value={size}
            disabled={!canDraw}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

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

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-inner touch-none">
        {!canDraw && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm text-neutral-300 z-10">
            Room is in read-only mode
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full bg-neutral-950"
          style={{ height: 520, cursor: canDraw ? "crosshair" : "not-allowed" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </Card>
  );
}
