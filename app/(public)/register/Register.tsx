"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError("");
    setLoading(true);

    try {
      await api("/auth/register", "POST", {
        name,
        email,
        password,
      });

      // If backend auto-logs in and sets cookie:
      router.refresh(); // 🔥 refresh server layout
      router.push("/dashboard");

      // If backend does NOT auto-login:
      // router.push("/login");
    } catch (err: any) {
      setError(err?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const googleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
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
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Start sharing instantly with ShareHut
          </p>

          <div className="mt-6 space-y-4">
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" onClick={register} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-xs text-neutral-500">OR</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={googleRegister}
            >
              Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
