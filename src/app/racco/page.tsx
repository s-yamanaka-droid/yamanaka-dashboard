import type { Metadata } from "next";
import BrandStudio from "@/components/brand/BrandStudio";

export const metadata: Metadata = {
  title: "Racco — サボるためのAI生存術",
  description: "ラクするためなら、手間を惜しまない。Raccoの考え方、実験、SNSとデザインのブランドブック。",
  alternates: { canonical: "/racco" },
  openGraph: {
    title: "Racco｜サボるためのAI生存術",
    description: "ラクするために、いっしょに試す。LakkanのRacco。",
    url: "/racco",
    images: [{ url: "/brand-book/racco-world.png", width: 1672, height: 941, alt: "ソファでくつろぐLakkanのRacco" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Racco｜サボるためのAI生存術",
    description: "ラクするために、いっしょに試す。LakkanのRacco。",
    images: ["/brand-book/racco-world.png"],
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BrandStudio brand="racco" />;
}
