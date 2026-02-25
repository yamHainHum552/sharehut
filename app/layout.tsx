import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { getServerAuth } from "@/lib/auth-server";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://sharehutlive.com"),

  title: {
    default:
      "ShareHut — Real-Time Collaboration Rooms (Text, Files & Whiteboard)",
    template: "%s | ShareHut",
  },

  description:
    "Share text online instantly with ShareHut. Create secure real-time collaboration rooms for live text editing, code sharing, file sharing, and online whiteboard drawing. No signup required.",

  applicationName: "ShareHut",

  keywords: [
    // Core High-Intent
    "share text online",
    "text share online",
    "online text sharing",
    "share code online",
    "code share online",
    "real time text editor",
    "online collaborative editor",
    "live text collaboration",
    "temporary text sharing",
    "instant text sharing",

    // Problem-Based Searches
    "how to share text online",
    "share notes online instantly",
    "share code with friends online",
    "online text editor no signup",
    "temporary online workspace",
    "private collaboration room",

    // Whiteboard + File Angle
    "online whiteboard collaboration",
    "draw together online",
    "real time drawing tool",
    "share files instantly online",
    "temporary file sharing tool",

    // Tool Intent
    "free online text editor",
    "real time code editor online",
    "paste text online",
    "quick text sharing tool",
    "instant collaboration tool",

    // Brand
    "ShareHut",
  ],

  authors: [{ name: "ShareHut Team" }],
  creator: "ShareHut",
  publisher: "ShareHut",

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
    type: "website",
    locale: "en_US",
    url: "https://sharehutlive.com",
    siteName: "ShareHut",
    title: "ShareHut — Real-Time Text, File & Whiteboard Collaboration",
    description:
      "Create secure collaboration rooms instantly. Share live text, upload files, and draw together in real time. Private and temporary workspaces with no signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShareHut — Real-Time Collaboration Rooms",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareHut — Real-Time Collaboration Rooms",
    description:
      "Live text editing, file sharing and online whiteboard drawing in secure temporary rooms.",
    images: ["/og-image.png"],
    creator: "@sharehut",
  },

  robots: {
    index: true,
    follow: true,
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
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ShareHut",
              url: "https://sharehutlive.com",
              logo: "https://sharehutlive.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "sharehutlive@gmail.com",
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ShareHut",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: "https://sharehutlive.com",
              description:
                "ShareHut provides secure real-time collaboration rooms for live text editing, file sharing, and online whiteboard drawing.",
            }),
          }}
        />

        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID}`}
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
