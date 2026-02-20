"use client";

import { motion } from "framer-motion";

const nodes = [
  [200, 100],
  [500, 300],
  [900, 180],
  [300, 450],
  [700, 450],
];

const links = [
  [200, 100, 500, 300],
  [500, 300, 900, 180],
  [300, 450, 500, 300],
  [700, 450, 900, 180],
];

export default function NetworkBackground() {
  return (
    <motion.svg
      className="absolute inset-0 h-full w-full opacity-[0.3]"
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Animated links */}
      <g stroke="url(#grad)" strokeWidth="1">
        {links.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeDasharray="6 10"
            animate={{
              strokeDashoffset: [0, -32],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.4,
            }}
          />
        ))}
      </g>

      {/* Animated nodes */}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="6"
          fill="url(#grad)"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Soft floating glow */}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={`glow-${i}`}
          cx={x}
          cy={y}
          r="18"
          fill="url(#grad)"
          opacity="0.1"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
