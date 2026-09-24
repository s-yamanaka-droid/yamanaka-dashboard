import Link from "next/link";
import { LiveWork } from "./LiveWork";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterAssembly } from "./WaterAssembly";
import { WaterContact } from "./WaterContact";
import { BrandHeading } from "./BrandHeading";
import data from "@/data/projects.json";

const featured=['luna-ai','central-medical','plime-recruit'];
const offerings=[
 ['AI導入・業務改善','繰り返す作業を見直し、人が判断に集中できる仕事へ。','ai-operations','Rethink.'],
 ['CRM・システム開発','情報と仕事の流れをつなぐ、現場に合った仕組みを。','crm','Connect.'],
 ['Web・デザイン','事業の魅力を整理し、理解と行動につながる体験へ。','digital','Create.'],
 ['採用・人財支援','必要な仕事と役割から、人と組織のあり方を考える。','people','Grow.'],
];

export function CinematicHome(){return <main id="main" className="brand-home brand-home-latin water-edition">
  <SectionShell id="brand-hero">
    <div className="water-hero-top"><h1>ばらばらを、<br/>可能性に。</h1><p>業務の見直しから、システム、Web、人と組織まで。<br/>一緒に考え、動くところまでつくる。</p></div>
    <WaterAssembly/>
    <div className="water-hero-caption"><p><span className="water-live-dot"/>ひとつの形に、とらわれない。</p><Link href="/works">私たちの仕事 <ArrowUpRight size={18}/></Link></div>
  </SectionShell>
  <SectionShell id="brand-intro" topBorder>
    <div className="water-editorial-label"><span>Our attitude</span><p>私たちの考え方</p></div><div className="water-intro-main"><BrandHeading>{"まだ、かたちのない\n可能性から。"}</BrandHeading><div><p>「こんなこと、できるかな。」<br/>そのひと言から、はじめたい。</p><p>仕事の流れを変える。新しい体験をつくる。<br/>Lakkanは、一緒に考えながら、<br/>動くところまでつくります。</p><Link className="brand-text-link" href="/about">Lakkanについて <ArrowUpRight size={18}/></Link></div></div>
  </SectionShell>
  <SectionShell id="brand-work" topBorder>
    <div className="water-editorial-label"><h2>Selected work<span className="water-period">.</span></h2><p>公開中の仕事</p></div>
    <div className="water-projects">{featured.map((id,index)=>{const p=data.find(p=>p.id===id)!;return <article key={p.id} className={`water-project water-project-${index}`}><LiveWork project={p}/><div className="water-project-caption"><div><h3><Link href={`/works/${p.id}`}>{p.name}<ArrowUpRight size={20}/></Link></h3><p>{p.client} · {p.workType==='client'?'クライアントワーク':'プロダクト・共同事業'}</p></div><p>{p.tags[0]}</p></div><p className="water-project-summary">{p.description}</p></article>;})}</div>
    <Link className="water-all-work" href="/works"><span>More possibilities</span><span>すべての実績 <ArrowRight size={24}/></span></Link>
  </SectionShell>
  <SectionShell id="brand-services" tone="creamLight" topBorder>
    <div className="water-editorial-label"><span>What we do</span><p>できること</p></div><div className="water-services-heading"><BrandHeading>{"頭はやわらかく。\n実装は、しっかりと。"}</BrandHeading></div>
    <div className="water-offerings">{offerings.map(([title,text,id,en])=><Link key={id} href={`/services#${id}`}><span className="water-offering-en">{en}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={24}/></Link>)}</div>
  </SectionShell>
  <SectionShell id="home-process" topBorder><div className="water-editorial-label"><h2>How we work.</h2><p>一緒に進める方法</p></div><ol className="home-process-list">{[
   ['Listen','まず、話す。','いまの困りごとと、目指したい状態を聞く。'],
   ['Design','道筋をつくる。','仕事の流れと、必要な支援を整理する。'],
   ['Build','かたちにする。','試作品で確かめ、使えるものへ育てる。'],
   ['Grow','使って、磨く。','導入後の反応を見ながら改善を重ねる。'],
  ].map(([en,title,body],i)=><li key={en}><span className="home-step">0{i+1} / {en}</span><h3>{title}</h3><p>{body}</p></li>)}</ol><Link className="brand-text-link" href="/services#approach">支援の進め方を見る <ArrowUpRight size={18}/></Link></SectionShell>
  <SectionShell id="home-about" topBorder><div className="water-editorial-label"><h2>About Lakkan.</h2><p>私たちについて</p></div><div className="home-about-body"><BrandHeading>{"人と、仕事と、\nその先の可能性。"}</BrandHeading><div><p>技術で変えられること。人が力を発揮できること。<br/>ひとつの方法にとらわれず、事業の課題に向き合います。</p><Link className="brand-text-link" href="/about">考え方と会社情報 <ArrowUpRight size={18}/></Link></div></div></SectionShell>
  <WaterContact/>
</main>;}
