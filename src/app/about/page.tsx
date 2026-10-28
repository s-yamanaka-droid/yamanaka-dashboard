import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterContact } from "@/components/site/WaterContact";
import { PosterHeading, StudioPeople } from "@/components/site/PosterHeading";
import { LakkanLogo } from "@/components/brand/LakkanLogo";
import { CompanyIntroduction } from "@/components/site/CompanyIntroduction";

export const metadata: Metadata = {
  title: "会社情報",
  description: "株式会社Lakkanの会社情報。人財支援、CRM構築、FDE、AI活用を通じて、人手不足と業務の課題に向き合います。",
  alternates: { canonical: "https://lakkan-inc.vercel.app/about" },
};

export default function About() {
  return (
    <main id="main" className="poster-page poster-about">
      <SectionShell id="about-intro"><PosterHeading index="03" label="ABOUT" title={"人と、仕事と、\nその先の可能性。"} description="業務を見直す。技術を活かす。人と組織をつなぐ。ひとつの方法にとらわれず、事業の課題に向き合います。" people={false}/>
        <div className="poster-company"><div className="poster-company-people"><StudioPeople/><p>仕事から考え、つくって確かめる。<br/>人と技術で、事業の次の一歩へ。</p></div><div><p className="poster-small-label">会社情報 / COMPANY</p><LakkanLogo variant="signature" size="feature" /><dl>
          <div><dt>会社名</dt><dd>株式会社Lakkan / Lakkan Inc.</dd></div>
          <div><dt>所在地</dt><dd>東京都渋谷区神宮前六丁目23番4号</dd></div>
          <div><dt>事業内容</dt><dd>人財支援・採用支援<br/>CRM構築・業務改善<br/>Webサイト・LP制作<br/>FDE（現場に伴走する開発支援）<br/>AI導入・活用支援（Luna AIを含む）<br/><small>Luna AIの提供元は株式会社LunaTechです。</small></dd></div>
          <div><dt>支援の考え方</dt><dd>人手不足に対して、業務の見直し、技術の活用、人財支援を組み合わせて取り組みます。採用する役割や求める人材像を見直すことも、私たちの仕事です。</dd></div>
          <div><dt>サービス</dt><dd><Link href="/services">支援内容と進め方を見る <ArrowUpRight size={16} aria-hidden="true"/></Link></dd></div>
          <div><dt>お問い合わせ</dt><dd><Link href="/contact">お問い合わせはこちら <ArrowUpRight size={16} aria-hidden="true"/></Link></dd></div>
        </dl></div></div>
      </SectionShell>
      <SectionShell id="about-philosophy" topBorder><CompanyIntroduction/></SectionShell>
      <SectionShell id="about-business" topBorder>
        <div className="about-business-heading"><p className="poster-small-label">事業領域 / WHAT WE DO</p><h2><span>人と、技術と、</span><span>伝え方。</span></h2><p>課題をほどいて、必要な支援をつなぐ。<br/>Lakkanが取り組む4つの領域です。</p></div>
        <div className="about-business-list">{[
          ["01", "AI・業務改善", "仕事の流れを整理し、AIに任せる作業と、人が判断する役割を見極めます。Luna AI（提供：LunaTech）の導入・活用も支援します。", "/services#ai-operations"],
          ["02", "CRM・システム開発", "顧客情報や対応履歴をつなぎ、管理の手間を減らす。既存の仕組みを確認し、業務アプリや現場に伴走する開発支援で実装します。", "/services#crm"],
          ["03", "伝え方・Web体験", "会社やサービスの強みを、言葉と体験に。WebサイトやLP、相談・応募への導線、公開後の更新まで、一緒につくり続けます。", "/services#digital"],
          ["04", "採用・人財支援", "必要な役割と人材像を整理するところから。仕事の魅力の伝え方、採用の仕組み、人財紹介や受け入れまで、一緒に考えます。", "/services#people"],
        ].map(([number,title,body,href])=><Link key={number} href={href}><span>{number}</span><div><h3>{title.split("・").map((part,index,parts)=><span key={part}>{part}{index < parts.length - 1 ? "・" : ""}</span>)}</h3><p>{body}</p></div><ArrowUpRight size={20} aria-hidden="true"/></Link>)}</div>
      </SectionShell>
      <SectionShell id="about-approach" topBorder><div className="water-editorial-label"><h2>Our approach.</h2><p>大切にすること</p></div><div className="about-principles">{[
        ["仕事から考える。","ツールを選ぶ前に、仕事の流れと困りごとを整理する。減らせる作業と、人が判断する役割を見極めます。"],
        ["つくって確かめる。","言葉だけで決めず、画面や試作品で具体化する。実際に使う人の反応をもとに、かたちを整えます。"],
        ["使われるところまで。","公開や導入の先にも、日々の仕事は続く。運用と改善を見据えて、支援の範囲を一緒に考えます。"],
      ].map(([title,text])=><div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><Link className="brand-text-link" href="/works">取り組みを実績で見る <ArrowUpRight size={18}/></Link></SectionShell>
      <WaterContact/>
    </main>
  );
}
