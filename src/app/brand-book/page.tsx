import type { Metadata } from "next";
import { BrandBookPrint } from "@/components/brand/BrandBookPrint";
import { raccoLogo, raccoRounded } from "@/lib/racco-fonts";
import "@/components/brand/brand-print.css";

export const metadata: Metadata = {
  title: "Lakkan / Racco ブランドブック",
  description: "Lakkanのロゴ、Raccoと仲間たちの世界観、言葉、SNS・グッズの使い方をまとめたブランドブック。印刷・PDF保存にも対応。",
  alternates: { canonical: "/brand-book" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function BrandBookPage() {
  return <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}><BrandBookPrint /></div>;
}
