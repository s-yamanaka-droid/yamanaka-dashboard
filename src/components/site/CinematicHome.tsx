import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { BrandFilm } from "./BrandFilm";
import data from "@/data/projects.json";

const featured=['central-medical','luna-ai','plime-recruit'];
const offerings=[
 ['AI導入・業務改善','繰り返す作業を見直し、人が判断に集中できる仕事へ。','ai-operations'],
 ['CRM・システム開発','情報と仕事の流れをつなぐ、現場に合った仕組みを。','crm'],
 ['Web・デザイン','事業の魅力を整理し、理解と行動につながる体験へ。','digital'],
 ['採用・人財支援','必要な仕事と役割から、人と組織のあり方を考える。','people'],
];

export function CinematicHome(){return <main id="main" className="brand-home">
  <SectionShell id="brand-hero">
    <BrandFilm/>
    <div className="brand-hero-copy"><p className="brand-label">Lakkan — 楽観を、動かす。</p><h1>楽観と、<br/>計画と。</h1><p className="brand-hero-lead">ばらばらを、可能性に。</p><p className="brand-hero-description">AIとデザイン、そして実装。<br/>アイデアを、事業が動き出す仕組みへ。</p><Link className="brand-light-link" href="/works">公開実績を見る <ArrowUpRight size={20}/></Link></div>
    <p className="brand-hero-foot">違いがつながると、次が生まれる。</p>
  </SectionShell>
  <SectionShell id="brand-intro" topBorder>
    <div className="brand-intro-grid"><p className="brand-label">私たちの考え方</p><div><h2>「できたらいい」を、<br/>「できる」に変えていく。</h2><p>仕事も、情報も、アイデアも。<br/>つながり方を変えると、新しい可能性が見えてくる。<br/>Lakkanは業務の整理から、設計・開発・運用まで、<br className="brand-desktop-break"/>事業を前に進める仕組みを一緒につくります。</p><Link className="brand-text-link" href="/about">Lakkanについて <ArrowUpRight size={18}/></Link></div></div>
  </SectionShell>
  <SectionShell id="brand-work" topBorder>
    <div className="brand-section-heading"><div><p className="brand-label">制作実績</p><h2>可能性が、かたちになった仕事。</h2></div><Link className="brand-text-link" href="/works">すべての実績 <ArrowRight size={18}/></Link></div>
    <div className="brand-work-grid">{featured.map(id=>{const p=data.find(p=>p.id===id)!;return <article key={p.id}><a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}の公開サイトを見る（別タブ）`}><Image src={p.cover} alt={p.coverAlt} width={1440} height={960} sizes="(max-width:760px) 100vw, 33vw"/><div><h3>{p.name}</h3><ArrowUpRight size={20}/></div></a><p>{p.tags[0]} / {p.client}</p></article>;})}</div>
  </SectionShell>
  <SectionShell id="brand-services" tone="creamLight" topBorder>
    <div className="brand-section-heading"><div><p className="brand-label">できること</p><h2>課題から考え、必要なものをつくる。</h2></div></div>
    <div className="brand-service-list">{offerings.map(([title,text,id])=><Link key={id} href={`/services#${id}`}><h3>{title}</h3><p>{text}</p><ArrowUpRight size={22}/></Link>)}</div>
  </SectionShell>
  <SectionShell id="brand-contact" topBorder><div className="brand-closing"><div><p className="brand-label">一緒に、次の一歩を。</p><h2>まだ、まとまっていなくても。</h2><p>いま困っていること、これから実現したいことを聞かせてください。</p></div><Link className="brand-button" href="/contact">相談をはじめる <ArrowUpRight size={20}/></Link></div></SectionShell>
</main>;}
