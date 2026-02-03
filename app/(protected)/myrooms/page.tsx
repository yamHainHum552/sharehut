import type { Metadata } from "next";
import MyRooms from "./Myrooms";

export const metadata: Metadata = {
  title: "My Rooms | ShareHut",
  description:
    "View and manage all your private text-sharing rooms in ShareHut.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyRoomsPage() {
  return <MyRooms />;
}
