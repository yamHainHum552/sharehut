import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/register", "/dashboard", "/myrooms", "/profile"],
      },
    ],
    sitemap: "https://sharehutlive.com/sitemap.xml",
  };
}
