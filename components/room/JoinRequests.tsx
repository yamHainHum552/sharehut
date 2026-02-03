"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type JoinRequest = {
  id: string;
  user_id: string;
};

export default function JoinRequests({ roomId }: { roomId: string }) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await api(
        `/requests/${roomId}`,
        "GET",
        undefined,
        getToken()!,
      );
      setRequests(res || []);
    } catch {
      // non-owner will get 403, ignore silently
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const approve = async (requestId: string) => {
    await api(
      `/requests/approve/${requestId}`,
      "POST",
      { approve: true },
      getToken()!,
    );
    fetchRequests();
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
