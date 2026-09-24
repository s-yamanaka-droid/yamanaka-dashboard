"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./live-work.module.css";

// Only public sites whose frame policy has been checked. Do not proxy blocked sites.
const embeds: Record<string, string> = {
  "central-medical": "https://lakkan-central-medical.vercel.app/",
  "lia-recruit": "https://lia-recruit.vercel.app/",
  "now-on-air": "https://nowonair.vercel.app/",
  "reskilllab-lunatech": "https://lunatech-ai-lab.vercel.app/",
  "luna-reception": "https://luna-receptionist.vercel.app/",
  "luna-ai": "https://luna-tech-public-site.vercel.app/",
  "plime-recruit": "https://plime-recruit.vercel.app/",
  "aura-ai-concept": "https://aura-beta-snowy.vercel.app/",
  "salon-solna-ai-concept": "https://salon-solna.vercel.app/",
  "atelier-patterns": "/atelier/fluid",
};
type Props = {project:{id:string;name:string;url?:string;cover?:string;coverAlt?:string};priority?:boolean};

export function LiveWork({project:p,priority=false}:Props){
  const host=useRef<HTMLDivElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  const [visible,setVisible]=useState(false);
  const [ready,setReady]=useState(false);
  const [active,setActive]=useState(false);
  const [failed,setFailed]=useState(false);
  const [slow,setSlow]=useState(false);
  const [reduced,setReduced]=useState(true);
  const src=embeds[p.id];
  const mount=!!src&&!failed&&(active||(visible&&!reduced));
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>setReduced(media.matches);sync();media.addEventListener('change',sync);
    const observer=new IntersectionObserver(([entry])=>{
      setVisible(entry.isIntersecting);
      if(!entry.isIntersecting){setActive(false);setReady(false);}
    },{threshold:.05});
    if(host.current)observer.observe(host.current);
    const other=(event:Event)=>{if((event as CustomEvent).detail!==host.current)setActive(false);};
    window.addEventListener('lakkan-work-active',other);
    return()=>{observer.disconnect();media.removeEventListener('change',sync);window.removeEventListener('lakkan-work-active',other);};
  },[]);
  useEffect(()=>{
    if(!mount||ready)return;
    const timer=setTimeout(()=>setSlow(true),15000);
    return()=>clearTimeout(timer);
  },[mount,ready]);
  function interact(){
    if(active){setActive(false);toggle.current?.focus();return;}
    window.dispatchEvent(new CustomEvent('lakkan-work-active',{detail:host.current}));setActive(true);
  }
  return <div ref={host} className={styles.work} data-live-work={p.id}>
    <div className={styles.viewport}>
      <Image className={styles.cover} src={p.cover||'/og.png'} alt={p.coverAlt||`${p.name}の公開画面`} fill sizes="(max-width:760px) 100vw, 75vw" priority={priority}/>
      {mount&&<iframe className={`${styles.frame} ${ready?styles.ready:''}`} src={src} title={`${p.name}の操作できる作例`} tabIndex={active?0:-1} inert={!active} referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" onLoad={()=>setReady(true)} onError={()=>setFailed(true)}/>}
      {!active&&<div className={styles.shield} aria-hidden="true"/>}
      {!src&&<Link className={styles.detail} href={`/works/${p.id}`} aria-label={`${p.name}の制作内容を見る`}>制作内容を見る <ArrowUpRight size={18}/></Link>}
    </div>
    <div className={styles.bar}>
      <span className={styles.status}>{failed?'表示できない場合は、別タブでご覧ください。':!src?'公開サイトは別タブでご覧いただけます。':mount&&!ready?(slow?'読み込みに時間がかかる場合は、別タブでもご覧いただけます。':'作例を読み込み中…'):active?'この枠の中をスクロール・操作できます。':ready?'Live preview':'この場で作例を体験'}</span>
      <div className={styles.actions}>
        {src&&!failed&&<button ref={toggle} type="button" aria-pressed={active} aria-label={`${p.name}の${active?'操作を終える':'作例を操作する'}`} onClick={interact}>{active?'操作を終える':'操作する'}</button>}
        <a href={p.url||`/works/${p.id}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}を別タブで開く`}>別タブで開く <ArrowUpRight size={15}/></a>
      </div>
    </div>
  </div>;
}
