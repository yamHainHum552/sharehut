"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Variants } from "framer-motion";
import { useRouter } from "next/navigation";

import Button from "../ui/Button";
import { logout } from "@/lib/auth-client";

/* ---------------- CONFIG ---------------- */

const PUBLIC_LINKS = [
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
];

const AUTH_LINKS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Rooms", href: "/myrooms" },
  { name: "Profile", href: "/profile" },
];

/* ---------------- ANIMATIONS ---------------- */

const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1], // cubic-bezier (professional)
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ---------------- COMPONENT ---------------- */

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  const [mobileOpen, setMobileOpen] = useState(false);
  const LINKS = loggedIn ? AUTH_LINKS : PUBLIC_LINKS;

  const router = useRouter();

  const bodyOverflowRef = useRef("");

  /* Sync auth */

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

  const handleLogout = async () => {
    await logout();
    router.refresh(); // 🔥 re-fetch server layout
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800/70 bg-neutral-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <span>ShareHut</span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-400 hover:text-white transition"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="md:hidden rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
        >
          ☰
        </button>
      </div>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.aside
              id="mobile-nav"
              className="
                fixed inset-y-0 right-0 z-50
                w-[88%] max-w-sm
                bg-neutral-950
                border-l border-neutral-800
                p-6
                shadow-2xl
                flex flex-col
              "
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Nav Links */}
              <motion.nav
                className="
                  flex flex-col gap-1
                  rounded-xl
                  bg-neutral-900
                  p-2
                  ring-1 ring-neutral-800
                "
              >
                {LINKS.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="
                        block rounded-lg px-4 py-3
                        text-base font-medium
                        text-neutral-200
                        hover:bg-neutral-800 hover:text-white
                        transition
                      "
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Auth */}
              <div className="mt-auto pt-8 border-t border-neutral-800">
                {!loggedIn ? (
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="secondary"
                        className="w-full py-4 text-base"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full py-4 text-base">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    className="w-full py-4 text-base"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
