import type { Metadata } from "next";
import { brandShareImage } from "./browser-brand";

export const siteUrl = "https://lakkan-inc.vercel.app";
export const companyDescription = "株式会社Lakkan（ラッカン）の公式サイト。人材紹介・採用支援、業務改善・AI活用、CRM・業務アプリ開発、Webサイト・LP制作、SNSマーケティングを、課題の整理から実装・運用まで支援します。";

export function pageMetadata(path: string, title: string, description: string, image = brandShareImage.url): Metadata {
  const fullTitle = title.includes("株式会社Lakkan") ? title : `${title} | 株式会社Lakkan`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      type: "website", locale: "ja_JP", siteName: "Lakkan",
      title: fullTitle, description, url: `${siteUrl}${path}`,
      images: [{ url: image, alt: title }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
