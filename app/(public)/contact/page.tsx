import ContactPage from "./Contact";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ShareHut — Support & Collaboration Inquiries",

  description:
    "Get in touch with the ShareHut team for support, feedback, technical assistance, or collaboration inquiries related to our real-time text, file, and whiteboard sharing platform.",

  keywords: [
    "Contact ShareHut",
    "ShareHut support",
    "real-time collaboration support",
    "whiteboard collaboration help",
    "secure room support",
  ],

  openGraph: {
    title: "Contact ShareHut",
    description:
      "Reach the ShareHut team for support and inquiries about our real-time collaboration rooms.",
    url: "https://sharehutlive.com/contact",
    siteName: "ShareHut",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact ShareHut",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact ShareHut",
    description:
      "Need help with ShareHut? Contact our team for support and collaboration inquiries.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://sharehutlive.com/contact",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return <ContactPage />;
};

export default page;
