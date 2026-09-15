import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { ServiceExplorer, ServiceSculpture } from "./services-client";
import "./services.css";

export const metadata: Metadata = {
  title: "できること — 仕事と事業の、その先へ。",
  description: "業務再設計とAI導入、CRM・業務アプリ開発、Web制作、人財支援。Lakkanは、いまの困りごとから実装・運用まで一緒に考えます。",
  alternates: { canonical: "https://lakkan-inc.vercel.app/services" },
};

export default function Services() {
  return <main id="main" className="services-lp new-site">
    <SectionShell id="services-intro">
      <div className="sv-hero">
        <div className="sv-hero-copy">
          <p className="sv-kicker"><span/> LAKKAN / WHAT WE DO</p>
          <h1>仕事と事業の、<br/><em>その先</em>へ。</h1>
          <p className="sv-lead">人の力と、技術の力。<br/>いまある可能性を、動くかたちに。</p>
          <p className="sv-intro">業務の見直しから、AI・システムの実装、<br className="sv-desktop"/>魅力を届けるWeb制作まで。<br/>Lakkanは、現場の一歩を一緒につくります。</p>
          <Link className="sv-button" href="/contact?topic=ai-consult">いまの課題を話す <ArrowUpRight size={18}/></Link>
        </div>
        <div className="sv-art">
          <ServiceSculpture/>
          <div className="sv-art-caption"><span>IDEA → DESIGN → IMPLEMENTATION</span><span>可能性に、道筋を。</span></div>
        </div>
      </div>
      <a className="sv-scroll" href="#support"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></a>
    </SectionShell>
    <SectionShell id="support" tone="creamLight" topBorder>
      <div className="sv-section-head"><p className="sv-kicker">01 / OUR SERVICES</p><h2>どこからでも、<br/>変えられる。</h2><p>サービス名が分からなくても大丈夫。<br/>いま、変えたいことから選んでください。</p></div>
      <ServiceExplorer/>
    </SectionShell>
    <SectionShell id="approach" topBorder>
      <div className="sv-approach">
        <div><p className="sv-kicker">02 / OUR APPROACH</p><h2>つくる前も。<br/>つくった後も。</h2><p className="sv-body">必要なものを、一緒に見極める。<br/>小さく試し、現場で確かめる。<br/>使われるところまで、つなげていきます。</p><Link href="/works" className="sv-text-link">これまでにつくったもの <ArrowUpRight size={17}/></Link></div>
        <ol className="sv-process">{[
          ["Listen", "仕事を、知る。", "現場の流れと困りごとを整理。人が判断すること、AIに任せること、なくせる作業を見極めます。"],
          ["Build", "動く形で、試す。", "画面や試作品で具体化。実際に使う人の反応を確かめながら、必要な機能を実装します。"],
          ["Grow", "使いながら、育てる。", "導入後の運用と結果を確認。仕事に根づくよう、説明・改善・次の一手まで考えます。"],
        ].map(([en, title, body], i) => <li key={en}><span className="sv-step-no">0{i+1}</span><div><p className="sv-process-en">{en}</p><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
      </div>
    </SectionShell>
    <SectionShell id="questions" tone="creamLight" topBorder>
      <div className="sv-faq-layout"><div><p className="sv-kicker">03 / BEFORE WE TALK</p><h2>相談の、その前に。</h2></div><div className="sv-faq">{[
        ["何を頼むか、まだ決まっていません。", "いま困っていることや実現したいことからお聞かせください。現状を整理し、必要な支援範囲と進め方をご提案します。"],
        ["いま使っているツールも活かせますか？", "既存のシステムや運用を確認したうえで、連携・改善の方法を検討します。すべてを作り替える前提ではありません。"],
        ["費用と期間は、どのくらいですか？", "必要な機能、既存環境、支援範囲によって変わります。ご相談内容をもとに、実施内容・費用・進行計画を整理してご案内します。"],
        ["公開や導入後も相談できますか？", "更新や運用の支援もご相談いただけます。必要な体制と対応範囲を、実施前に一緒に確認します。"],
      ].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div>
    </SectionShell>
    <SectionShell id="conversation" topBorder>
      <div className="sv-contact"><p className="sv-kicker">LET’S MAKE IT HAPPEN</p><h2>「こうなったらいい」を、<br/>ここから。</h2><div><p>まだ、まとまっていなくても。<br/>いまの仕事と、これからのことを聞かせてください。</p><Link className="sv-button" href="/contact">相談をはじめる <ArrowUpRight size={20}/></Link></div><span className="sv-signature">Optimism,<br/><i>with a plan.</i></span></div>
    </SectionShell>
  </main>;
}
