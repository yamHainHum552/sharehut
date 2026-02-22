"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
});

interface FileItem {
  id: string;
  url: string;
  format: string;
  size: number;
  resourceType?: string;
}

export default function FileWorkspace({
  roomId,
  room,
}: {
  roomId: string;
  room: any;
}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [pdfFile, setPdfFile] = useState<FileItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canUpload = useMemo(() => {
    return room?.isOwner || !room?.isReadOnly;
  }, [room]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api(`/files/${roomId}`, "GET");
        setFiles(res);
      } catch {
        console.error("Failed to fetch files");
      }
    };
    fetchFiles();
  }, [roomId]);

  useEffect(() => {
    const handleFileAdded = (file: FileItem) =>
      setFiles((prev) => [...prev, file]);
    const handleFileDeleted = ({ fileId }: { fileId: string }) =>
      setFiles((prev) => prev.filter((f) => f.id !== fileId));

    socket.on("file-added", handleFileAdded);
    socket.on("file-deleted", handleFileDeleted);

    return () => {
      socket.off("file-added", handleFileAdded);
      socket.off("file-deleted", handleFileDeleted);
    };
  }, []);

  const uploadFile = async (file: File) => {
    if (!canUpload) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await api(`/files/${roomId}`, "POST", formData, true);
    } catch (err: any) {
      alert(err?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!canUpload) return;
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) uploadFile(e.dataTransfer.files[0]);
  };

  const deleteFile = async (fileId: string) => {
    if (!room?.isOwner || !confirm("Delete this file?")) return;
    try {
      await api(`/files/${fileId}`, "DELETE");
    } catch {
      alert("Deletion failed");
    }
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const getIcon = (format: string) => {
    if (["png", "jpg", "jpeg", "webp"].includes(format)) return "🖼️";
    if (format === "pdf") return "📕";
    return "📄";
  };

  const getFileName = (url: string) => url.split("/").pop() || "file";

  return (
    <Card className="p-0 sm:p-4 border-none sm:border bg-transparent sm:bg-neutral-950">
      {/* Responsive Upload Zone */}
      <div
        onDragOver={(e) => {
          if (canUpload) {
            e.preventDefault();
            setDragActive(true);
          }
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center transition flex flex-col items-center justify-center ${
          !canUpload
            ? "border-neutral-800 bg-neutral-950/50 opacity-60 cursor-not-allowed"
            : dragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-neutral-800 bg-neutral-900/50"
        }`}
      >
        <p className="text-sm sm:text-base text-neutral-400 mb-4 max-w-xs mx-auto">
          {canUpload
            ? "Drag & drop files here or click to upload"
            : "Only authorized users can upload files"}
        </p>

        <Button
          className="w-full sm:w-auto px-8"
          onClick={() => canUpload && fileInputRef.current?.click()}
          disabled={!canUpload || uploading}
        >
          {uploading ? "Uploading..." : "Select File"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        />
      </div>

      {/* Responsive File List */}
      <div className="mt-6 grid grid-cols-1 gap-3">
        {files.length === 0 && (
          <div className="py-10 text-neutral-500 text-sm text-center italic">
            No files available in this room
          </div>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-neutral-900/40 rounded-xl p-4 border border-neutral-800 gap-4 hover:bg-neutral-900/60 transition"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
              <div className="text-xl sm:text-2xl shrink-0">
                {getIcon(file.format)}
              </div>
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => {
                    if (["png", "jpg", "jpeg", "webp"].includes(file.format))
                      setPreviewFile(file);
                    else if (file.format === "pdf") setPdfFile(file);
                    else window.open(file.url, "_blank");
                  }}
                  className="text-white hover:text-purple-400 font-medium text-sm truncate block w-full text-left transition-colors"
                >
                  {getFileName(file.url)}
                </button>
                <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider">
                  {file.format} • {formatSize(file.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                className="flex-1 sm:flex-none text-xs h-9"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = file.url.replace(
                    "/upload/",
                    "/upload/fl_attachment/",
                  );
                  link.download = getFileName(file.url);
                  link.click();
                }}
              >
                Download
              </Button>

              {room?.isOwner && (
                <Button
                  variant="danger"
                  className="flex-1 sm:flex-none text-xs h-9"
                  onClick={() => deleteFile(file.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative group">
            <button className="absolute -top-10 right-0 text-white text-sm bg-neutral-800 px-3 py-1 rounded-full">
              Close
            </button>
            <img
              src={previewFile.url}
              alt="Preview"
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {pdfFile && (
        <PDFViewer fileUrl={pdfFile.url} onClose={() => setPdfFile(null)} />
      )}
    </Card>
  );
}
