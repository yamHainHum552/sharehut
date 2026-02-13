"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const name = formData.get("from_name");
    const email = formData.get("user_email");
    const subject = formData.get("subject");
    const body = formData.get("message");

    if (!name || !email || !subject || !body) {
      setStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setStatus("sending");
      setMessage("");

      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        formRef.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        },
      );

      setStatus("success");
      setMessage("Your message has been sent successfully.");
      formRef.current.reset();
    } catch {
      setStatus("error");
      setMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Contact ShareHut
          </h1>
          <p className="text-neutral-400">
            Have questions, suggestions, or feedback? Send us a message.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
          <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm text-neutral-400">Full Name</label>
                <input
                  type="text"
                  name="from_name"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-neutral-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="How can we help?"
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-neutral-400">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Write your message here..."
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              />
            </div>

            {/* Status Message */}
            {status !== "idle" && (
              <div
                className={`rounded-lg px-4 py-2 text-sm ${
                  status === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : status === "error"
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                }`}
              >
                {status === "sending" ? "Sending your message..." : message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Simple footer note */}
        <p className="text-xs text-neutral-500 text-center">
          We typically respond within 24 hours.
        </p>
      </div>
    </section>
  );
}
