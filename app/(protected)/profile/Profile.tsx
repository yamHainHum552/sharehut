"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { getToken, logout } from "@/lib/auth";

type User = {
  id: string;
  email: string;
  plan: string;
  status: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api("/auth/me", "GET", undefined, getToken()!);
        setUser(res);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Card>
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-neutral-800 rounded" />
            <div className="h-4 w-1/2 bg-neutral-800 rounded" />
            <div className="h-4 w-2/3 bg-neutral-800 rounded" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-red-500">
        {error || "Unauthorized"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-neutral-400">
          Manage your account settings, security, and preferences.
        </p>
      </header>

      {/* Account Info */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Account Information
        </h2>

        <div className="space-y-4">
          <Info label="Email" value={user.email} />
          <Info
            label="Account Type"
            value={user.plan === "pro" ? "Pro User" : "Free User"}
          />
          <div>
            <p className="text-sm text-neutral-500">Account Status</p>
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
              {user.status}
            </span>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Security</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-200">Password</p>
              <p className="text-sm text-neutral-500">
                Managed securely via authentication
              </p>
            </div>

            <Button variant="secondary">Change Password</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-red-400">Danger Zone</h2>

        <p className="mb-4 text-sm text-neutral-400">
          Logging out will end your current session on this device.
        </p>

        <Button variant="danger" className="w-full" onClick={logout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}

/* Small helper component */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-200">{value}</p>
    </div>
  );
}
