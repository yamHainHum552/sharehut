import React from "react";
import type { Metadata } from "next";
import SharePage from "./Share";

export const metadata: Metadata = {
  title: "QuickShare | Instant Secure Text Sharing",
  description:
    "QuickShare by ShareHut enables instant, secure, and temporary text sharing without complex setup. Create a room, share text in real-time, and collaborate seamlessly with end-to-end security.",
  alternates: {
    canonical: "/quickshare",
  },
  openGraph: {
    title: "QuickShare — Instant Secure Text Sharing | ShareHut",
    description:
      "Start sharing text instantly with QuickShare. Create a secure room, collaborate in real-time, and synchronize content across devices without friction.",
    url: "https://sharehut-two.vercel.app/quickshare",
    siteName: "ShareHut",
    type: "website",
  },
};

const Page = () => {
  return <SharePage />;
};

export default Page;
