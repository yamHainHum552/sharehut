"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const COOKIE_KEY = "sharehut_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);

    // 👉 If you add analytics later,
    // load scripts here conditionally.
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white shadow-lg border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-neutral-300">
          <p>
            We use cookies to enhance your experience, improve performance, and
            ensure secure authentication on ShareHut.
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            By clicking "Accept", you agree to our use of cookies.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="danger"
            className="border-neutral-500 text-white hover:bg-neutral-800"
            onClick={handleReject}
          >
            Reject
          </Button>

          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 "
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
