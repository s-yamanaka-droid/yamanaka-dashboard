import type { Metadata } from "next";
import { raccoRounded, raccoLogo } from "@/lib/racco-fonts";
import BrandStudio from "@/components/brand/BrandStudio";
import { brandShareImage } from "@/lib/browser-brand";

export const metadata: Metadata = {
  title: "Racco — 同じ作業は、AIに任せたい。",
  description: "メールの下書き、調べもの、メモの整理。自分の仕事でAIを試す、LakkanのRacco。",
  alternates: { canonical: "/racco" },
  openGraph: {
    title: "Racco｜同じ作業は、AIに任せたい。",
    description: "メールの下書きも、調べものも。LakkanのRacco。",
    url: "/racco",
    images: [brandShareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Racco｜同じ作業は、AIに任せたい。",
    description: "メールの下書きも、調べものも。LakkanのRacco。",
    images: [brandShareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function Page() {
  return (
    <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}>
      <BrandStudio brand="racco" />
    </div>
  );
}
