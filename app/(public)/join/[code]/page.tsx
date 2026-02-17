import JoinRoomClient from "./JoinRoomClient";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return <JoinRoomClient code={code} />;
}
