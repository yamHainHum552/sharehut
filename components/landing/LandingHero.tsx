"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./fadeUp";
import NetworkBackground from "./NetworkBackground";

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
      <NetworkBackground />

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
    </section>
  );
}
