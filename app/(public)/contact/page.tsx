"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setSuccess(false);

    try {
      // 🔥 Later connect to backend endpoint
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>

          <p className="mt-4 text-neutral-400 leading-relaxed">
            Have questions about ShareHut? Want to report an issue or suggest a
            feature? We'd love to hear from you.
          </p>

          <div className="mt-10 space-y-6 text-neutral-400">
            <div>
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                Email
              </p>
              <p className="mt-1 text-lg text-white">support@sharehut.app</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-neutral-500">
                Response Time
              </p>
              <p className="mt-1 text-lg text-white">Within 24 hours</p>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full p-4 rounded-lg bg-neutral-900 border border-neutral-800 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              />

              <Button
                type="submit"
                className="w-full py-4 text-base"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

              {success && (
                <p className="text-green-400 text-sm text-center">
                  Message sent successfully 🎉
                </p>
              )}
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
