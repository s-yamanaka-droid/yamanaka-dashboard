import type { MetadataRoute } from "next";
import { publicWorks } from "@/lib/work-detail";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lakkan-inc.vercel.app";
  const now = new Date();
  return [
    ...publicWorks.map(p=>({url:`${base}/works/${p.id}`,lastModified:new Date(p.updatedAt),changeFrequency:"monthly" as const,priority:.7})),
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/works`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/changelog`,lastModified: now, changeFrequency: "weekly",  priority: 0.4 },
    { url: `${base}/atelier`,  lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${base}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
