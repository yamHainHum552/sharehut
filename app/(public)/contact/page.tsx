import ContactPage from "./Contact";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the ShareHut Live team for support, questions, or collaboration inquiries.",
  alternates: {
    canonical: "https://sharehutlive.com/contact",
  },
};

const page = () => {
  return <ContactPage />;
};

export default page;
