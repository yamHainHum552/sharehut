"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  expiresAt: string;
}

export default function RoomExpiryTimer({ expiresAt }: Props) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const expiryTime = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setRemaining(0);
        router.push("/");
        return;
      }

      setRemaining(diff);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!remaining) return null;

  const minutes = Math.floor((remaining / 1000 / 60) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  const formatted = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 text-sm text-yellow-400">
      Room expires in {formatted}
    </div>
  );
}
