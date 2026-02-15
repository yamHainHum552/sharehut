"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { logout } from "@/lib/auth-client";

type User = {
  email: string;
  status: string;
  provider?: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api("/auth/me", "GET");
        setUser(res);
      } catch {
        setError("Failed to load profile.");
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
    <div className="mx-auto max-w-2xl px-6 py-12 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="mt-2 text-neutral-400">
          Manage your account, security, and preferences.
        </p>
      </header>

      {/* Account Overview */}
      <Card>
        <h2 className="mb-6 text-lg font-semibold text-white">
          Account Overview
        </h2>

        <div className="space-y-5">
          <Info label="Email Address" value={user.email} />
          <Info
            label="Authentication Method"
            value={
              user.provider === "google" ? "Google Sign-In" : "Email & Password"
            }
          />
          <Info label="Account Status" value={user.status} />
        </div>
      </Card>

      {/* Security Section */}
      <Card>
        <h2 className="mb-6 text-lg font-semibold text-white">Security</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-200">Active Session</p>
              <p className="text-sm text-neutral-500">
                This device is currently authenticated.
              </p>
            </div>

            <span className="text-sm text-green-400 font-medium">Active</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="mb-6 text-lg font-semibold text-red-400">Danger Zone</h2>

        <div className="space-y-4">
          <Button variant="danger" className="w-full" onClick={logout}>
            Logout
          </Button>

          <Button
            variant="secondary"
            className="w-full opacity-50 cursor-not-allowed"
            disabled
          >
            Delete Account (Coming Soon)
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-200">{value}</p>
    </div>
  );
}
