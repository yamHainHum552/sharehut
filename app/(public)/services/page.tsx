import React from "react";
import type { Metadata } from "next";
import ServicesPage from "./Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore ShareHut services including secure real-time text sharing, private collaboration rooms, role-based access, and instant synchronization built for teams and individuals.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "ShareHut Services — Secure Real-Time Collaboration",
    description:
      "Discover ShareHut’s core services: real-time text sharing, private rooms, join approval workflows, and secure collaboration.",
    url: "https://sharehutlive.com/services",
    siteName: "ShareHut",
    type: "website",
  },
};

const page = () => {
  return (
    <>
      <ServicesPage />
    </>
  );
};

export default page;
