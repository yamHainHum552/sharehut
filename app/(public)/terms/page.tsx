import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ShareHut",

  description:
    "Review the Terms of Service for using ShareHut, including policies for real-time collaboration rooms, file sharing, online whiteboard usage, and account responsibilities.",

  keywords: [
    "ShareHut terms",
    "collaboration platform terms",
    "real-time collaboration policy",
    "file sharing terms",
    "online whiteboard terms of service",
  ],

  alternates: {
    canonical: "https://sharehutlive.com/terms",
  },

  openGraph: {
    title: "Terms of Service — ShareHut",
    description:
      "Understand the terms governing the use of ShareHut’s real-time collaboration platform.",
    url: "https://sharehutlive.com/terms",
    siteName: "ShareHut",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Terms of Service — ShareHut",
    description:
      "Review the rules and policies for using ShareHut collaboration rooms.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-neutral-400">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            By accessing or using ShareHut, you agree to these Terms of Service.
            If you do not agree, please do not use the platform.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            1. Use of Service
          </h2>

          <p>
            ShareHut provides real-time collaboration through secure rooms
            supporting live text editing, file sharing, and online whiteboard
            drawing. You agree to use the service lawfully and responsibly.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            2. Account Responsibility
          </h2>

          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activity that occurs under your
            account.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            3. Prohibited Conduct
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>Unauthorized access attempts</li>
            <li>Spamming, abuse, or harassment</li>
            <li>Sharing harmful, malicious, or illegal content</li>
            <li>Uploading malicious files</li>
            <li>Attempting to disrupt system integrity or security</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white">
            4. Room Ownership & Content
          </h2>

          <p>
            Room owners control membership, permissions, and settings within
            their collaboration rooms. ShareHut does not actively monitor
            private room content but reserves the right to act upon reported
            violations.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            5. Data & Content Responsibility
          </h2>

          <p>
            Users are responsible for the content they share, including text,
            uploaded files, and whiteboard drawings. ShareHut is not liable for
            user-generated content.
          </p>

          <h2 className="text-2xl font-semibold text-white">6. Termination</h2>

          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms or engage in abusive or unlawful behavior.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            7. Limitation of Liability
          </h2>

          <p>
            ShareHut is provided "as is" without warranties of any kind. We are
            not liable for data loss, interruptions, unauthorized access, or
            damages arising from service use.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            8. Changes to Terms
          </h2>

          <p>
            We may update these terms periodically. Continued use of the service
            after changes are published constitutes acceptance of the updated
            terms.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            9. Governing Law
          </h2>

          <p>
            These terms are governed by applicable laws in your jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold text-white">10. Contact</h2>

          <p>
            For legal inquiries:
            <br />
            <span className="text-purple-400">sharehutlive@gmail.com</span>
          </p>
        </section>
      </div>
    </main>
  );
}
