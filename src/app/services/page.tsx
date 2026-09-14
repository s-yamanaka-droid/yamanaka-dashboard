import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Process } from "@/components/site/Process";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceDepth, PeopleApproach } from "@/components/site/ServiceDepth";
import { SectionShell } from "@/components/primitives/SectionShell";
export const metadata:Metadata={title:"Services — AI導入・開発・Web制作",description:"AI導入と業務再設計、プロダクト開発、Webサイト・採用LP制作。Lakkanが構想から実装、運用まで伴走します。",alternates:{canonical:"https://lakkan-inc.vercel.app/services"}};
const services=[
 {id:"ai-operations",n:"01",en:"AI & Operations",title:"仕事の流れを、\nAIと組み直す。",body:"今の業務にAIを足すだけでなく、業務そのものを見直します。繰り返し作業を減らし、人の判断が必要なところに時間を使える形へ。",items:["業務ヒアリング・課題の整理","AIエージェント・業務自動化の設計と実装","AI活用研修・導入後の運用支援"],for:"AIを導入したいが、どこから始めればよいか分からない。",topic:"ai-consult"},
 {id:"product",n:"02",en:"Product Development",title:"そのアイデアを、\n使えるものに。",body:"必要な機能を見極め、小さく動くものから具体化します。AIプロダクトや業務ツールを、利用者の操作と運用まで含めて設計します。",items:["要件整理・画面設計・プロトタイプ","Webアプリケーション・業務ツールの開発","既存システムとの連携・改善"],for:"構想はある。実際に使えるサービスへ進めたい。",topic:"ai-consult"},
 {id:"digital",n:"03",en:"Digital Experience",title:"らしさを伝え、\n行動につなぐ。",body:"会社やサービスの強みを整理し、見た目と情報設計を一つに。企業への信頼、サービスへの関心、応募や問い合わせにつながる体験をつくります。",items:["コーポレートサイト・ブランドサイト","採用LP・サービスLP","モバイル対応・公開前検証・更新支援"],for:"会社の魅力が伝わるサイトに変えたい。",topic:"corp-site"},
];
export default function Services(){return <main id="main" className="new-site"><PageHero section="SERVICES" title="人と技術で、仕事を変える。" lede="人が足りないという課題に、業務の再設計・技術・人財支援を組み合わせて向き合います。"/><SectionShell id="people"><PeopleApproach/></SectionShell><SectionShell id="crm"><ServiceDepth kind="crm"/></SectionShell><SectionShell id="fde"><ServiceDepth kind="fde"/></SectionShell><div className="service-details">{services.map(s=><section className="service-detail" key={s.id} id={s.id}><div className="service-detail-title"><p className="eyebrow">{s.n} / {s.en}</p><h2>{s.title.split("\n").map(l=><span key={l}>{l}</span>)}</h2></div><div className="service-detail-copy"><p>{s.body}</p><ul>{s.items.map(i=><li key={i}><Check size={18}/>{i}</li>)}</ul><Link href={"/contact?topic="+s.topic} className="pill-button orange">この領域について相談<ArrowUpRight size={18}/></Link></div></section>)}</div><section className="site-section"><SectionHeading label="OUR PROCESS" title={<>一緒に考え、<br/>一緒に進める。</>}/><Process/></section></main>;}
