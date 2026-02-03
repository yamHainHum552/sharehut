"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError("");
    setLoading(true);
    const res = await api("/auth/register", "POST", {
      name,
      email,
      password,
    });

    if (!res.error) {
      window.location.href = "/login";
    } else {
      setError(res.error || "Registration failed");
    }
    setLoading(false);
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

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" onClick={register}>
              {loading ? "Creating Account..." : "Create Account"}
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
