"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { fadeUp } from "./fadeUp";
import NetworkBackground from "./NetworkBackground";
import Button from "@/components/ui/Button";
import DemoPreview from "./DemoPreview";

export default function LandingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
      <NetworkBackground />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        {/* LEFT SIDE — TEXT */}
        <div className="text-center lg:text-left">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Share Text & Code
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Instantly. Securely.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-neutral-400"
          >
            Create private rooms, approve participants, and collaborate in
            real-time. No friction. No noise. Just instant sharing.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => router.push("/share")}
            >
              Start Sharing
            </Button>

            {isLoggedIn ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            )}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="mt-6 text-xs sm:text-sm text-neutral-500"
          >
            No signup required for temporary rooms.
          </motion.p>
        </div>

        {/* RIGHT SIDE — DEMO PREVIEW */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="block lg:block"
        >
          <div className="mt-12 lg:mt-0 max-w-md sm:max-w-lg lg:max-w-none mx-auto">
            <DemoPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
