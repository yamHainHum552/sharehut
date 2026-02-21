import type { Metadata } from "next";
import Register from "./Register";

export const metadata: Metadata = {
  title: "Create an Account — ShareHut",

  description:
    "Sign up for ShareHut to create secure real-time collaboration rooms for text editing, file sharing, and online whiteboard sessions.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <>
      <Register />
    </>
  );
}
