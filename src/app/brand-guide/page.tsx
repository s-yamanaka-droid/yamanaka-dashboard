import type { Metadata } from "next";
import { BrandGuide } from "@/components/brand/BrandStudio";
import { raccoLogo, raccoRounded } from "@/lib/racco-fonts";

export const metadata: Metadata = {
  title: "Lakkan / Racco — 詳しいブランドブック",
  description: "ことばと人格、仕事の試し方、SNSと素材の詳しいガイド。",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}><BrandGuide brand="lakkan"/></div>;
}
