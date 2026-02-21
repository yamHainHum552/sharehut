import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Real-Time Collaboration Services
        </h1>

        <p className="mx-auto max-w-3xl text-neutral-400 text-lg">
          ShareHut delivers secure collaboration rooms for live text editing,
          file sharing, and online whiteboard drawing — built for speed,
          privacy, and seamless teamwork.
        </p>
      </section>

      {/* Core Services */}
      <section>
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Core Collaboration Features
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold">Real-Time Text Editing</h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Collaborate instantly with live text synchronization. Every update
              appears in real time for all connected participants, ensuring
              smooth and responsive teamwork.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Secure File Sharing</h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Upload and share files directly within collaboration rooms.
              Maintain privacy while distributing important documents and
              resources securely.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Online Whiteboard Drawing</h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Draw, sketch, and brainstorm together using our built-in
              whiteboard. All strokes sync instantly across participants.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">
              Private Collaboration Rooms
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Create private rooms with unique codes and controlled access. Keep
              discussions secure with host-managed entry approval.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">
              Join Request & Access Control
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Approve or reject join requests. Lock rooms, enable read-only
              mode, and manage participation dynamically.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Secure Authentication</h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Sign in using email/password or Google OAuth. JWT-based
              authentication ensures session integrity and secure access.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">
              High Performance Infrastructure
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Built on modern real-time architecture for low latency, stable
              connections, and reliable synchronization.
            </p>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">
          Built for Teams, Classrooms & Remote Work
        </h2>

        <p className="max-w-3xl mx-auto text-neutral-400 leading-relaxed">
          Whether you're hosting a remote meeting, running an online class,
          brainstorming ideas, or collaborating on documents, ShareHut provides
          a lightweight yet powerful real-time collaboration platform.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-8">
        <h2 className="text-3xl font-bold">Start Collaborating Instantly</h2>

        <p className="text-neutral-400">
          Create a secure room and begin sharing text, files, or drawings in
          seconds.
        </p>

        <div className="flex justify-center">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
