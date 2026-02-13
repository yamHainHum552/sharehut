"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is ShareHut used for?",
    answer:
      "ShareHut enables real-time text sharing inside secure, private rooms.",
  },
  {
    question: "Is ShareHut free to use?",
    answer: "Yes, ShareHut is currently free.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Authentication is required for persistent rooms. Guest rooms are temporary.",
  },
  {
    question: "How does room access work?",
    answer: "Room owners create rooms and approve join requests when required.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All communication is encrypted and validated server-side using JWT authentication.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="bg-neutral-950 text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border border-neutral-800 rounded-xl bg-neutral-900"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className="text-purple-400">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
