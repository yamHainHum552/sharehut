"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // ✅ Verify token if exists
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      setStatus("loading");

      try {
        await api(`/auth/verify-email?token=${token}`, "GET");

        setStatus("success");
        setMessage("Your email has been verified successfully.");

        // Auto redirect
        const interval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              router.replace("/login"); // 🔥 Replace instead of push
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.error || "Invalid or expired verification link.");
      }
    };

    verify();
  }, [token, router]);

  // ✅ Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ✅ Resend function
  const resend = async () => {
    if (!emailInput) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setResending(true);

      await api("/auth/resend-verification", "POST", {
        email: emailInput,
      });

      setMessage("Verification email resent successfully.");
      setCooldown(30); // 🔥 30s cooldown
    } catch (err: any) {
      setMessage(err?.error || "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="text-center space-y-5">
          {/* 🔹 No token (after registration) */}
          {!token && (
            <>
              <h2 className="text-2xl font-bold">Verify Your Email</h2>
              <p className="text-neutral-400">
                We’ve sent a verification link to your email.
              </p>

              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />

              <Button
                variant="secondary"
                onClick={resend}
                disabled={resending || cooldown > 0}
              >
                {resending
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend Email"}
              </Button>

              {message && <p className="text-sm text-neutral-400">{message}</p>}
            </>
          )}

          {/* 🔹 Loading */}
          {status === "loading" && (
            <>
              <h2 className="text-2xl font-bold">Verifying...</h2>
              <p className="text-neutral-400">
                Please wait while we verify your email.
              </p>
            </>
          )}

          {/* 🔹 Success */}
          {status === "success" && (
            <>
              <h2 className="text-2xl font-bold text-green-500">
                Email Verified 🎉
              </h2>

              <p className="text-neutral-400">{message}</p>

              <p className="text-sm text-neutral-500">
                Redirecting to login in {redirectCountdown}s...
              </p>

              <Button onClick={() => router.replace("/login")}>
                Continue Now
              </Button>
            </>
          )}

          {/* 🔹 Error */}
          {status === "error" && (
            <>
              <h2 className="text-2xl font-bold text-red-500">
                Verification Failed
              </h2>

              <p className="text-neutral-400">{message}</p>

              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />

              <Button
                variant="secondary"
                onClick={resend}
                disabled={resending || cooldown > 0}
              >
                {resending
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend Email"}
              </Button>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
