import { LiveWork } from "@/components/site/LiveWork";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterContact } from "@/components/site/WaterContact";
import { publicWorks, workNotes, workSupport } from "@/lib/work-detail";

export const dynamicParams = false;
export function generateStaticParams(){return publicWorks.map(p=>({slug:p.id}));}
type Props = {params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const p=publicWorks.find(p=>p.id===slug);if(!p)return {};
 return {title:`${p.name} — 実績`,description:p.description,alternates:{canonical:`https://lakkan-inc.vercel.app/works/${p.id}`},openGraph:{title:`${p.name} — Lakkan`,description:p.description,images:[p.cover]}};
}
export default async function WorkDetail({params}:Props){
 const {slug}=await params;const p=publicWorks.find(p=>p.id===slug);if(!p)notFound();
 const notes=workNotes[p.id], support=workSupport(p.id);
 const related=publicWorks.filter(item=>item.id!==p.id&&workSupport(item.id).id===support.id).slice(0,2);
 const kind=p.workType==="client"?"クライアントワーク":p.workType==="ai-concept"?"コンセプト作品 / 架空ブランド":"プロダクト・共同事業";
 return <main id="main" className="work-detail">
  <SectionShell id="work-detail-hero">
   <Link className="brand-text-link" href="/works"><ArrowLeft size={16}/> 実績一覧へ</Link>
   <div className="case-title"><div><p className="case-kicker">{kind}</p><h1>{p.name}</h1></div><p>{notes?.headline||p.description}</p></div>
   {p.workType==="ai-concept"&&<p className="case-disclosure">架空のブランドを題材にした自主制作です。実在企業からの受託実績ではありません。</p>}
   <LiveWork project={p} priority/>
  </SectionShell>
  <SectionShell id="work-story" topBorder>
   <div className="case-story"><aside><p className="water-page-kicker">Overview.</p><dl><div><dt>名称</dt><dd>{p.client}</dd></div><div><dt>区分</dt><dd>{kind}</dd></div><div><dt>テーマ</dt><dd>{p.tags.slice(0,2).join(" / ")}</dd></div></dl><a className="brand-text-link" href={p.url} target="_blank" rel="noopener noreferrer">公開サイトを見る <ArrowUpRight size={18}/><span className="water-accessible-title">（別タブ）</span></a></aside>
    <div><h2>{notes?"取り組みのテーマ":"この制作について"}</h2><p className="case-lead">{notes?.theme||p.description}</p>
     {notes?.points.map(([title,body],i)=><div className="case-point" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}
     <div className="case-support"><p>関連する支援</p><Link href={`/services#${support.id}`}>{support.label} <ArrowUpRight size={18}/></Link><Link href={`/contact?topic=${support.topic}&project=${p.id}`}>この実績を見て相談する <ArrowRight size={18}/></Link></div>
    </div>
   </div>
  </SectionShell>
  <SectionShell id="related-work" topBorder><div className="water-editorial-label"><h2>More work.</h2><Link href="/works">すべての実績 <ArrowUpRight size={18}/></Link></div><div className="case-related">{related.map(item=><Link href={`/works/${item.id}`} key={item.id}><Image src={item.cover} alt={item.coverAlt} width={720} height={480} sizes="(max-width:760px) 100vw, 45vw"/><h3>{item.name}<ArrowUpRight size={18}/></h3><p>{item.workType==="ai-concept"?"コンセプト作品":item.client}</p></Link>)}</div></SectionShell>
  <WaterContact href={`/contact?topic=${support.topic}&project=${p.id}`} note={`${p.name}のような制作についても、お気軽にご相談ください。`}/>
 </main>;
}
