"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Check, Plus } from "lucide-react";

type Article = {title:string;category:string;image:string;link:string};
const steps = [
  {label:"理解する",title:"まず、現場へ。",text:"いつもの仕事を一緒にたどり、本当に解くべき課題を見つけます。",tags:["ヒアリング","業務の可視化","課題の整理"]},
  {label:"つくる",title:"小さく、動かす。",text:"使える試作品をつくり、現場の声を聞きながら磨いていきます。",tags:["プロトタイプ","実装","現場で検証"]},
  {label:"育てる",title:"使われて、その先へ。",text:"導入後の運用に寄り添い、仕事の変化に合わせて改善します。",tags:["運用","定着支援","継続的な改善"]},
];

export function ServiceScene({id,articles}:{id:string;articles:Article[]}) {
 const [organized,setOrganized]=useState(false);
 const [step,setStep]=useState(0);
 if(id==="luna") return <a className="service-scene luna-scene" href="https://lunatech-migration-guide.vercel.app" aria-label="Luna AIのサイトを見る"><div className="luna-scene-caption"><span>A mind of your own.</span><ArrowUpRight size={30}/></div><div className="luna-screenshot"><Image src="/works/luna-ai.jpg" width={1440} height={900} alt="Luna AIの公開サイト" sizes="(max-width: 700px) 90vw, 80vw" /></div><span className="scene-footnote">LUNA AI — BY LUNATECH</span></a>;
 if(id==="recruitment") return <div className="service-scene people-scene"><div className="people-orbits" aria-hidden="true"><div className="people-orbit orbit-person"><span>人</span><small>その人らしい未来</small></div><div className="people-orbit orbit-company"><span>事業</span><small>その会社らしい成長</small></div><span className="people-plus"><Plus size={32}/></span></div><p>いい出会いは、<br/><em>お互いの未来を変える。</em></p><span className="scene-footnote">PEOPLE MEET POSSIBILITY.</span></div>;
 if(id==="news") return <div className="service-scene news-scene">{articles.map(a=><a href={a.link} className="news-cover" key={a.link}><div className="news-image"><Image unoptimized src={a.image} alt="" width={720} height={480} sizes="(max-width:700px) 90vw, 30vw"/></div><span>{a.category}</span><h4>{a.title}</h4><span className="news-read">Read story <ArrowUpRight size={18}/></span></a>)}</div>;
 if(id==="crm") return <div className={`service-scene crm-scene ${organized?"is-organized":""}`}><div className="scene-toolbar"><span>THE WAY WE WORK</span><span>CRM / 業務フローのイメージ</span></div><div className="crm-workspace"><div className="crm-card"><span className="crm-icon">01</span><h4>顧客情報</h4><p>会話も、履歴も。</p><span className="crm-card-line"/><span className="crm-card-line short"/></div><ArrowRight className="crm-connector"/><div className="crm-card"><span className="crm-icon">02</span><h4>商談の進捗</h4><p>次の一手が見える。</p><span className="crm-card-line"/><span className="crm-card-line short"/></div><ArrowRight className="crm-connector"/><div className="crm-card"><span className="crm-icon">03</span><h4>次のアクション</h4><p>フォローを、確実に。</p><span className="crm-card-line"/><span className="crm-card-line short"/></div></div><div className="crm-bottom"><p aria-live="polite">{organized?"一つの流れで、仕事が進む。":"ばらばらの情報を、つながる仕事へ。"}</p><button aria-pressed={organized} onClick={()=>setOrganized(!organized)}>{organized?"もう一度見る":"情報をつなぐ"}{organized?<Check size={16}/>:<ArrowRight size={16}/>}</button></div></div>;
 return <div className="service-scene fde-scene"><div className="fde-top"><span>BUILD WITH YOU.</span><span>FDE / HOW WE WORK</span></div><div className="fde-switch" role="group" aria-label="FDEの進め方">{steps.map((s,i)=><button key={s.label} aria-pressed={step===i} onClick={()=>setStep(i)}><span>0{i+1}</span>{s.label}</button>)}</div><div className="fde-detail" key={step} aria-live="polite"><div className="fde-orbit" aria-hidden="true"><span>{String(step+1).padStart(2,"0")}</span></div><div><h4>{steps[step].title}</h4><p>{steps[step].text}</p><div className="fde-tags">{steps[step].tags.map(t=><span key={t}>{t}</span>)}</div></div></div></div>;
}
