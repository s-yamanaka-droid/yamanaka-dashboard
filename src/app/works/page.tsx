import type { Metadata } from "next";
import { WorksClient } from "./WorksClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/works", "制作・開発実績", "Lakkanの公開ポートフォリオ。CRM・業務アプリ、Webサイト・LP、自社プロダクトを、実際の画面とともに紹介します。");

export default function WorksPage() {
  return <WorksClient />;
}
