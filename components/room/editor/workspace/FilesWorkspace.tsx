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

  /* -------------------------------------------------- */
  /*                  Permission Logic                  */
  /* -------------------------------------------------- */

  const canUpload = useMemo(() => {
    return room?.isOwner || !room?.isReadOnly;
  }, [room]);

  /* -------------------------------------------------- */
  /*                    Fetch Files                     */
  /* -------------------------------------------------- */

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

  /* -------------------------------------------------- */
  /*                    Socket Sync                     */
  /* -------------------------------------------------- */

  useEffect(() => {
    const handleFileAdded = (file: FileItem) => {
      setFiles((prev) => [...prev, file]);
    };

    const handleFileDeleted = ({ fileId }: { fileId: string }) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    socket.on("file-added", handleFileAdded);
    socket.on("file-deleted", handleFileDeleted);

    return () => {
      socket.off("file-added", handleFileAdded);
      socket.off("file-deleted", handleFileDeleted);
    };
  }, []);

  /* -------------------------------------------------- */
  /*                      Upload                        */
  /* -------------------------------------------------- */

  const uploadFile = async (file: File) => {
    if (!canUpload) {
      alert("Only the room owner can upload files.");
      return;
    }

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    uploadFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!canUpload) return;

    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files?.length) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  /* -------------------------------------------------- */
  /*                      Delete                        */
  /* -------------------------------------------------- */

  const deleteFile = async (fileId: string) => {
    if (!room?.isOwner) return;

    if (!confirm("Delete this file?")) return;

    try {
      await api(`/files/${fileId}`, "DELETE");
    } catch {
      alert("Deletion failed");
    }
  };

  /* -------------------------------------------------- */
  /*                      Helpers                       */
  /* -------------------------------------------------- */

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getIcon = (format: string) => {
    if (["png", "jpg", "jpeg", "webp"].includes(format)) return "🖼️";
    if (format === "pdf") return "📕";
    if (format === "zip") return "🗜️";
    return "📄";
  };

  const isImage = (format: string) =>
    ["png", "jpg", "jpeg", "webp"].includes(format);

  const getFileName = (url: string) => url.split("/").pop() || "file";

  const downloadFile = (file: FileItem) => {
    const downloadUrl = file.url.replace("/upload/", "/upload/fl_attachment/");

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = getFileName(file.url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* -------------------------------------------------- */
  /*                       Render                       */
  /* -------------------------------------------------- */

  return (
    <Card>
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          if (!canUpload) return;
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          !canUpload
            ? "border-neutral-800 bg-neutral-950 opacity-50 cursor-not-allowed"
            : dragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-neutral-700 bg-neutral-900"
        }`}
      >
        <p className="text-neutral-400 mb-4">
          {canUpload
            ? "Drag & drop files here or click to upload"
            : "Only the room owner can upload files"}
        </p>

        <Button
          onClick={() => canUpload && fileInputRef.current?.click()}
          disabled={!canUpload || uploading}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </Button>

        {canUpload && (
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
          />
        )}
      </div>

      {/* File List */}
      <div className="mt-8 space-y-4">
        {files.length === 0 && (
          <div className="text-neutral-500 text-sm text-center">
            No files uploaded yet
          </div>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-neutral-700 transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">{getIcon(file.format)}</div>

              <div>
                <button
                  onClick={() => {
                    if (isImage(file.format)) {
                      setPreviewFile(file);
                    } else if (file.format === "pdf") {
                      setPdfFile(file);
                    } else {
                      window.open(file.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="text-white hover:underline text-sm text-left"
                >
                  {getFileName(file.url)}
                </button>

                <div className="text-xs text-neutral-500">
                  {formatSize(file.size)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="text-xs px-3 py-1"
                onClick={() => downloadFile(file)}
              >
                Download
              </Button>

              {room?.isOwner && (
                <Button
                  variant="danger"
                  className="text-xs px-3 py-1"
                  onClick={() => deleteFile(file.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={() => setPreviewFile(null)}
        >
          <img
            src={previewFile.url}
            alt="Preview"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
          />
        </div>
      )}

      {pdfFile && (
        <PDFViewer fileUrl={pdfFile.url} onClose={() => setPdfFile(null)} />
      )}
    </Card>
  );
}
