"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type JoinRequest = {
  id: string;
  user_id: string;
};

interface JoinRequestsProps {
  roomId: string;
  refreshKey?: number; // 👈 NEW
}

export default function JoinRequests({
  roomId,
  refreshKey,
}: JoinRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoding] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api(`/requests/${roomId}`, "GET");

      if (Array.isArray(res)) {
        setRequests(res);
      } else if (Array.isArray(res?.requests)) {
        setRequests(res.requests);
      } else {
        setRequests([]);
      }
    } catch {
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();

    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, [roomId, refreshKey]); // 👈 refreshKey added

  const approve = async (requestId: string) => {
    setLoding(true);
    await api(`/requests/approve/${requestId}`, "POST", { approve: true });
    fetchRequests();
    setLoding(false);
  };

  if (requests.length === 0) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Join Requests</h3>

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">
              User ID: {req.user_id}
            </span>

            <Button onClick={() => approve(req.id)}>Approve</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
