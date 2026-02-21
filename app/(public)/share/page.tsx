import React from "react";
import type { Metadata } from "next";
import SharePage from "./Share";

export const metadata: Metadata = {
  title: "QuickShare — Instant Collaboration Rooms | ShareHut",

  description:
    "QuickShare by ShareHut enables instant, secure, and temporary collaboration rooms for live text editing, file sharing, and online whiteboard drawing. No complex setup required.",

  keywords: [
    "QuickShare",
    "instant collaboration tool",
    "temporary collaboration rooms",
    "live text sharing",
    "secure file sharing",
    "online whiteboard tool",
    "real-time collaboration platform",
  ],

  alternates: {
    canonical: "https://sharehutlive.com/quickshare",
  },

  openGraph: {
    title: "QuickShare — Instant Real-Time Collaboration | ShareHut",
    description:
      "Create a secure room instantly and collaborate through live text editing, file sharing, and online drawing.",
    url: "https://sharehutlive.com/quickshare",
    siteName: "ShareHut",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuickShare — Instant Collaboration Rooms",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "QuickShare — Instant Collaboration Rooms",
    description:
      "Start collaborating instantly with live text, file sharing, and whiteboard drawing in secure temporary rooms.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Page = () => {
  return <SharePage />;
};

export default Page;
