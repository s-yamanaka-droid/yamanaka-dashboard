import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "会社情報",
  description: "株式会社Lakkanの会社情報。人財支援、CRM構築、FDE、AI活用を通じて、人手不足と業務の課題に向き合います。",
  alternates: { canonical: "https://lakkan-inc.vercel.app/about" },
};

export default function About() {
  return (
    <main id="main" className="new-site">
      <section className="site-section company-section" aria-labelledby="company-title">
        <p className="eyebrow">ABOUT LAKKAN</p>
        <h1 id="company-title" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, lineHeight: 1.4, margin: "20px 0 40px" }}>会社情報</h1>
        <dl>
          <div><dt>会社名</dt><dd>株式会社Lakkan / Lakkan Inc.</dd></div>
          <div><dt>所在地</dt><dd>東京都渋谷区神宮前六丁目23番4号</dd></div>
          <div>
            <dt>事業内容</dt>
            <dd>
              人財支援・採用支援<br />
              CRM構築・業務改善<br />
              FDE（現場に伴走する開発支援）<br />
              AI導入・活用支援
            </dd>
          </div>
          <div>
            <dt>支援の考え方</dt>
            <dd>人手不足に対して、業務の見直し、技術の活用、人財支援を組み合わせて取り組みます。採用する役割や求める人材像を見直すことも、私たちの仕事です。</dd>
          </div>
          <div>
            <dt>サービスの詳細</dt>
            <dd><Link href="/services">支援内容と進め方を見る<ArrowUpRight size={16} aria-hidden="true" /></Link></dd>
          </div>
          <div>
            <dt>お問い合わせ</dt>
            <dd><Link href="/contact">お問い合わせはこちら<ArrowUpRight size={16} aria-hidden="true" /></Link></dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
