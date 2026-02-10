import type { Metadata } from "next";
import Profile from "./Profile";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Manage your ShareHut profile, account settings, and security preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <Profile />;
}
