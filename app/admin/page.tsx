"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import StatsCard from "@/components/admin/StatsCard";
import ChartCard from "@/components/admin/ChartCard";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    adminApi("/stats").then(setStats);
    adminApi("/metrics").then(setMetrics);
  }, []);

  if (!stats || !metrics) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Total Rooms" value={stats.totalRooms} />
        <StatsCard title="Active Rooms" value={stats.activeRooms} />
        <StatsCard title="Guest Rooms" value={stats.guestRooms} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="User Growth" data={metrics.usersGrowth} />
        <ChartCard title="Room Growth" data={metrics.roomsGrowth} />
      </div>
    </div>
  );
}
