import React from "react";
import AboutPage from "./About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ShareHut Live — a secure real-time text collaboration platform with private rooms, controlled access, and instant synchronization.",
  keywords: [
    "ShareHut",
    "ShareHut Live",
    "real-time collaboration",
    "live text sharing",
    "secure collaboration tool",
    "private room sharing",
  ],
  openGraph: {
    title: "About ShareHut Live",
    description:
      "Secure, real-time text sharing built for private collaboration.",
    url: "https://sharehutlive.com/about",
    siteName: "ShareHut Live",
    type: "website",
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
