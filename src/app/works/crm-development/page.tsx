import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterContact } from "@/components/site/WaterContact";
import { CrmScreen, crmScreens } from "@/components/site/CrmCaseCard";

export const metadata: Metadata = {
  title: "CRM・営業支援ツール — 開発事例",
  description: "実際に開発したCRMの商談パイプラインと顧客マスタを、実装画面で紹介。顧客情報・案件の進捗・次のアクションを見渡せる業務ツール。",
  alternates: { canonical: "/works/crm-development" },
  openGraph: { images: [{ url: crmScreens.pipeline.src, width: 1280, height: 720, alt: "CRM・営業支援ツールの実装画面" }] },
};

function ScreenFigure({ screen, title, children, preload = false }: { screen: keyof typeof crmScreens; title: string; children: React.ReactNode; preload?: boolean }) {
  return <figure className="crm-screen-figure">
    <a href={crmScreens[screen].src} target="_blank" rel="noopener noreferrer" aria-label={`${title}の画面を拡大して開く（別タブ）`}><CrmScreen screen={screen} preload={preload} /></a>
    <figcaption><strong>{title}</strong><span>{children}</span><a className="brand-text-link" href={crmScreens[screen].src} target="_blank" rel="noopener noreferrer">画面を拡大 <ArrowUpRight size={16} aria-hidden="true" /></a></figcaption>
  </figure>;
}

export default function CrmDevelopment() {
  return <main id="main" className="poster-page poster-case">
    <SectionShell>
      <Link className="brand-text-link" href="/works"><ArrowLeft size={16} />実績一覧へ</Link>
      <div className="case-title"><div><p className="case-kicker">SYSTEM / DEVELOPMENT</p><h1>CRM・営業支援</h1></div><p>商談の先まで、<br />見渡せるCRM。</p></div>
      <ScreenFigure screen="pipeline" title="01 / 商談パイプライン" preload>案件の段階・金額・担当・次のアクションを、ひとつのボードに。</ScreenFigure>
      <p className="case-disclosure">実際に開発したCRMの画面です。掲載にあたり、顧客名・金額・連絡先などは架空のサンプルデータに差し替えています。アプリの一般公開・利用受付は行っていません。</p>
    </SectionShell>
    <SectionShell topBorder>
      <div className="case-story"><aside><p className="water-page-kicker">Overview.</p><p>CRM / 業務アプリ開発</p></aside><div><h2>顧客と商談を、<br />同じ仕事の流れへ。</h2><p className="case-lead">顧客マスタと商談パイプラインを中心に、議事録やタスクを扱う業務アプリを開発。顧客情報を探すところから、案件の進捗と次の対応を確認するところまで、日々の営業活動に沿って画面を組み立てました。</p>
        {[
          ["案件の現在地と、次の対応を見渡す", "リード、ヒアリング、提案、クロージング、受注・失注をボードで表示。案件ごとに金額、担当、次のアクションを確認でき、ステージの更新にも対応しています。"],
          ["顧客情報を、探せる一覧にする", "会社名、連絡先、契約プラン、ステータス、月額売上を顧客マスタで管理。名前や会社名での検索、ステータスでの絞り込み、CSVの入出力を実装しています。"],
          ["チームの扱うサービスに合わせる", "サービス別の顧客・商談の切り替えを用意。顧客管理、商談、議事録、タスクへ共通のナビゲーションから移動できる構成です。"],
        ].map(([title, body], i) => <div className="case-point" key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}
      </div></div>
      <ScreenFigure screen="customers" title="02 / 顧客マスタ">検索・ステータスの絞り込みと、顧客情報を見渡せる一覧。</ScreenFigure>
      <p className="crm-screen-note">実装画面 / 掲載用サンプルデータ。表示されている数値は運用実績を示すものではありません。</p>
    </SectionShell>
    <WaterContact href="/contact?topic=crm#inquiry" note="いまの仕事の進め方から、一緒に整理します。"/>
  </main>;
}
