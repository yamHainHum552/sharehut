"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import DataTable from "@/components/admin/DataTable";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = () => {
    adminApi("/users").then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${selectedUser.id}/ban`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );

    setSelectedUser(null);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "is_banned", label: "Banned" },
        ]}
        data={users}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedUser(row)}
            className="px-3 py-1 text-xs bg-red-600 rounded-lg"
          >
            {row.is_banned ? "Unban" : "Ban"}
          </button>
        )}
      />

      <ConfirmModal
        open={!!selectedUser}
        title="Confirm Action"
        description={`Are you sure you want to ${
          selectedUser?.is_banned ? "unban" : "ban"
        } this user?`}
        onCancel={() => setSelectedUser(null)}
        onConfirm={toggleBan}
      />
    </div>
  );
}
