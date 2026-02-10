"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
} & HTMLMotionProps<"button">;

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "rounded-xl px-6 py-3 text-sm font-semibold transition",
        {
          "bg-white text-black hover:bg-neutral-200": variant === "primary",
          "border border-neutral-700 hover:border-neutral-500":
            variant === "secondary",
          "bg-red-600 hover:bg-red-700 text-white": variant === "danger",
        },
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
