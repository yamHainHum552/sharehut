import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/register", "/oauth-success", "/dashboard"],
      },
    ],
    sitemap: "https://sharehut-two.vercel.app/sitemap.xml",
  };
}
