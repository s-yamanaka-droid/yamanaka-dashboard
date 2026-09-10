import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Process } from "@/components/site/Process";
import { SectionHeading } from "@/components/site/SectionHeading";
export const metadata:Metadata={title:"Services — AI導入・開発・Web制作",description:"AI導入と業務再設計、プロダクト開発、Webサイト・採用LP制作。Lakkanが構想から実装、運用まで伴走します。",alternates:{canonical:"https://lakkan-inc.vercel.app/services"}};
const services=[
 {id:"ai-operations",n:"01",en:"AI & Operations",title:"仕事の流れを、\nAIと組み直す。",body:"今の業務にAIを足すだけでなく、業務そのものを見直します。繰り返し作業を減らし、人の判断が必要なところに時間を使える形へ。",items:["業務ヒアリング・課題の整理","AIエージェント・業務自動化の設計と実装","AI活用研修・導入後の運用支援"],for:"AIを導入したいが、どこから始めればよいか分からない。",topic:"ai-consult"},
 {id:"product",n:"02",en:"Product Development",title:"そのアイデアを、\n使えるものに。",body:"必要な機能を見極め、小さく動くものから具体化します。AIプロダクトや業務ツールを、利用者の操作と運用まで含めて設計します。",items:["要件整理・画面設計・プロトタイプ","Webアプリケーション・業務ツールの開発","既存システムとの連携・改善"],for:"構想はある。実際に使えるサービスへ進めたい。",topic:"ai-consult"},
 {id:"digital",n:"03",en:"Digital Experience",title:"らしさを伝え、\n行動につなぐ。",body:"会社やサービスの強みを整理し、見た目と情報設計を一つに。企業への信頼、サービスへの関心、応募や問い合わせにつながる体験をつくります。",items:["コーポレートサイト・ブランドサイト","採用LP・サービスLP","モバイル対応・公開前検証・更新支援"],for:"会社の魅力が伝わるサイトに変えたい。",topic:"corp-site"},
];
export default function Services(){return <main id="main" className="new-site"><PageHero section="SERVICES" title="可能性を、実装する。" lede="考える。つくる。動かす。事業と現場をつなぐ、Lakkanの3つの領域。"/><div className="service-details">{services.map(s=><section className="service-detail" key={s.id} id={s.id}><div className="service-detail-title"><p className="eyebrow">{s.n} / {s.en}</p><h2>{s.title.split("\n").map(l=><span key={l}>{l}</span>)}</h2><div className={"service-graphic graphic-"+s.n} aria-hidden="true"><i/><i/><i/><i/></div></div><div className="service-detail-copy"><p>{s.body}</p><ul>{s.items.map(i=><li key={i}><Check size={18}/>{i}</li>)}</ul><aside><span>こんなときに</span><p>{s.for}</p></aside><Link href={"/contact?topic="+s.topic} className="pill-button orange">この領域について相談<span className="button-orb"><ArrowUpRight size={18}/></span></Link></div></section>)}</div><section className="site-section"><SectionHeading label="OUR PROCESS" title={<>一緒に考え、<br/>一緒に進める。</>}/><Process/><div className="service-note"><h3>費用・スケジュールについて</h3><p>目的、必要な機能、既存の環境を確認して、進め方とお見積もりをご提案します。要件が固まっていない段階でもご相談いただけます。</p></div></section></main>;}
