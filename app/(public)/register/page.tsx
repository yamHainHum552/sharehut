import type { Metadata } from "next";
import Register from "./Register";

export const metadata: Metadata = {
  title: "Create an Account | ShareHut",
  description:
    "Create your ShareHut account to securely share text in real-time with private rooms.",
  keywords: [
    "ShareHut register",
    "secure text sharing",
    "real-time collaboration",
    "private rooms",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <>
      <Register />
    </>
  );
}
