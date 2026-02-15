import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { getServerAuth } from "@/lib/auth-server";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "ShareHutLive — Secure Real-Time Text Sharing",
    template: "%s | ShareHut",
  },
  description:
    "ShareHut lets you securely create rooms and collaborate with others in real time. Fast, private, and reliable text sharing built for teams and individuals.",
  applicationName: "ShareHut",
  generator: "Next.js",
  keywords: [
    "real-time collaboration",
    "rooms",
    "secure text sharing",
    "online collaboration tool",
    "private rooms",
    "team collaboration",
    "ShareHut",
  ],
  authors: [{ name: "ShareHut Team" }],
  creator: "ShareHut",
  publisher: "ShareHut",
  metadataBase: new URL("https://sharehutlive.com"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "ShareHutLive — Secure Real-Time Text Sharing",
    description:
      "Create secure rooms and collaborate instantly with ShareHut. Built for speed, privacy, and real-time teamwork.",
    url: "https://sharehutlive.com",
    siteName: "ShareHut",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShareHut — Secure Real-Time Text Sharing",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareHut — Secure Real-Time Text Sharing",
    description: "Create secure rooms and collaborate instantly with ShareHut.",
    images: ["/og-image.png"],
    creator: "@sharehut",
  },

  category: "technology",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await getServerAuth();

  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7559107405287287"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-neutral-950 text-white">
        <Navbar isLoggedIn={isLoggedIn} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
