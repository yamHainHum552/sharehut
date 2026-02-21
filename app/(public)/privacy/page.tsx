import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ShareHut",

  description:
    "Read the ShareHut Privacy Policy to understand how we collect, use, and protect information within our real-time collaboration rooms for text editing, file sharing, and online whiteboard sessions.",

  keywords: [
    "ShareHut privacy policy",
    "real-time collaboration privacy",
    "secure collaboration platform",
    "data protection policy",
    "online whiteboard privacy",
  ],

  openGraph: {
    title: "Privacy Policy — ShareHut",
    description:
      "Learn how ShareHut protects your data across secure collaboration rooms and real-time sharing sessions.",
    url: "https://sharehutlive.com/privacy",
    siteName: "ShareHut",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy — ShareHut",
    description:
      "Understand how ShareHut protects user data within secure collaboration rooms.",
  },

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
            ShareHut ("we", "our", or "us") respects your privacy. This Privacy
            Policy explains how we collect, use, and protect your information
            when you use our real-time collaboration platform for text editing,
            file sharing, and online whiteboard drawing.
          </p>

          {/* 1 */}
          <h2 className="text-2xl font-semibold text-white">
            1. Information We Collect
          </h2>

          <p>We may collect the following information:</p>

          <ul className="list-disc list-inside space-y-2">
            <li>Account information (name, email address)</li>
            <li>Authentication data (JWT tokens, OAuth data)</li>
            <li>Room participation data (room IDs, membership status)</li>
            <li>Text content shared within collaboration rooms</li>
            <li>Files uploaded within collaboration rooms</li>
            <li>Whiteboard drawing data and shared canvas content</li>
            <li>
              Basic technical data (IP address, browser type, device info)
            </li>
          </ul>

          {/* 2 */}
          <h2 className="text-2xl font-semibold text-white">
            2. How We Use Information
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>To provide secure authentication and access control</li>
            <li>
              To enable real-time collaboration across text, files, and drawing
              sessions
            </li>
            <li>To prevent abuse and enforce rate limits</li>
            <li>To improve platform performance, reliability, and security</li>
          </ul>

          {/* 3 */}
          <h2 className="text-2xl font-semibold text-white">3. Guest Rooms</h2>

          <p>
            Guest rooms are temporary and may expire automatically. Guest users
            may have limited functionality, and content may not be retained
            permanently after expiration.
          </p>

          {/* 4 */}
          <h2 className="text-2xl font-semibold text-white">
            4. Data Retention
          </h2>

          <p>
            We retain account data only as long as necessary to provide our
            services. Expired guest rooms and associated data may be
            automatically deleted according to our system policies.
          </p>

          {/* 5 */}
          <h2 className="text-2xl font-semibold text-white">
            5. Data Security
          </h2>

          <p>
            All communication is transmitted over encrypted HTTPS connections.
            We implement JWT-based authentication, secure session handling, and
            server-side validation to protect against unauthorized access.
          </p>

          {/* 6 */}
          <h2 className="text-2xl font-semibold text-white">
            6. Third-Party Services
          </h2>

          <p>
            We may use trusted third-party services, such as authentication
            providers (e.g., Google OAuth), hosting providers, and analytics
            tools. These services operate under their own privacy policies.
          </p>

          {/* 7 */}
          <h2 className="text-2xl font-semibold text-white">7. Your Rights</h2>

          <p>
            You may request deletion of your account or personal data by
            contacting us. We will process such requests in accordance with
            applicable laws and platform policies.
          </p>

          {/* 8 */}
          <h2 className="text-2xl font-semibold text-white">
            8. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time. Continued use
            of ShareHut after changes are published constitutes acceptance of
            the updated policy.
          </p>

          {/* 9 */}
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
