import type { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "Login | ShareHut",
  description:
    "Log in to ShareHut to access your private rooms and share text securely in real time.",
  keywords: ["ShareHut login", "secure login", "real-time text sharing"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <Login />;
}
