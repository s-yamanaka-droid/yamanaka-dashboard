import type { MetadataRoute } from "next";
import { publicWorks } from "@/lib/work-detail";
import { raccoColumns } from "@/data/racco-columns";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lakkan-inc.vercel.app";
  // Only content revisions with a known date receive lastModified.
  const updated = new Date("2026-11-12T00:00:00+09:00");
  return [
    ...publicWorks.map(p=>({url:`${base}/works/${p.id}`,lastModified:new Date(p.updatedAt),changeFrequency:"monthly" as const,priority:.7})),
    { url: `${base}/`,         lastModified: updated, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,    lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services`, lastModified: updated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/works`,    changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/brand`,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/works/crm-development`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/workshop`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/records`,  changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/changelog`,lastModified: updated, changeFrequency: "weekly",  priority: 0.4 },
    { url: `${base}/contact`,  changeFrequency: "yearly",  priority: 0.7 },
    { url: `${base}/privacy`,  changeFrequency: "yearly",  priority: 0.3 },
    // Only public Racco reading pages; studio, books and goods stay out.
    { url: `${base}/racco`, changeFrequency: "monthly", priority: 0.7 },
    ...raccoColumns.map(article => ({
      url: `${base}/racco/columns/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
