import type { Metadata } from "next";
import { motion } from "framer-motion";

// export const metadata: Metadata = {
//   title: "About ShareHut | Secure Real-Time Text Sharing",
//   description:
//     "Learn about ShareHut, a secure real-time text sharing platform designed for private collaboration.",
// };

export default function AboutPage() {
  return (
    <main className="bg-neutral-950 text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Built for Secure, Real-Time Collaboration
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
          ShareHut enables private room-based text collaboration with instant
          synchronization, secure access control, and lightweight architecture.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-neutral-400 leading-relaxed">
            Our mission is to build a fast, secure, and distraction-free
            collaboration platform. ShareHut prioritizes privacy and performance
            while keeping the experience simple and intuitive.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-14">Core Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time Sync",
              desc: "Instant text synchronization powered by WebSockets.",
            },
            {
              title: "Room-Based Access",
              desc: "Unique room codes with controlled membership.",
            },
            {
              title: "Secure Authentication",
              desc: "JWT-based access with strict server-side validation.",
            },
            {
              title: "Join Approvals",
              desc: "Owners approve participants for controlled collaboration.",
            },
            {
              title: "Rate Limiting",
              desc: "Built-in abuse prevention and request throttling.",
            },
            {
              title: "Scalable Architecture",
              desc: "Cloud-hosted backend designed for growth.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-purple-500/50 transition"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="max-w-5xl mx-auto px-6 pb-32 text-center">
        <h2 className="text-3xl font-bold mb-6">Who is ShareHut for?</h2>
        <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          Students, developers, teams, and anyone who needs secure, lightweight
          text collaboration without heavy project management overhead.
        </p>
      </section>
    </main>
  );
}
