import { LiveWork } from "@/components/site/LiveWork";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterContact } from "@/components/site/WaterContact";
import { publicWorks, workNotes, workSupport, workScreens } from "@/lib/work-detail";
import { selectedWorks, workPresentationLabel } from "@/data/selected-works";

export const dynamicParams = false;
export function generateStaticParams(){return publicWorks.map(p=>({slug:p.id}));}
type Props = {params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const p=publicWorks.find(p=>p.id===slug);if(!p)return {};
 return {title:`${p.name} — 実績`,description:p.description,alternates:{canonical:`https://lakkan-inc.vercel.app/works/${p.id}`},openGraph:{title:`${p.name} — Lakkan`,description:p.description,images:[p.cover]}};
}
export default async function WorkDetail({params}:Props){
 const {slug}=await params;const p=publicWorks.find(p=>p.id===slug);if(!p)notFound();
 const notes=workNotes[p.id], support=workSupport(p.id), screen=workScreens[p.id];
 const related=selectedWorks.filter(item=>item.id!==p.id).slice(0,2);
 const kind=workPresentationLabel(p);
 return <main id="main" className="work-detail poster-page poster-case">
  <SectionShell id="work-detail-hero">
   <Link className="brand-text-link" href="/works"><ArrowLeft size={16}/> 実績一覧へ</Link>
   <div className="case-title"><div><p className="case-kicker">{kind}</p><h1>{p.name}</h1></div><p>{notes?.headline||p.description}</p></div>
   <div className="case-entry-links"><a className="brand-text-link" href="#work-screens">実際の画面を見る <ArrowRight size={17} aria-hidden="true" /></a><a className="brand-text-link" href={p.url} target="_blank" rel="noopener noreferrer">公開サイトへ <ArrowUpRight size={17} aria-hidden="true" /><span className="water-accessible-title">（別タブ）</span></a></div>
   <LiveWork project={p} priority/>
  </SectionShell>
  {screen && <SectionShell id="work-screens" topBorder>
   <div className="case-screen-heading"><p className="case-kicker">IN THE WORK / 公開画面</p><h2>{screen.title}</h2><p>キービジュアルの、その先へ。実装した画面から、制作のポイントを紹介します。</p></div>
   <figure className="case-screen" data-work-screen={p.id}>
    <a href={screen.src} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}の実画面を拡大して見る（別タブ）`}><Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(max-width:760px) calc(100vw - 44px), (max-width:1400px) calc(100vw - 112px), 1280px" quality={90}/></a>
    <figcaption><div><p>{screen.description}</p><span>公開画面 / 2026.10.20 撮影</span></div><div className="case-screen-actions"><a href={screen.src} target="_blank" rel="noopener noreferrer">画面を拡大 <ArrowUpRight size={16} aria-hidden="true" /><span className="water-accessible-title">（別タブ）</span></a><a href={screen.url} target="_blank" rel="noopener noreferrer">この画面をサイトで見る <ArrowUpRight size={16} aria-hidden="true" /><span className="water-accessible-title">（別タブ）</span></a></div></figcaption>
   </figure>
   {screen.note && <p className="case-disclosure">{screen.note}</p>}
  </SectionShell>}
  <SectionShell id="work-story" topBorder>
   <div className="case-story"><aside><p className="water-page-kicker">Overview.</p><dl><div><dt>名称</dt><dd>{p.client}</dd></div><div><dt>区分</dt><dd>{kind}</dd></div><div><dt>テーマ</dt><dd>{p.tags.slice(0,2).join(" / ")}</dd></div></dl><a className="brand-text-link" href={p.url} target="_blank" rel="noopener noreferrer">公開サイトを見る <ArrowUpRight size={18}/><span className="water-accessible-title">（別タブ）</span></a></aside>
    <div><h2>この制作で、大切にしたこと。</h2><p className="case-lead">{notes?.theme||p.description}</p>
     {screen && <ul className="case-focus" aria-label="制作の焦点">{screen.focus.map(item=><li key={item}>{item}</li>)}</ul>}
     {notes?.points.map(([title,body],i)=><div className="case-point" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}
     <div className="case-support"><p>関連する支援</p><Link href={`/services#${support.id}`}>{support.label} <ArrowUpRight size={18}/></Link><Link href={`/contact?topic=${support.topic}&project=${p.id}`}>この実績を見て相談する <ArrowRight size={18}/></Link></div>
    </div>
   </div>
  </SectionShell>
  <SectionShell id="related-work" topBorder><div className="water-editorial-label"><h2>More work.</h2><Link href="/works">すべての実績 <ArrowUpRight size={18}/></Link></div><div className="case-related">{related.map(item=><Link href={`/works/${item.id}`} key={item.id}><Image src={item.cover} alt={item.coverAlt} width={720} height={480} sizes="(max-width:760px) 100vw, 45vw"/><h3>{item.name}<ArrowUpRight size={18}/></h3><p>{item.workType==="ai-concept"?"コンセプト作品":item.client}</p></Link>)}</div></SectionShell>
  <WaterContact href={`/contact?topic=${support.topic}&project=${p.id}`} note={`${p.name}のような制作についても、お気軽にご相談ください。`}/>
 </main>;
}
