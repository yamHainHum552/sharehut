"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fadeUp } from "./fadeUp";
import NetworkBackground from "./NetworkBackground";
import Button from "@/components/ui/Button";

export default function LandingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
      <NetworkBackground />

      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-5xl md:text-7xl font-extrabold leading-tight"
      >
        Share Text & Code
        <br />
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Instantly. Securely.
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="relative z-10 mt-6 max-w-2xl text-lg text-neutral-400"
      >
        Create private rooms, approve participants, and collaborate in
        real-time. No friction. No noise. Just instant sharing.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
        className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Button size="lg" onClick={() => router.push("/share")}>
          Start Sharing
        </Button>

        {isLoggedIn ? (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/login")}
          >
            Sign In
          </Button>
        )}
      </motion.div>

      {/* Micro trust line */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
        className="relative z-10 mt-6 text-sm text-neutral-500"
      >
        No signup required for temporary rooms.
      </motion.p>
    </section>
  );
}
