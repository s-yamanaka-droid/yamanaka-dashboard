import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://lakkan-inc.vercel.app/sitemap.xml",
    host: "https://lakkan-inc.vercel.app",
  };
}
