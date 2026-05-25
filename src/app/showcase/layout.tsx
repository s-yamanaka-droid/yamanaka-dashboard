import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase — 山中秀斗のプロダクト一覧",
  description: "Lakkan / トレプロ / LunaTech / KANOA / SKYLINK / Solve の公開プロダクト一覧。商談・共有用ショーケース。",
  openGraph: {
    title: "Showcase — 山中秀斗のプロダクト一覧",
    description: "6社・21+の公開プロダクトを一覧表示。",
  },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
