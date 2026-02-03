import { motion } from "framer-motion";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
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
    >
      {children}
    </motion.button>
  );
}
