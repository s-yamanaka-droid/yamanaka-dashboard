import type { Metadata } from "next";
import { BrandBookPrint } from "@/components/brand/BrandBookPrint";
import "@/components/brand/brand-print.css";

export const metadata: Metadata = {
  title: "Racco Brand Book — 印刷版",
  description: "Raccoのコンセプト、世界観、言葉、媒体別の編集方針をまとめたブランドブック。",
  alternates: { canonical: "/brand-book" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function BrandBookPage() {
  return <BrandBookPrint />;
}
