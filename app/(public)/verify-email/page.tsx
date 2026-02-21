import type { Metadata } from "next";
import VerifyEmailPage from "./VerifyEmail";

export const metadata: Metadata = {
  title: "Verify Your Email — ShareHut",

  description:
    "Verify your email address to activate your ShareHut account and access secure real-time collaboration rooms.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://sharehutlive.com/verify-email",
  },
};

export default function Page() {
  return <VerifyEmailPage />;
}
