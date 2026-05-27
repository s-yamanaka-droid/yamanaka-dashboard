import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About — 山中秀斗 / Lakkan Inc.",
  description:
    "株式会社Lakkan 代表 山中秀斗。6社マルチハット経営。AIで「使う」から「動かす」へ。経歴・思想・所属。",
  openGraph: {
    title: "About — 山中秀斗 / Lakkan Inc.",
    description: "6社マルチハット経営の代表が、何を考えて何を作っているか。",
  },
};

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        section="About"
        version="v.1"
        title="楽観と、計画と。"
        lede="代表 山中秀斗 / 6社マルチハット経営 / 東京・渋谷"
      />
      <About />
    </main>
  );
}
