"use client";
import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="mx-auto max-w-3xl text-neutral-400">
          ShareHut provides secure, real-time collaboration services designed
          for privacy, speed, and simplicity — whether you’re working solo or
          with a team.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold">Real-Time Text Sharing</h2>
          <p className="mt-2 text-neutral-400">
            Collaborate instantly with live text synchronization. Every update
            is reflected in real time across all connected participants.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Private Collaboration Rooms</h2>
          <p className="mt-2 text-neutral-400">
            Create private rooms with unique codes. Control who joins and keep
            sensitive discussions secure.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Join Request Management</h2>
          <p className="mt-2 text-neutral-400">
            Approve or reject join requests with full control. Ideal for
            moderated collaboration and hosted sessions.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Role-Based Access</h2>
          <p className="mt-2 text-neutral-400">
            Owners and participants have clearly defined roles, ensuring proper
            permissions and structured collaboration.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Secure Authentication</h2>
          <p className="mt-2 text-neutral-400">
            Login securely using email/password or Google OAuth, backed by
            JWT-based authentication.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">
            High Availability & Performance
          </h2>
          <p className="mt-2 text-neutral-400">
            Built on modern infrastructure for fast response times, stable
            connections, and reliable real-time updates.
          </p>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Start Collaborating Instantly</h2>
        <p className="text-neutral-400">
          Experience fast, secure, and private collaboration with ShareHut.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => (window.location.href = "/register")}>
            Get Started
          </Button>
        </div>
      </section>
    </main>
  );
}
