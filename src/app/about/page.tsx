import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About — Lakkan Inc.",
  description:
    "株式会社Lakkanは、AIを前提に事業と業務の流れを再設計するAIファースト企業です。思想・事業領域・会社情報をご紹介します。",
  openGraph: {
    title: "About — Lakkan Inc.",
    description: "AIを前提に、事業と業務をどう組み直すか。Lakkanの思想と会社情報。",
  },
};

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        section="About"
        version="v.1"
        title="Lakkanについて。"
        lede="AIを前提に、事業と業務を再設計する。東京・渋谷のAIカンパニー。"
      />
      <About />
    </main>
  );
}
