import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Frank_Ruhl_Libre, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./vigil-tokens.css";
import GlobalShell from "@/components/GlobalShell";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://lakkan-inc.vercel.app"),
  title: {
    default: "株式会社Lakkan | AIコーポレートサイト — 楽観と、計画と。",
    template: "%s | 株式会社Lakkan",
  },
  description:
    "株式会社LakkanはAIエージェント開発・バイブコーディング・採用DXを軸とするAIファースト企業。生成AI・LLM・自律エージェントを活用し、企業の業務を構造化・自動化する。代表 山中秀斗（Shuto Yamanaka）。",
  keywords: [
    "AI", "AIエージェント", "生成AI", "LLM", "Claude", "Anthropic",
    "AI企業", "AIコーポレート", "AI活用", "バイブコーディング",
    "採用DX", "AI採用", "業務自動化", "Lakkan", "楽観",
    "山中秀斗", "Shuto Yamanaka", "トレプロ", "Trepro", "COO",
  ],
  authors: [{ name: "Shuto Yamanaka", url: "https://lakkan-inc.vercel.app" }],
  creator: "Shuto Yamanaka",
  publisher: "株式会社Lakkan",
  applicationName: "Lakkan Inc.",
  category: "Technology",
  classification: "AI / Artificial Intelligence Company",
  alternates: { canonical: "https://lakkan-inc.vercel.app" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://lakkan-inc.vercel.app",
    siteName: "株式会社Lakkan — AI Company",
    title: "株式会社Lakkan | AIコーポレートサイト",
    description:
      "AIエージェント・生成AI・自律システムを核に、企業の業務を構造化・自動化するAIファースト企業。",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "株式会社Lakkan — 楽観と、計画と。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社Lakkan | AIコーポレートサイト",
    description:
      "AIエージェント・生成AI・自律システムを核に、企業の業務を構造化・自動化するAIファースト企業。",
    images: ["/og.png"],
    creator: "@yamanaka_shuto",
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
      className={`${geistMono.variable} ${spaceGrotesk.variable} ${frankRuhl.variable} ${instrument.variable} antialiased`}
    >
      <body className="bg-[#F7F4EE] text-[#0D0D0D]">
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
                  logo: "https://lakkan-inc.vercel.app/photo.jpg",
                  description:
                    "AIエージェント・生成AI・自律システムを核に、企業の業務を構造化・自動化するAIファースト企業。",
                  foundingDate: "2026-03",
                  founder: {
                    "@type": "Person",
                    "@id": "https://lakkan-inc.vercel.app/#person",
                  },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "神宮前六丁目23番4号",
                    addressLocality: "渋谷区",
                    addressRegion: "東京都",
                    addressCountry: "JP",
                  },
                  email: "s-yamanaka@tre-pro.co.jp",
                  industry: "Artificial Intelligence",
                  knowsAbout: [
                    "Artificial Intelligence",
                    "Large Language Models",
                    "AI Agents",
                    "Generative AI",
                    "Claude",
                    "Vibe Coding",
                    "AI Recruitment",
                    "Workflow Automation",
                  ],
                },
                {
                  "@type": "Person",
                  "@id": "https://lakkan-inc.vercel.app/#person",
                  name: "山中 秀斗",
                  alternateName: ["Shuto Yamanaka", "Yamanaka Shuto"],
                  jobTitle: "COO / Founder",
                  worksFor: {
                    "@id": "https://lakkan-inc.vercel.app/#org",
                  },
                  birthDate: "1997",
                  nationality: "JP",
                  image: "https://lakkan-inc.vercel.app/photo.jpg",
                  url: "https://lakkan-inc.vercel.app",
                  email: "s-yamanaka@tre-pro.co.jp",
                  knowsAbout: [
                    "AI",
                    "Generative AI",
                    "AI Agents",
                    "SaaS",
                    "Recruitment",
                    "Management",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://lakkan-inc.vercel.app/#website",
                  url: "https://lakkan-inc.vercel.app",
                  name: "株式会社Lakkan — AI Corporate Site",
                  inLanguage: "ja-JP",
                  publisher: {
                    "@id": "https://lakkan-inc.vercel.app/#org",
                  },
                  about: {
                    "@type": "Thing",
                    name: "Artificial Intelligence",
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://lakkan-inc.vercel.app/#breadcrumb",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home",     item: "https://lakkan-inc.vercel.app/" },
                    { "@type": "ListItem", position: 2, name: "Services", item: "https://lakkan-inc.vercel.app/services" },
                    { "@type": "ListItem", position: 3, name: "Vigil AI", item: "https://lakkan-inc.vercel.app/vigil" },
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
        <GlobalShell />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
