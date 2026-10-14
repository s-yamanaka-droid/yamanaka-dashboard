import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterContact } from "@/components/site/WaterContact";
import { CrmDiagram } from "@/components/site/CrmCaseCard";

export const metadata: Metadata = {title:"CRM・営業支援ツール — 開発事例",description:"顧客情報、商談パイプライン、活動履歴、タスクをつなぐCRMの設計・開発事例。",alternates:{canonical:"/works/crm-development"}};
export default function CrmDevelopment(){
  return <main id="main" className="poster-page poster-case">
    <SectionShell><Link className="brand-text-link" href="/works"><ArrowLeft size={16}/>実績一覧へ</Link><div className="case-title"><div><p className="case-kicker">SYSTEM / DEVELOPMENT</p><h1>CRM・営業支援</h1></div><p>情報がつながる。<br/>次の仕事が見える。</p></div><CrmDiagram/><p className="case-disclosure">開発内容を紹介するページです。図は機能の構成を示しており、実際の顧客データや操作画面ではありません。アプリの一般公開・利用受付は行っていません。</p></SectionShell>
    <SectionShell topBorder><div className="case-story"><aside><p className="water-page-kicker">Overview.</p><p>CRM / 業務アプリ開発</p></aside><div><h2>点在する情報を、仕事の流れへ。</h2><p className="case-lead">顧客マスタ、商談パイプライン、議事録、タスクをひとつの業務アプリにまとめる開発。誰と何を話し、次に何をするのかを、個別の情報からたどれる構成です。</p>{[["顧客と商談を整理する","顧客情報と案件の進行状況を管理。商談をパイプラインで捉え、対応する案件を見渡せるようにします。"],["会話を、次の行動へ","議事録と活動履歴、タスクを同じ仕事の流れに配置。確認と対応を別々の道具で追いかける負担を減らす設計です。"],["業務に合わせて組み立てる","業界やチームごとに必要な項目、進め方、画面の構成を整理し、業務に沿ったCRMへつなげます。"]].map(([title,body],i)=><div className="case-point" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}</div></div></SectionShell>
    <WaterContact href="/contact?topic=crm#inquiry" note="いまの仕事の進め方から、一緒に整理します。"/>
  </main>;
}
