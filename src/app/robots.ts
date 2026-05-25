import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://yamanaka-dashboard.vercel.app/sitemap.xml",
    host: "https://yamanaka-dashboard.vercel.app",
  };
}
