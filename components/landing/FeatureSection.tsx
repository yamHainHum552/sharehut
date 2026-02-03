"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./fadeUp";

const features = [
  {
    title: "Real-Time Sync",
    description:
      "See text and code updates instantly across all participants with low-latency WebSockets.",
  },
  {
    title: "Private Rooms",
    description:
      "Room owners control access. No one joins without your approval.",
  },
  {
    title: "Developer-Friendly",
    description:
      "Share plain text, code snippets, JSON, or configs in a clean editor.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center text-4xl font-bold"
      >
        Built for Focused Collaboration
      </motion.h2>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.15}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8"
          >
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-3 text-neutral-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
