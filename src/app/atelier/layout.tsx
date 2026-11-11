import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/atelier", "Atelier — WebGL & Layout Patterns", "LakkanのWebGL・レイアウト表現を紹介するライブラリです。");

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
