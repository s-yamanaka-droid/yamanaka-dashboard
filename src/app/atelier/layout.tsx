import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier — WebGL & Layout Patterns ｜ 楽観 / Lakkan",
  description:
    "Lakkan が手がける、サイトの素地ライブラリ。WebGL 3D・高品質LP/HPレイアウト・コンバージョン素地を一望。すべてライトテーマ・1ファイル完結・SEO/構造化データ完備。",
  openGraph: {
    title: "Atelier — WebGL & Layout Patterns",
    description:
      "WebGL 3D・LP/HPレイアウト・コンバージョン素地を一望。配色とコピーを差し替えれば数分で“その会社版”になります。",
  },
};

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
