import React from "react";
import FAQPage from "./FAQ";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about ShareHut Live, including security, access control, and real-time collaboration features.",
  alternates: {
    canonical: "https://sharehutlive.com/faqs",
  },
};

const page = () => {
  return (
    <>
      <FAQPage />
    </>
  );
};

export default page;
