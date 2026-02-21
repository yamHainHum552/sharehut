"use client";

import { QRCodeCanvas } from "qrcode.react";
import Card from "@/components/ui/Card";

export default function RoomQRModal({
  code,
  onClose,
}: {
  code: string;
  onClose: () => void;
}) {
  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join/${code}`
      : "";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="p-6 text-center space-y-4">
        <h3 className="text-lg font-semibold">Scan to Join</h3>

        <div className="bg-white p-4 rounded-lg inline-block">
          <QRCodeCanvas value={joinUrl} size={200} />
        </div>

        <p className="text-xs text-neutral-500 break-all">{joinUrl}</p>

        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700"
        >
          Close
        </button>
      </Card>
    </div>
  );
}
