import type { Metadata } from "next";
import { browserIcons, brandShareImage } from "@/lib/browser-brand";

// Descendants keep their article/product metadata; only the browser identity is shared.
export const metadata: Metadata = {
  icons: browserIcons("racco"),
  openGraph: {
    type: "website", locale: "ja_JP", siteName: "Racco | 株式会社Lakkan",
    title: "Racco — Lakkanの、いつもの仲間。",
    description: "自分の仕事でAIを試す、LakkanのRacco。",
    images: [brandShareImage],
  },
  twitter: {
    card: "summary_large_image", title: "Racco | Lakkan",
    description: "自分の仕事でAIを試す、LakkanのRacco。",
    images: [brandShareImage.url],
  },
};

export default function RaccoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
