"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Full-Stack Developer",
    text: "ShareHut feels instant. The real-time sync is smooth and the expiring rooms are perfect for focused collaboration sessions.",
    initials: "AS",
  },
  {
    name: "Emily Carter",
    role: "Product Manager",
    text: "We use ShareHut during sprint planning. No friction. No setup. Just create, share, and collaborate.",
    initials: "EC",
  },
  {
    name: "Rohan Mehta",
    role: "CS Student",
    text: "Guest rooms are brilliant. I can instantly share snippets during labs without forcing signups.",
    initials: "RM",
  },
];

export default function PremiumTestimonials() {
  return (
    <section className="relative py-28 bg-black overflow-hidden">
      {/* Soft Radial Glow Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.15),transparent_60%)]" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Loved by Teams Who Build Fast
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
            Real-time collaboration without complexity. Built for developers,
            teams, and students.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:scale-[1.03] transition-all duration-500"
            >
              <div className="bg-neutral-900 rounded-2xl p-8 h-full relative overflow-hidden">
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-40 pointer-events-none" />

                {/* Live Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-green-400 flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live Collaboration
                  </span>
                  <Quote className="text-blue-500/30 w-6 h-6" />
                </div>

                {/* Testimonial Text */}
                <p className="text-neutral-300 leading-relaxed mb-8 text-sm md:text-base">
                  “{t.text}”
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold shadow-lg">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {t.name}
                    </div>
                    <div className="text-neutral-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
