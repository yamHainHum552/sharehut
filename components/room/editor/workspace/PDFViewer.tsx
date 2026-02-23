"use client";

import { useEffect, useRef, useState } from "react";

export default function PDFViewer({
  fileUrl,
  onClose,
}: {
  fileUrl: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load PDF ---------------- */
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);

      // Load pdf.js script dynamically
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;

      script.onload = async () => {
        // @ts-ignore
        const pdfjsLib = window["pdfjsLib"];

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      };

      document.body.appendChild(script);
    };

    loadPdf();
  }, [fileUrl]);

  /* ---------------- Safe Render ---------------- */

  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({
        canvasContext: context,
        viewport,
      });

      renderTaskRef.current = renderTask;

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  /* ---------------- Keyboard Navigation ---------------- */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setPageNumber((p) => (p < numPages ? p + 1 : p));
      if (e.key === "ArrowLeft") setPageNumber((p) => Math.max(1, p - 1));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [numPages, onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-white/10">
          <div className="flex items-center gap-4 text-white">
            <span className="font-semibold text-lg">
              Page {pageNumber} / {numPages}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 transition flex items-center justify-center text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 py-3 bg-neutral-800 border-b border-white/10">
          <ControlButton
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            ⬅
          </ControlButton>

          <ControlButton
            onClick={() => setPageNumber((p) => (p < numPages ? p + 1 : p))}
          >
            ➡
          </ControlButton>

          <ControlButton onClick={() => setScale((s) => s + 0.2)}>
            Zoom +
          </ControlButton>

          <ControlButton
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          >
            Zoom −
          </ControlButton>
        </div>

        {/* PDF Body */}
        <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-neutral-950">
          {loading ? (
            <div className="text-white animate-pulse text-lg">
              Loading PDF...
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="rounded-xl shadow-2xl border border-white/10"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable Button ---------------- */

function ControlButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-indigo-500 transition text-white font-medium"
    >
      {children}
    </button>
  );
}
