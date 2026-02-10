import React from "react";
import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx(
        "rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
