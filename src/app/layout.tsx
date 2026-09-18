import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Frank_Ruhl_Libre, Instrument_Serif, Shippori_Mincho, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import "./site.css";
import "./subpages.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "./brand.css";
import "./brand-latin.css";
import { CookieConsent } from "@/components/CookieConsent";

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
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lakkan-inc.vercel.app"),
  title: {
    default: "株式会社Lakkan",
    template: "%s | 株式会社Lakkan",
  },
  description:
    "株式会社Lakkanの公式サイト。事業内容、公開実績、会社情報をご紹介します。",
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
    siteName: "株式会社Lakkan",
    title: "株式会社Lakkan",
    description:
      "株式会社Lakkanの公式サイト。事業内容、公開実績、会社情報をご紹介します。",
    images: [
      {
        url: "/brand/lakkan-orange.jpg",
        width: 1800,
        height: 1000,
        alt: "株式会社Lakkan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社Lakkan",
    description:
      "株式会社Lakkanの公式サイト。事業内容、公開実績、会社情報をご紹介します。",
    images: ["/brand/lakkan-orange.jpg"],
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
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistMono.variable} ${spaceGrotesk.variable} ${frankRuhl.variable} ${instrument.variable} ${shippori.variable} ${notoSansJP.variable} antialiased`}
    >
      <body className="bg-[#EEF0EC] text-[#132126]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://lakkan-inc.vercel.app/#org",
                  name: "株式会社Lakkan",
                  alternateName: ["Lakkan Inc.", "Lakkan", "ラッカン"],
                  url: "https://lakkan-inc.vercel.app",
                  logo: "https://lakkan-inc.vercel.app/og.png",
                  description:
                    "株式会社Lakkanの公式サイト。事業内容、公開実績、会社情報をご紹介します。",
                  foundingDate: "2026-03",
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
                  name: "株式会社Lakkan 公式サイト",
                  inLanguage: "ja-JP",
                  publisher: {
                    "@id": "https://lakkan-inc.vercel.app/#org",
                  },
                  about: { "@id": "https://lakkan-inc.vercel.app/#org" },
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://lakkan-inc.vercel.app/#breadcrumb",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home",     item: "https://lakkan-inc.vercel.app/" },
                    { "@type": "ListItem", position: 2, name: "Services", item: "https://lakkan-inc.vercel.app/services" },
                    { "@type": "ListItem", position: 3, name: "LunaTech", item: "https://luna-tech-public-site.vercel.app/" },
                    { "@type": "ListItem", position: 4, name: "Works",    item: "https://lakkan-inc.vercel.app/works" },
                    { "@type": "ListItem", position: 5, name: "About",    item: "https://lakkan-inc.vercel.app/about" },
                    { "@type": "ListItem", position: 6, name: "Contact",  item: "https://lakkan-inc.vercel.app/contact" },
                  ],
                },
                {
                  "@type": "ContactPage",
                  "@id": "https://lakkan-inc.vercel.app/contact#page",
                  url: "https://lakkan-inc.vercel.app/contact",
                  name: "Contact — Lakkan Inc.",
                  isPartOf: { "@id": "https://lakkan-inc.vercel.app/#website" },
                },
              ],
            }),
          }}
        />
        <a href="#main" className="skip-link">メインコンテンツへスキップ</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
