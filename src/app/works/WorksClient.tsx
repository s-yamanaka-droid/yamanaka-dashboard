"use client";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { WorkCard } from "@/components/site/WorkCard";
import data from "@/data/projects.json";
import type { Project } from "@/types";
const filters=[["all","すべて"],["client","実案件"],["own","プロダクト・共同事業"],["ai-concept","コンセプト作品"]];
export function WorksClient(){const [filter,setFilter]=useState("all");const projects=(data as Project[]).filter(p=>filter==="all"||p.workType===filter);return <main id="main" className="new-site"><PageHero section="SELECTED WORK / PORTFOLIO" title="つくったものが、私たち。" lede="クライアントの仕事、プロダクト、未来のための実験。公開中の実画面から、Lakkanの仕事をご覧ください。"/><section className="site-section works-page"><div className="work-filters" aria-label="実績の種類">{filters.map(([id,label])=><button key={id} aria-pressed={id===filter} onClick={()=>setFilter(id)}>{label}</button>)}<span aria-live="polite">{projects.length} projects</span></div>{filter==="ai-concept"&&<p className="concept-note">コンセプト作品は、架空のブランドを題材にした制作実験です。実在企業からの受託実績ではありません。</p>}<div className="work-grid">{projects.map(p=><WorkCard key={p.id} project={p}/>)}</div></section></main>;}
