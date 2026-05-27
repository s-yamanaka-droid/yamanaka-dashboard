import type { Metadata } from "next";
import { Service } from "@/components/sections/Service";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Services — Lakkan Inc.",
  description:
    "AIで「使う」から「動かす」へ。Lakkan の提供サービス：Vibe Coding 支援 / AI リスキリング / プロダクト設計 / コーポレートサイト構築。",
  openGraph: {
    title: "Services — Lakkan Inc.",
    description: "AIで動かす。Lakkan の提供サービス一覧。",
  },
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        section="Services"
        version="v.1"
        title="動かすAI、動かす組織。"
        lede="使うだけのAIから、動かすAIへ。Lakkan が提供するサービスは「翌日に動くもの」を出すこと。"
      />
      <Service />
    </main>
  );
}
