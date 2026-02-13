"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
} & HTMLMotionProps<"button">;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "rounded-xl font-semibold transition",
        // Size styles
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-sm": size === "md",
          "px-8 py-4 text-base": size === "lg",
        },
        // Variant styles
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
