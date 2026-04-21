import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Yamanaka Allen — Product Builder",
  description: "Products & tools built by Yamanaka Allen / Trepro CEO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistMono.variable} ${spaceGrotesk.variable} ${frankRuhl.variable} antialiased`}
    >
      <body className="bg-[#F7F4EE] text-[#0D0D0D]">
        {children}
      </body>
    </html>
  );
}
