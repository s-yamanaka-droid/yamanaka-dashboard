import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Frank_Ruhl_Libre, Instrument_Serif, Shippori_Mincho, Noto_Sans_JP, Bebas_Neue } from "next/font/google";
import "./globals.css";
import "./site.css";
import "./subpages.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteBreadcrumbs } from "@/components/site/SiteBreadcrumbs";
import { SiteFooter } from "@/components/site/SiteFooter";
import "./brand.css";
import "./brand-latin.css";
import "./corporate-paper.css";
import "./company-introduction.css";
import "./racco-corporate.css";
import { CookieConsent } from "@/components/CookieConsent";
import { SiteFrame } from "@/components/site/SiteFrame";
import { SiteSound } from "@/components/records/SiteSound";
import { browserIcons, brandShareImage } from "@/lib/browser-brand";
import { companyDescription, jsonLd, siteUrl } from "@/lib/seo";

const bebas = Bebas_Neue({ variable: "--font-poster", subsets: ["latin"], weight: "400", display: "swap" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// 日本語 serif（見出し用・Frank Ruhl Libre とペアで使う）
const shippori = Shippori_Mincho({
  variable: "--font-mincho",
  weight: ["500", "600", "700"],
  display: "swap",
  preload: false,
});

// 日本語 sans（本文用）
const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-jp",
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lakkan-inc.vercel.app"),
  title: {
    default: "株式会社Lakkan",
    template: "%s | 株式会社Lakkan",
  },
  description: companyDescription,
  keywords: [
    "株式会社Lakkan", "Lakkan", "ラッカン",
  ],
  authors: [{ name: "株式会社Lakkan", url: "https://lakkan-inc.vercel.app" }],
  creator: "株式会社Lakkan",
  publisher: "株式会社Lakkan",
  applicationName: "Lakkan Inc.",
  alternates: { canonical: "https://lakkan-inc.vercel.app" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://lakkan-inc.vercel.app",
    siteName: "Lakkan",
    title: "株式会社Lakkan",
    images: [brandShareImage],
    description: companyDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社Lakkan",
    images: [brandShareImage.url],
    description: companyDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: browserIcons("lakkan"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistMono.variable} ${spaceGrotesk.variable} ${frankRuhl.variable} ${instrument.variable} ${shippori.variable} ${notoSansJP.variable} ${bebas.variable} antialiased`}
    >
      <body className="bg-[#EEF0EC] text-[#132126]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://lakkan-inc.vercel.app/#org",
                  name: "株式会社Lakkan",
                  legalName: "株式会社Lakkan",
                  alternateName: ["Lakkan Inc.", "Lakkan", "ラッカン"],
                  url: "https://lakkan-inc.vercel.app",
                  logo: "https://lakkan-inc.vercel.app/brand/lakkan-logo/lakkan-a3-wordmark.png",
                  description: companyDescription,
                  employee: { "@id": `${siteUrl}/about#representative` },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "神宮前六丁目23番4号",
                    addressLocality: "渋谷区",
                    addressRegion: "東京都",
                    addressCountry: "JP",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://lakkan-inc.vercel.app/#website",
                  url: "https://lakkan-inc.vercel.app",
                  name: "Lakkan",
                  alternateName: ["株式会社Lakkan", "ラッカン", "Lakkan Inc."],
                  inLanguage: "ja-JP",
                  publisher: {
                    "@id": "https://lakkan-inc.vercel.app/#org",
                  },
                  about: { "@id": "https://lakkan-inc.vercel.app/#org" },
                },
                {
                  "@type": "Person",
                  "@id": `${siteUrl}/about#representative`,
                  name: "山中秀斗",
                  jobTitle: "代表取締役",
                  url: `${siteUrl}/about`,
                  worksFor: { "@id": `${siteUrl}/#org` },
                },
              ],
            }),
          }}
        />
        <a href="#main" className="skip-link">メインコンテンツへスキップ</a>
        <SiteFrame><SiteHeader /><SiteBreadcrumbs />
        {children}
        <SiteFooter />
        <CookieConsent /></SiteFrame>
        <SiteSound />
      </body>
    </html>
  );
}
