import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LightField } from "@/components/site/LightField";
import { WorkCard } from "@/components/site/WorkCard";
import { Process } from "@/components/site/Process";
import { SectionHeading } from "@/components/site/SectionHeading";
import projects from "@/data/projects.json";
import type { Project } from "@/types";

const work = projects as Project[];
export default function Home() {
 return <main id="main" className="new-site">
  <section className="home-hero" id="home-hero">
   <LightField/>
   <div className="hero-caption"><span>INDEPENDENT AI & DIGITAL STUDIO</span><span>TOKYO, JAPAN</span></div>
   <div className="hero-content"><p className="eyebrow">LAKKAN INC.</p><h1><span>楽観と、</span><span>計画と。</span></h1><div className="hero-baseline"><div><p className="hero-description">AIで、仕事の可能性をひらく。<br/>構想から実装、その先の運用まで。</p><div className="hero-actions"><Link className="pill-button orange" href="/contact">相談をはじめる<span className="button-orb"><ArrowUpRight size={20}/></span></Link><Link className="text-link" href="#selected-work">つくったものを見る<ArrowDown size={16}/></Link></div></div><p className="hero-side">A little optimism.<br/>A deliberate plan.<br/><em>Something real.</em></p></div></div>
   <div className="hero-bottom"><span>STRATEGY · PRODUCT · EXPERIENCE</span><a href="#selected-work" aria-label="実績へスクロール"><ArrowDown size={18}/></a></div>
  </section>
  <section className="site-section selected-section" id="selected-work">
   <SectionHeading label="SELECTED WORK" title={<>アイデアは、<br/>動いてこそ。</>}><p>AIプロダクトから、ブランドのWebサイトまで。<br/>私たちが形にしてきた仕事の一部です。</p></SectionHeading>
   <div className="work-grid">{["luna-ai","central-medical","lia-recruit","now-on-air"].map(id=><WorkCard key={id} project={work.find(p=>p.id===id)!}/>)}</div>
   <div className="section-end"><p>実案件、プロダクト、そして実験。</p><Link href="/works" className="pill-button outline">すべての実績を見る<span className="button-orb"><ArrowUpRight size={18}/></span></Link></div>
  </section>
  <section className="site-section service-section" id="capabilities">
   <SectionHeading label="WHAT WE DO" title={<>つくる前から、<br/>動いたあとまで。</>}><p>ツールを増やすことが目的ではありません。<br/>事業と仕事が前に進む形を、一緒に考えます。</p></SectionHeading>
   <div className="service-list">{[
    ["01","AI & Operations","AI導入・業務再設計","人にしかできない仕事へ、時間を戻す。業務の流れを見直し、AIエージェントや自動化を現場につなぎます。","ai-operations"],
    ["02","Product Development","プロダクト開発","アイデアを、使えるサービスへ。業務ツールやAIプロダクトを、設計・実装・改善まで一貫してつくります。","product"],
    ["03","Digital Experience","Webサイト・採用体験","らしさが伝わり、次の行動につながる。コーポレートサイトや採用LPを、情報設計から制作します。","digital"],
   ].map(([n,en,jp,body,id])=><Link href={"/services#"+id} className="service-row" key={n}><span className="service-index">{n}</span><div><span className="service-en">{en}</span><h3>{jp}</h3></div><p>{body}</p><ArrowUpRight className="service-arrow" size={28}/></Link>)}</div>
  </section>
  <section className="product-feature" id="luna">
   <div className="product-copy"><p className="eyebrow light">FEATURED PRODUCT / LUNATECH</p><h2>あなたと働き、<br/>あなた専用に<br/><em>育つAI。</em></h2><p>判断、言葉、仕事の経験を蓄積する。<br/>Luna AIは、使うほどにあなたを理解する<br/>AIの右腕を届けるサービスです。</p><a href="https://lunatech-migration-guide.vercel.app" target="_blank" rel="noopener noreferrer" className="pill-button pale">Luna AIを知る<span className="button-orb"><ArrowUpRight size={18}/></span></a><small>LunaTechのサービスとして提供しています。</small></div>
   <a className="product-screen" href="https://lunatech-migration-guide.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Luna AIの公開サイトへ（別タブ）"><div className="screen-toolbar"><span/><span/><span/><p>Luna AI</p></div><Image src="/works/luna-ai.jpg" alt="Luna AIの公開サイトの実画面" width={1440} height={900} sizes="(max-width: 900px) 90vw, 60vw"/><div className="screen-caption"><span>PERSONAL INTELLIGENCE</span><ArrowUpRight size={22}/></div></a>
  </section>
  <section className="site-section"><SectionHeading label="HOW WE WORK" title={<>小さく確かめ、<br/>大きく育てる。</>}/><Process/></section>
  <section className="studio-statement"><p className="eyebrow light">THE LAKKAN MINDSET</p><div className="statement-line"><span>Optimism,</span><span>with a plan<span className="orange-dot">.</span></span></div><div className="statement-bottom"><h2>できると信じる。<br/>できる形をつくる。</h2><div><p>可能性に心を躍らせる楽観と、<br/>現実を一歩ずつ進める計画。<br/>Lakkanは、その両方を大切にする会社です。</p><Link href="/about" className="text-link">私たちについて<ArrowUpRight size={18}/></Link></div></div></section>
 </main>;
}
