"use client";

import { useMemo } from "react";

interface Props {
  password: string;
}

export default function PasswordStrength({ password }: Props) {
  const checks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password),
    };
  }, [password]);

  const passedCount = Object.values(checks).filter(Boolean).length;

  const strength =
    passedCount <= 2 ? "Weak" : passedCount <= 4 ? "Medium" : "Strong";

  const strengthColor =
    strength === "Weak"
      ? "bg-red-500"
      : strength === "Medium"
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="space-y-2 text-sm">
      {/* Strength bar */}
      <div className="h-2 w-full bg-neutral-800 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${strengthColor}`}
          style={{ width: `${(passedCount / 5) * 100}%` }}
        />
      </div>

      <p className="text-neutral-400">
        Strength:{" "}
        <span
          className={
            strength === "Weak"
              ? "text-red-500"
              : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
          }
        >
          {strength}
        </span>
      </p>

      <ul className="text-xs text-neutral-500 space-y-1">
        <li className={checks.length ? "text-green-500" : ""}>
          • At least 8 characters
        </li>
        <li className={checks.uppercase ? "text-green-500" : ""}>
          • One uppercase letter
        </li>
        <li className={checks.lowercase ? "text-green-500" : ""}>
          • One lowercase letter
        </li>
        <li className={checks.number ? "text-green-500" : ""}>• One number</li>
        <li className={checks.special ? "text-green-500" : ""}>
          • One special character
        </li>
      </ul>
    </div>
  );
}
