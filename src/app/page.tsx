import type { Metadata } from "next";
import FactoryHome from "@/components/factory/FactoryHome";

export const metadata: Metadata = {
  title: { absolute: "株式会社Lakkan — 人と仕事の課題を、整理から実装まで。" },
  description: "業務改善・AI活用、CRM・業務アプリ開発、Webサイト・LP制作、採用・人材支援。Lakkanは、課題の整理から実装・運用まで伴走します。",
};

export default function Home() {
  return <FactoryHome />;
}
