"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Button from "../ui/Button";
import { isLoggedIn, logout } from "@/lib/auth";

/* ---------------- CONFIG ---------------- */

const PUBLIC_LINKS = [
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faqs" },
];

const AUTH_LINKS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Rooms", href: "/myrooms" },
  { name: "Profile", href: "/profile" },
];

/* ---------------- ANIMATIONS ---------------- */

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      duration: 0.28,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25 },
  },
  exit: { opacity: 0, x: -16 },
};

/* ---------------- COMPONENT ---------------- */

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const bodyOverflowRef = useRef("");

  /* Sync auth */
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setAuthReady(true);
  }, []);

  /* Lock body scroll safely */
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

  /* Close on ESC */
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setMobileOpen(false);
  };

  const LINKS = loggedIn ? AUTH_LINKS : PUBLIC_LINKS;

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          ShareHut
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-neutral-400 hover:text-white transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!authReady ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-800" />
          ) : !loggedIn ? (
            <>
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="md:hidden p-2 text-2xl text-neutral-300 hover:text-white"
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
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
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
                w-[85%] max-w-sm
                bg-neutral-950 bg-gradient-to-b from-neutral-950 to-neutral-900
                border-l border-neutral-800
                p-6
                shadow-2xl
                flex flex-col
              "
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-semibold tracking-widest text-neutral-400">
                  NAVIGATION
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Nav Links */}
              <motion.nav
                className="
                  flex flex-col gap-5
                  rounded-2xl
                  bg-neutral-900/95
                  p-4
                  ring-1 ring-neutral-800
                "
              >
                {LINKS.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="
                        block rounded-lg px-3 py-2
                        text-xl font-medium
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

              {/* Auth Section */}
              <div className="mt-auto pt-8 border-t border-neutral-800">
                {!authReady ? null : !loggedIn ? (
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-4"
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="secondary"
                        className="w-full py-4 text-lg"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full py-4 text-lg">
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                    <Button
                      variant="danger"
                      className="w-full py-4 text-lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
