import type { Metadata } from "next";
import VerifyEmailPage from "./VerifyEmail";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description:
    "Verify your email to activate your ShareHut account and start secure real-time collaboration.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/verify-email",
  },
};

export default function Page() {
  return <VerifyEmailPage />;
}
