import type { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "Login — ShareHut",

  description:
    "Sign in to your ShareHut account to manage secure collaboration rooms for real-time text, file sharing, and whiteboard sessions.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <Login />;
}
