import type { Metadata } from "next";
import localFont from "next/font/local";
import BrandStudio from "@/components/brand/BrandStudio";

const raccoRounded = localFont({
  src: [
    { path: "./fonts/ZenMaruGothic-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ZenMaruGothic-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ZenMaruGothic-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-racco-rounded",
  display: "swap",
  preload: false,
});

const raccoLogo = localFont({
  src: "./fonts/Nunito-Variable.woff2",
  variable: "--font-racco-logo",
  weight: "200 1000",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Racco — 同じ作業は、AIに任せたい。",
  description: "メールの下書き、調べもの、メモの整理。自分の仕事でAIを試す、LakkanのRacco。",
  alternates: { canonical: "/racco" },
  openGraph: {
    title: "Racco｜同じ作業は、AIに任せたい。",
    description: "メールの下書きも、調べものも。LakkanのRacco。",
    url: "/racco",
    images: [{ url: "/brand-book/racco-self-morning.png", width: 1672, height: 941, alt: "太縁メガネと灰色のパーカーで、朝をのんびり過ごすLakkanのRacco" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Racco｜同じ作業は、AIに任せたい。",
    description: "メールの下書きも、調べものも。LakkanのRacco。",
    images: ["/brand-book/racco-self-morning.png"],
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}>
      <BrandStudio brand="racco" />
    </div>
  );
}
