import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";

export function workLabel(p:Project){return p.workType==="client"?"CLIENT WORK":p.workType==="ai-concept"?"CONCEPT STUDY":p.client==="LunaTech"?"LUNATECH PROJECT":"LAKKAN PROJECT";}
export function WorkCard({project:p,priority=false}:{project:Project;priority?:boolean}){
 return <article className="work-card"><a className="work-visual" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name+"の公開サイトを開く（別タブ）"}><Image src={p.cover || "/og.png"} alt={p.coverAlt || p.name+"の公開画面"} width={1440} height={900} sizes="(max-width: 640px) 100vw, 50vw" priority={priority}/><span className="work-open"><ArrowUpRight size={24}/></span><span className="work-visual-caption">VIEW LIVE SITE ↗</span></a><div className="work-meta"><span>{workLabel(p)}</span><span>{p.client}</span></div><h3><a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}<ArrowUpRight size={20}/></a></h3><p>{p.description}</p><div className="work-tags">{p.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div></article>;
}
