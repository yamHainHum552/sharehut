"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp } from "./fadeUp";

export default function FooterCTA() {
  return (
    <section className="border-t border-neutral-800 py-16 text-center">
      <motion.h3
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-bold"
      >
        Start Sharing in Seconds
      </motion.h3>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.2}
        className="mt-6"
      >
        <Link
          href="/register"
          className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-10 py-4 text-lg font-semibold transition hover:opacity-90"
        >
          Create Your First Room
        </Link>
      </motion.div>
    </section>
  );
}
