import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the Terms of Service for using ShareHut Live.",
  alternates: {
    canonical: "https://sharehutlive.com/terms",
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
            By accessing or using ShareHut Live, you agree to these Terms of
            Service. If you do not agree, please do not use the platform.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            1. Use of Service
          </h2>

          <p>
            ShareHut Live provides real-time text collaboration through private
            rooms. You agree to use the service lawfully.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            2. Account Responsibility
          </h2>

          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and all activity under your account.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            3. Prohibited Conduct
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>Unauthorized access attempts</li>
            <li>Spamming or abuse</li>
            <li>Sharing harmful or illegal content</li>
            <li>Attempting to disrupt system integrity</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white">
            4. Room Ownership
          </h2>

          <p>
            Room owners control membership and settings. ShareHut Live does not
            moderate content in private rooms.
          </p>

          <h2 className="text-2xl font-semibold text-white">5. Termination</h2>

          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            6. Limitation of Liability
          </h2>

          <p>
            ShareHut Live is provided "as is" without warranties. We are not
            liable for data loss, interruptions, or damages arising from service
            use.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            7. Changes to Terms
          </h2>

          <p>
            We may update these terms periodically. Continued use of the service
            constitutes acceptance.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            8. Governing Law
          </h2>

          <p>
            These terms are governed by applicable laws in your jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold text-white">9. Contact</h2>

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
