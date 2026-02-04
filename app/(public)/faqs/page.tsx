import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShareHut FAQ | Frequently Asked Questions",
  description:
    "Find answers to common questions about ShareHut, including security, room access, real-time collaboration, and supported devices.",
  keywords: [
    "ShareHut FAQ",
    "text sharing FAQ",
    "real-time collaboration help",
    "ShareHut support",
    "room based collaboration",
  ],
  authors: [{ name: "ShareHut Team" }],
  openGraph: {
    title: "ShareHut FAQ",
    description:
      "Answers to frequently asked questions about ShareHut and how real-time text sharing works.",
    url: "https://sharehut-two.vercel.app/faqs",
    siteName: "ShareHut",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqs = [
  {
    question: "What is ShareHut used for?",
    answer:
      "ShareHut is used for real-time text sharing and collaboration inside private rooms.",
  },
  {
    question: "Is ShareHut free to use?",
    answer: "Yes, ShareHut is currently free to use.",
  },
  {
    question: "Do I need an account to use ShareHut?",
    answer:
      "Yes. Authentication is required to ensure secure access and prevent unauthorized usage.",
  },
  {
    question: "How does room access work?",
    answer:
      "Rooms are created by an owner. Other users join using a unique room code and must be approved by the owner.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. ShareHut uses encrypted connections, JWT authentication, and server-side validation to protect user data.",
  },
  {
    question: "Can multiple users edit text at the same time?",
    answer:
      "Yes. ShareHut supports real-time multi-user collaboration with instant synchronization.",
  },
  {
    question: "Does ShareHut support file sharing?",
    answer:
      "Currently, ShareHut focuses only on text sharing. File sharing may be added in future versions.",
  },
  {
    question: "What devices are supported?",
    answer:
      "ShareHut works on all modern browsers across desktops, laptops, tablets, and mobile devices.",
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">{faq.question}</h2>
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
