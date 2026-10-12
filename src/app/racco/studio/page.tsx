import type { Metadata } from "next";
import BrandLibrary from "@/components/brand/BrandLibrary";
import { raccoRounded, raccoLogo } from "@/lib/racco-fonts";

export const metadata: Metadata = {
  title: "Racco 制作資料",
  description: "SNSの文面案と画像素材。制作・確認のためのページです。",
  alternates: { canonical: "/racco/studio" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}>
      <BrandLibrary brand="racco" studio />
    </div>
  );
}
