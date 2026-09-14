import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import news from "../../public/now-on-air/index.json";

const services=[
 {id:"recruitment",label:"仕事と採用を見直す",title:"必要な仕事から、\n必要な人財を考える。",text:"人手不足の原因を業務の流れから整理。技術で減らせる負担と、人が担う役割を分け、採用要件の見直しから人材紹介までつなぎます。",href:"/services#people",tags:"業務の整理 / 採用設計 / 人財支援"},
 {id:"crm",label:"CRM構築",title:"顧客の情報を、\n次の行動につなぐ。",text:"顧客情報、商談の進捗、次の連絡を一つの流れに。現場に合う画面と運用を設計し、連絡漏れや引き継ぎの負担を減らします。",href:"/services#crm",tags:"顧客管理 / 営業フロー / AIによる入力補助"},
 {id:"fde",label:"FDE・開発伴走",title:"現場で見つけて、\n動く仕組みにする。",text:"エンジニアが現場に入り、仕事を理解するところから伴走。小さな試作、開発、既存ツールとの連携、導入後の改善まで進めます。",href:"/services#fde",tags:"業務アプリ / AI連携 / 運用・定着"}
];
export default function Home(){
 return <main id="main" className="journal-home">
  <SectionShell id="approach"><div className="journal-lead">
   <div className="journal-lead-copy"><p className="journal-label">人と技術で、事業の次へ。</p><h1><span>人が足りない。</span><span>その先を、</span><span>人と技術で変える。</span></h1><p className="journal-lede">仕事の流れを見直す。技術で負担を減らす。<br/>人が力を発揮できる役割と、採用を考える。<br/>そのつながりまで、Lakkanの仕事です。</p><Link className="journal-link" href="/contact">課題を相談する<ArrowUpRight size={20}/></Link></div>
   <figure className="journal-cover"><Image src="/prisma-poster.jpg" alt="" width={1200} height={1000} priority sizes="(max-width: 760px) 100vw, 45vw"/><figcaption><span>LAKKAN / OUR APPROACH</span><p>人の可能性と、<br/>テクノロジーの可能性。</p></figcaption></figure>
  </div><div className="journal-principle"><h2>採用も、技術も。<br/>事業から考える。</h2><p>「人を増やす」「AIを入れる」を決める前に、どこで仕事が止まり、何に時間を使っているかを整理します。業務の再設計、技術の実装、人財支援を組み合わせて、現場が動く形をつくります。</p></div></SectionShell>
  <SectionShell id="services"><div className="journal-section-title"><span>できること</span><h2>課題に合わせて、支援をつなぐ。</h2></div><div className="journal-services">{services.map((s,i)=><article id={s.id} key={s.id}><div className="journal-service-label"><span>0{i+1}</span><h3>{s.label}</h3></div><h4>{s.title.split("\n").map(x=><span key={x}>{x}</span>)}</h4><p>{s.text}</p><small>{s.tags}</small><Link className="journal-link" href={s.href}>図解と支援内容を見る<ArrowUpRight size={18}/></Link></article>)}</div><div className="journal-luna" id="luna"><div><span className="journal-label">日々の仕事を支えるAI</span><h3>Luna AI</h3></div><p>日々の判断や経験を引き継ぎ、あなたと働くAIの右腕。業務の見直しとあわせて、導入・活用をご案内します。<small>LunaTechのサービスです。</small></p><a className="journal-link" href="https://lunatech-migration-guide.vercel.app">Luna AIを知る<ArrowUpRight size={18}/></a></div></SectionShell>
  <SectionShell id="news"><div className="journal-section-title"><span>News / Now on AIr</span><h2>変化を知り、次の仕事を考える。</h2></div><div className="journal-news">{news.articles.slice(0,4).map(a=><a href={a.link} key={a.link}><span className="journal-label">{a.category}</span><h3>{a.title}</h3><p>{a.lede}</p><span className="journal-read">記事を読む<ArrowRight size={17}/></span></a>)}</div><a className="journal-link journal-news-more" href="https://nowonair.vercel.app/">Now on AIrですべて読む<ArrowUpRight size={18}/></a></SectionShell>
  <SectionShell id="consult"><div className="journal-consult"><span className="journal-label">まずは、仕事の話から。</span><h2>何を変えるか、<br/>一緒に整理しませんか。</h2><p>採用する職種も、導入するツールも、まだ決まっていなくて大丈夫です。<br/>今の仕事と、実現したいことを聞かせてください。</p><Link className="journal-link" href="/contact">相談をはじめる<ArrowUpRight size={20}/></Link></div></SectionShell>
 </main>;
}
