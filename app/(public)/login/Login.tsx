"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BACKEND_URL } from "@/config/constants";
import { refreshSocketAuth } from "@/lib/socketAuth";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api("/auth/login", "POST", { email, password });
      console.log(res);

      if (res.success) {
        refreshSocketAuth();
        window.location.href = "/dashboard";
      } else {
        setError(res.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
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

          {/* ✅ FORM */}
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-xs text-neutral-500">OR</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            {/* Google OAuth */}
            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-3"
              onClick={googleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5 mr-2"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.6 3.1 29.6 1 24 1 14.7 1 6.6 6.9 3.1 15.1l7 5.4C11.6 13.5 17.2 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.1-2.3 5.7-4.8 7.5l7 5.4c4.1-3.8 6.6-9.4 6.6-17.4z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.1 28.3c-.8-2.4-1.3-4.9-1.3-7.3s.5-4.9 1.3-7.3l-7-5.4C1.5 12.5 0 17.1 0 21.9s1.5 9.4 4.1 13.6l6-4.8z"
                />
                <path
                  fill="#4285F4"
                  d="M24 47c6.5 0 12-2.1 16-5.8l-7-5.4c-2 1.4-4.6 2.2-9 2.2-6.8 0-12.4-4-14.9-9.7l-7 5.4C6.6 41.1 14.7 47 24 47z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

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
