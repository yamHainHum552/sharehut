import React from "react";
import type { Metadata } from "next";
import ServicesPage from "./Services";

export const metadata: Metadata = {
  title: "Services — Real-Time Collaboration Rooms | ShareHut",

  description:
    "Explore ShareHut services including live text editing, secure file sharing, online whiteboard drawing, private collaboration rooms, and real-time synchronization built for teams and individuals.",

  keywords: [
    "real-time collaboration tool",
    "online whiteboard",
    "live text editing",
    "secure file sharing",
    "private collaboration rooms",
    "temporary workspace sharing",
    "ShareHut services",
  ],

  alternates: {
    canonical: "https://sharehutlive.com/services",
  },

  openGraph: {
    title: "ShareHut Services — Text, File & Whiteboard Collaboration",
    description:
      "Discover ShareHut’s core services: live text editing, file sharing, online whiteboard drawing, secure private rooms, and instant synchronization.",
    url: "https://sharehutlive.com/services",
    siteName: "ShareHut",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShareHut Services — Real-Time Collaboration Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareHut Services",
    description:
      "Real-time collaboration with text editing, file sharing, and whiteboard drawing in secure rooms.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return <ServicesPage />;
};

export default page;
