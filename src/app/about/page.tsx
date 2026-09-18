import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterSculpture } from "@/components/site/WaterSculpture";
import { WaterContact } from "@/components/site/WaterContact";
import { BrandHeading } from "@/components/site/BrandHeading";

export const metadata: Metadata = {
  title: "会社情報",
  description: "株式会社Lakkanの会社情報。人財支援、CRM構築、FDE、AI活用を通じて、人手不足と業務の課題に向き合います。",
  alternates: { canonical: "https://lakkan-inc.vercel.app/about" },
};

export default function About() {
  return (
    <main id="main" className="new-site water-about">
      <SectionShell id="about-water-hero"><p className="water-page-kicker">About Lakkan<span>.</span></p><div className="water-about-intro"><div><BrandHeading as="h1">{"人と、仕事と、\nその先の可能性。"}</BrandHeading><p>業務を見直す。技術を活かす。人と組織をつなぐ。<br/>ひとつの方法にとらわれず、事業の課題に向き合います。</p></div><WaterSculpture/></div></SectionShell>
      <SectionShell id="about-approach" topBorder><div className="water-editorial-label"><h2>Our approach.</h2><p>大切にすること</p></div><div className="about-principles">{[
        ["仕事から考える。","ツールを選ぶ前に、仕事の流れと困りごとを整理する。減らせる作業と、人が判断する役割を見極めます。"],
        ["つくって確かめる。","言葉だけで決めず、画面や試作品で具体化する。実際に使う人の反応をもとに、かたちを整えます。"],
        ["使われるところまで。","公開や導入の先にも、日々の仕事は続く。運用と改善を見据えて、支援の範囲を一緒に考えます。"],
      ].map(([title,text])=><div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><Link className="brand-text-link" href="/works">取り組みを実績で見る <ArrowUpRight size={18}/></Link></SectionShell>
      <SectionShell id="company-facts"><div className="company-section water-company-facts">
        <div className="water-editorial-label"><h2>Company</h2><p>会社情報</p></div>
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
      </div></SectionShell>
      <WaterContact/>
    </main>
  );
}
