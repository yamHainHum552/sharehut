"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

/* ---------------- CONFIG ---------------- */

const PUBLIC_LINKS = [
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms Of Service", href: "/terms" },
];

const AUTH_LINKS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Rooms", href: "/myrooms" },
  { name: "Profile", href: "/profile" },
];

const NAVBAR_HEIGHT = 72;

/* ---------------- COMPONENT ---------------- */

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loggedIn] = useState(isLoggedIn);
  const [mobileOpen, setMobileOpen] = useState(false);
  const LINKS = loggedIn ? AUTH_LINKS : PUBLIC_LINKS;

  const bodyOverflowRef = useRef("");

  /* Lock body scroll */
  useEffect(() => {
    if (mobileOpen) {
      bodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = bodyOverflowRef.current || "";
    }

    return () => {
      document.body.style.overflow = bodyOverflowRef.current || "";
    };
  }, [mobileOpen]);

  /* ESC close */
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      {/* ---------------- NAVBAR ---------------- */}
      <nav
        className="
          sticky top-0 z-50
          border-b border-neutral-800/60
          bg-neutral-950/70 backdrop-blur-xl
          shadow-[0_2px_20px_rgba(0,0,0,0.4)]
        "
        style={{ height: NAVBAR_HEIGHT }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              ShareHut
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="
                  relative text-sm font-medium text-neutral-400
                  hover:text-white transition
                "
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!loggedIn && (
              <>
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              md:hidden rounded-lg p-2
              text-neutral-300
              hover:bg-neutral-800 hover:text-white
              transition
            "
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
              style={{ top: NAVBAR_HEIGHT }}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.aside
              className="
                fixed right-0 bottom-0 z-[60]
                w-[90%] max-w-sm
                bg-neutral-950
                border-l border-neutral-800
                p-6
                shadow-2xl
                flex flex-col
              "
              style={{ top: NAVBAR_HEIGHT }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Close */}
              <div className="mb-8 flex justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-neutral-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-2">
                {LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      rounded-lg px-4 py-3
                      text-base font-medium
                      text-neutral-200
                      hover:bg-neutral-800 hover:text-white
                      transition
                    "
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Auth */}
              <div className="mt-auto pt-8 border-t border-neutral-800">
                {!loggedIn && (
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" className="w-full py-4">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full py-4">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
