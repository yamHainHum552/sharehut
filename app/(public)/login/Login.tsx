"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    const res = await api("/auth/login", "POST", { email, password });

    if (res.token) {
      setToken(res.token);
      window.location.href = "/dashboard";
    } else {
      setError(res.error || "Login failed");
    }
  };

  const googleLogin = () => {
    // Backend OAuth endpoint
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Login to continue to ShareHut
          </p>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" onClick={login}>
              Login
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-xs text-neutral-500">OR</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            {/* Google OAuth */}
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-3"
              onClick={googleLogin}
            >
              <span className="text-lg">🔒</span>
              Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-sm text-neutral-400">
            Don’t have an account?{" "}
            <Link href="/register" className="text-white underline">
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
