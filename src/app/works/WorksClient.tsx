"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import data from "@/data/projects.json";
import type { Project } from "@/types";
import styles from "./gallery.module.css";

const filters = [["all", "すべて"], ["client", "クライアントワーク"], ["own", "プロダクト・共同事業"], ["ai-concept", "コンセプト作品"]];
const order = ["central-medical", "luna-ai", "plime-recruit", "lia-recruit", "now-on-air", "luna-reception", "reskilllab-lunatech", "atelier-patterns", "aura-ai-concept", "salon-solna-ai-concept"];
const projects = [...data as Project[]].sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
function label(p: Project) {
  return p.workType === "client" ? "クライアントワーク" : p.workType === "ai-concept" ? "コンセプト作品 / 架空ブランド" : "プロダクト・共同事業";
}

function ProjectView({project:p, featured=false}: {project:Project; featured?:boolean}) {
  return <article className={featured ? styles.featured : styles.project}>
    <a className={styles.visual} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}の公開サイトを見る（別タブ）`}>
      <Image src={p.cover || "/og.png"} alt={p.coverAlt || `${p.name}の公開画面`} width={1440} height={960} sizes={featured ? "(max-width:760px) 100vw, 65vw" : "(max-width:760px) 100vw, 50vw"} priority={featured}/>
      <span className={styles.open} aria-hidden="true"><ArrowUpRight size={22}/></span>
    </a>
    <div className={styles.caption}>
      <p className={styles.category}>{label(p)}</p>
      <h2><a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}<ArrowUpRight size={22}/></a></h2>
      <p className={styles.client}>{p.client}</p>
      <p className={styles.description}>{p.description}</p>
      <p className={styles.scope}>{p.tags.slice(0,2).join(" / ")}</p>
      {featured && <a className={styles.siteLink} href={p.url} target="_blank" rel="noopener noreferrer">公開サイトを見る <ArrowUpRight size={18}/><span className={styles.srOnly}>（別タブ）</span></a>}
    </div>
  </article>;
}

export function WorksClient() {
  const [filter,setFilter] = useState("all");
  const visible = projects.filter(p=>filter === "all" || p.workType === filter);
  return <main id="main" className={styles.page}>
    <SectionShell id="works-gallery">
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>制作実績</p><h1>アイデアを、<br className={styles.mobileBreak}/>使えるかたちに。</h1></div>
        <p className={styles.intro}>Webサイトから、AIと業務の仕組みまで。<br/>Lakkanが手がけた、公開中の仕事をご紹介します。</p>
      </header>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="実績を種類で絞り込む">{filters.map(([id,name])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{name}</button>)}</div>
        <p className={styles.count} role="status">{visible.length} 件</p>
      </div>
      {filter === "ai-concept" && <p className={styles.note}>架空のブランドを題材にした制作実験です。実在企業からの受託実績ではありません。</p>}
      {visible[0] && <ProjectView key={`featured-${visible[0].id}`} project={visible[0]} featured/>}
      <div className={styles.grid}>{visible.slice(1).map(p=><ProjectView key={p.id} project={p}/>)}</div>
      <div className={styles.closing}><div><p className={styles.eyebrow}>次は、あなたの事業で。</p><h2>つくりたいものからでも、<br/>困っていることからでも。</h2></div><Link href="/contact">制作について相談する <ArrowRight size={20}/></Link></div>
    </SectionShell>
  </main>;
}
