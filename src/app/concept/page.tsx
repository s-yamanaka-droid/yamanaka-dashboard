import type { Metadata } from "next";
import BrandStudio from "@/components/brand/BrandStudio";

export const metadata: Metadata = {
  title: "Lakkan — 考え方とブランド",
  description: "人と仕事の課題を、整理から実装まで。考え方を、使える形へ。LakkanとRaccoのブランドコンセプト。",
  alternates: { canonical: "/concept" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BrandStudio brand="lakkan" />;
}
