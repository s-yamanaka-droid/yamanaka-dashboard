import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { ServiceExplorer } from "./services-client";
import { ServiceLab } from "./service-lab";
import { WaterContact } from "@/components/site/WaterContact";
import "./services.css";
import "./lab.css";

export const metadata: Metadata = {
  title: "サービス — AI導入・業務改善・システム開発",
  description: "業務再設計とAI導入、CRM・業務アプリ開発、Web制作、人財支援。Lakkanは、いまの困りごとから実装・運用まで一緒に考えます。",
  alternates: { canonical: "https://lakkan-inc.vercel.app/services" },
};

export default function Services() {
  return <main id="main" className="services-lp new-site">
    <SectionShell id="services-intro">
      <ServiceLab/>
    </SectionShell>
    <SectionShell id="support" tone="creamLight" topBorder>
      <div className="sv-section-head"><p className="sv-kicker">01　支援できること</p><h2>いまの困りごとから、<br/>支援を選ぶ。</h2><p>課題を選ぶと、対応するサービスと<br/>具体的な支援内容が表示されます。</p></div>
      <ServiceExplorer/>
    </SectionShell>
    <SectionShell id="approach" topBorder>
      <div className="sv-approach">
        <div><p className="sv-kicker">02　進め方</p><h2>業務の整理から、<br/>開発・運用まで。</h2><p className="sv-body">必要なものを、一緒に見極める。<br/>小さく試し、現場で確かめる。<br/>使われるところまで、つなげていきます。</p><Link href="/works" className="sv-text-link">これまでにつくったもの <ArrowUpRight size={17}/></Link></div>
        <ol className="sv-process">{[
          ["Listen", "現状と課題を整理する", "現場の流れと困りごとを整理。人が判断すること、AIに任せること、なくせる作業を見極めます。"],
          ["Design", "必要な支援と道筋を決める", "取り組む範囲、優先順位、費用と進行計画を整理。既存の仕組みも確認し、無理なく始める方法を考えます。"],
          ["Build", "試作品で確かめ、実装する", "画面や試作品で具体化。実際に使う人の反応を確かめながら、必要な機能を実装します。"],
          ["Grow", "導入後の運用を改善する", "導入後の運用と結果を確認。仕事に根づくよう、説明・改善・次の一手まで考えます。"],
        ].map(([en, title, body], i) => <li key={en}><span className="sv-step-no">0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
      </div>
    </SectionShell>
    <SectionShell id="questions" tone="creamLight" topBorder>
      <div className="sv-faq-layout"><div><p className="sv-kicker">03　よくある質問</p><h2>ご相談前の疑問に。</h2></div><div className="sv-faq">{[
        ["何を頼むか、まだ決まっていません。", "いま困っていることや実現したいことからお聞かせください。現状を整理し、必要な支援範囲と進め方をご提案します。"],
        ["いま使っているツールも活かせますか？", "既存のシステムや運用を確認したうえで、連携・改善の方法を検討します。すべてを作り替える前提ではありません。"],
        ["費用と期間は、どのくらいですか？", "必要な機能、既存環境、支援範囲によって変わります。ご相談内容をもとに、実施内容・費用・進行計画を整理してご案内します。"],
        ["公開や導入後も相談できますか？", "更新や運用の支援もご相談いただけます。必要な体制と対応範囲を、実施前に一緒に確認します。"],
      ].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div>
    </SectionShell>
    <WaterContact/>
  </main>;
}
