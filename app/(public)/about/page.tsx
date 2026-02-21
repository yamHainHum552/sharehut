import React from "react";
import AboutPage from "./About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShareHut — Real-Time Collaboration Platform",

  description:
    "Learn about ShareHut, a secure real-time collaboration platform for live text editing, file sharing, and online whiteboard drawing. Built for private, temporary workspaces with instant synchronization and controlled access.",

  keywords: [
    "ShareHut",
    "real-time collaboration platform",
    "online whiteboard tool",
    "live text editing",
    "secure file sharing",
    "temporary collaboration rooms",
    "private workspace sharing",
  ],

  openGraph: {
    title: "About ShareHut — Real-Time Text, File & Whiteboard Collaboration",
    description:
      "Discover how ShareHut enables secure collaboration through live text editing, file sharing, and online drawing rooms.",
    url: "https://sharehutlive.com/about",
    siteName: "ShareHut",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About ShareHut — Real-Time Collaboration Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About ShareHut — Real-Time Collaboration Rooms",
    description:
      "Learn how ShareHut powers secure real-time text, file, and whiteboard collaboration.",
    images: ["/og-image.png"],
  },

  alternates: {
    canonical: "https://sharehutlive.com/about",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <AboutPage />
    </>
  );
};

export default page;
