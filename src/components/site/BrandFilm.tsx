"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function BrandFilm({compact=false}:{compact?:boolean}) {
  const video=useRef<HTMLVideoElement>(null);
  useEffect(()=>{
    const el=video.current;if(!el)return;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=true;
    const sync=()=>{
      if(!visible||document.hidden||motion.matches)el.pause();
      else void el.play().catch(()=>{});
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
    observer.observe(el);motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
    return()=>{observer.disconnect();motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);el.pause();};
  },[]);
  return <div className={`brand-film${compact?' brand-film-compact':''}`}>
    <div className="brand-film-media">
    <Image className="brand-film-still" src="/brand/lakkan-water-horizontal-poster.jpg" alt="水平なLakkanと、横方向へ流れる透明な水面" width={1280} height={720} unoptimized preload={!compact}/>
    <video ref={video} muted loop playsInline preload="metadata" poster="/brand/lakkan-water-horizontal-poster.jpg" aria-label="水平に並ぶLakkanの前で、水面の小さな波が横方向へ静かに流れる映像">
      <source src="/brand/lakkan-water-horizontal.mp4" type="video/mp4"/>
    </video>
    </div>
  </div>;
}
