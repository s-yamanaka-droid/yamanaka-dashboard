import type { Metadata } from "next";
import LakkanHome from "@/components/home/LakkanHome";

export const metadata: Metadata = {
  title: { absolute: "株式会社Lakkan — 頭はやわらかく。つくるのは、しっかり。" },
  description: "業務改善・AI活用、CRM・業務アプリ開発、Webサイト・LP制作、採用・人材支援。Lakkanは、課題の整理から実装・運用まで伴走します。",
};

export default function Home() {
  return <LakkanHome />;
}
