import React from "react";
import FAQPage from "./FAQ";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShareHut FAQs — Security, Rooms & Real-Time Collaboration",

  description:
    "Find answers to common questions about ShareHut’s real-time collaboration rooms, including text sharing, file uploads, online whiteboard drawing, privacy, and room access control.",

  keywords: [
    "ShareHut FAQ",
    "real-time collaboration questions",
    "online whiteboard FAQ",
    "secure room sharing",
    "temporary collaboration rooms",
    "live text sharing help",
    "file sharing platform FAQ",
  ],

  openGraph: {
    title: "ShareHut FAQs — Real-Time Text, File & Whiteboard Collaboration",
    description:
      "Answers to frequently asked questions about ShareHut’s secure collaboration rooms and live sharing features.",
    url: "https://sharehutlive.com/faqs",
    siteName: "ShareHut",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShareHut Frequently Asked Questions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareHut FAQs",
    description:
      "Learn more about ShareHut’s real-time collaboration rooms and secure sharing tools.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://sharehutlive.com/faqs",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is ShareHut secure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, ShareHut uses private temporary rooms with controlled access and real-time synchronization.",
                },
              },
              {
                "@type": "Question",
                name: "Can I share files in ShareHut?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, ShareHut supports secure file sharing within collaboration rooms.",
                },
              },
              {
                "@type": "Question",
                name: "Does ShareHut support drawing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, ShareHut includes an online whiteboard for real-time collaborative drawing.",
                },
              },
            ],
          }),
        }}
      />
      <FAQPage />
    </>
  );
};

export default page;
