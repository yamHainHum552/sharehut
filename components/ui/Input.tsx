import React from "react";

type InputProps = {
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm outline-none ring-1 ring-neutral-800 focus:ring-2 focus:ring-purple-500 ${className ?? ""}`}
    />
  );
}
