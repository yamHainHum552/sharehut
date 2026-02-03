import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShareHut | Secure Real-Time Text Sharing",
  description:
    "Learn about ShareHut, a secure real-time text sharing platform designed for private collaboration, fast synchronization, and user-controlled access.",
  keywords: [
    "ShareHut",
    "real-time text sharing",
    "secure collaboration",
    "websocket collaboration",
    "private rooms",
    "live text sync",
  ],
  authors: [{ name: "ShareHut Team" }],
  openGraph: {
    title: "About ShareHut",
    description:
      "ShareHut is a secure, real-time text sharing platform built for private, controlled collaboration.",
    url: "https://sharehut-two.vercel.app/about",
    siteName: "ShareHut",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">About ShareHut</h1>

      <p className="text-lg text-gray-600 mb-8">
        ShareHut is a secure, real-time text sharing platform designed to make
        collaboration simple, fast, and controlled. It enables users to create
        private rooms where text can be shared and synchronized instantly among
        authorized participants.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to provide a lightweight yet reliable collaboration
          tool that prioritizes privacy, security, and real-time performance.
          ShareHut removes unnecessary complexity so users can focus on sharing
          ideas without friction.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Real-time text synchronization using WebSockets</li>
          <li>Room-based collaboration with unique room codes</li>
          <li>Join request approval for controlled access</li>
          <li>JWT-based secure authentication</li>
          <li>Rate limiting and abuse prevention</li>
          <li>Cloud-hosted and scalable architecture</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Who is ShareHut for?</h2>
        <p className="text-gray-700 leading-relaxed">
          ShareHut is ideal for students, small teams, developers, and anyone
          who needs fast and secure text collaboration without the overhead of
          complex tools.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
        <p className="text-gray-700 leading-relaxed">
          ShareHut is built with privacy in mind. Only authorized users can
          access rooms, and all communication takes place over encrypted
          connections. No unnecessary personal data is collected.
        </p>
      </section>
    </main>
  );
}
