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

  /* ---------------- Load PDF ---------------- */

  useEffect(() => {
    const loadPdf = async () => {
      const pdfjs = await import("pdfjs-dist");

      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url,
      ).toString();

      const loadingTask = pdfjs.getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
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

      // Cancel previous render if running
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-neutral-900 p-6 rounded-xl max-h-[95vh] overflow-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-4 text-white">
          <button onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>
            ⬅
          </button>

          <span>
            Page {pageNumber} / {numPages}
          </span>

          <button
            onClick={() => setPageNumber((p) => (p < numPages ? p + 1 : p))}
          >
            ➡
          </button>

          <button onClick={() => setScale((s) => s + 0.2)}>Zoom +</button>

          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}>
            Zoom −
          </button>
        </div>

        <canvas ref={canvasRef} className="rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
