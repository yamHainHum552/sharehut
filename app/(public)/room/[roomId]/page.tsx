import type { Metadata } from "next";
import RoomGate from "@/components/room/RoomGate";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

/* ---------------- Metadata ---------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;

  return {
    title: `Room ${roomId}`,
    description: "Secure real-time text sharing room on ShareHut.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

/* ---------------- Page ---------------- */

export default async function RoomPage({
  params,
  searchParams,
}: RoomPageProps) {
  const { roomId } = await params;
  const resolvedSearchParams = await searchParams;

  const pendingRaw = resolvedSearchParams.pending;
  const pending =
    typeof pendingRaw === "string"
      ? pendingRaw
      : Array.isArray(pendingRaw)
        ? pendingRaw[0]
        : undefined;

  const codeRaw = resolvedSearchParams.code;
  const code =
    typeof codeRaw === "string"
      ? codeRaw
      : Array.isArray(codeRaw)
        ? codeRaw[0]
        : "";

  return <RoomGate roomId={roomId} pending={pending} code={code} />;
}
