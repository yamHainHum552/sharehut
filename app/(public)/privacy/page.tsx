import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the ShareHut Live Privacy Policy to understand how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://sharehutlive.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-neutral-400">
            Effective Date: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            ShareHut Live ("we", "our", or "us") respects your privacy. This
            Privacy Policy explains how we collect, use, and protect your
            information when you use our real-time text collaboration platform.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            1. Information We Collect
          </h2>

          <p>We may collect the following information:</p>

          <ul className="list-disc list-inside space-y-2">
            <li>Account information (name, email address)</li>
            <li>Authentication data (JWT tokens, OAuth data)</li>
            <li>Room participation data (room IDs, membership status)</li>
            <li>Text content shared within rooms</li>
            <li>Basic technical data (IP address, browser type)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white">
            2. How We Use Information
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>To provide secure authentication</li>
            <li>To enable real-time collaboration</li>
            <li>To prevent abuse and enforce rate limits</li>
            <li>To improve platform stability and security</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white">3. Guest Rooms</h2>

          <p>
            Guest rooms are temporary and may expire automatically. Guest users
            may have limited functionality and content may not be retained
            permanently.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            4. Data Retention
          </h2>

          <p>
            We retain account data as long as necessary to provide our services.
            Expired guest rooms are automatically deleted.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            5. Data Security
          </h2>

          <p>
            All communication is transmitted over encrypted HTTPS connections.
            We implement JWT-based authentication and server-side validation to
            protect against unauthorized access.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            6. Third-Party Services
          </h2>

          <p>
            We may use third-party authentication providers such as Google
            OAuth. These providers have their own privacy policies.
          </p>

          <h2 className="text-2xl font-semibold text-white">7. Your Rights</h2>

          <p>
            You may request deletion of your account or personal data by
            contacting us.
          </p>

          <h2 className="text-2xl font-semibold text-white">
            8. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time. Continued use
            of ShareHut Live means you accept the updated policy.
          </p>

          <h2 className="text-2xl font-semibold text-white">9. Contact</h2>

          <p>
            For privacy-related inquiries, contact us at:
            <br />
            <span className="text-purple-400">sharehutlive@gmail.com</span>
          </p>
        </section>
      </div>
    </main>
  );
}
