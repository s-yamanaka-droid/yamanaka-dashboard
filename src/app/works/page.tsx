import type { Metadata } from "next";
import { WorksClient } from "./WorksClient";

export const metadata: Metadata = {
  title: "Works — Lakkan Inc.",
  description:
    "Lakkanの公開ポートフォリオ。実案件、自社プロダクト、AIだけで作ったデザイン実験を、実際の画面とともに紹介します。",
  alternates: {
    canonical: "https://lakkan-inc.vercel.app/works",
  },
  openGraph: {
    title: "Works — Lakkan Inc.",
    description: "構想を、動くものへ。Lakkanの公開ポートフォリオ。",
    url: "https://lakkan-inc.vercel.app/works",
  },
};

export default function WorksPage() {
  return <WorksClient />;
}
