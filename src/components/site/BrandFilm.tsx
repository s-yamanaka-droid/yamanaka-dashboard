"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function BrandFilm({compact=false}:{compact?:boolean}) {
  const video=useRef<HTMLVideoElement>(null);
  const userPaused=useRef(false);
  const [playing,setPlaying]=useState(false);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const el=video.current;if(!el)return;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=true;
    const sync=()=>{
      if(!visible||document.hidden||motion.matches||userPaused.current)el.pause();
      else void el.play().catch(()=>{});
    };
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
    observer.observe(el);motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
    return()=>{observer.disconnect();motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);el.pause();};
  },[]);
  function toggle(){const el=video.current;if(!el)return;userPaused.current=!el.paused;if(el.paused)void el.play().catch(()=>{});else el.pause();}
  return <div className={`brand-film${compact?' brand-film-compact':''}`}>
    <video ref={video} muted loop playsInline preload="none" poster="/brand/possibility-poster.jpg" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)} aria-label="異なる幾何学の断片が、ひとつの輪へとつながるBlender映像">
      <source src="/brand/possibility.mp4" type="video/mp4"/>
    </video>
    {!failed&&<button type="button" className="brand-film-control" onClick={toggle} aria-label={playing?'背景映像を一時停止':'背景映像を再生'}>{playing?<Pause size={16}/>:<Play size={16}/>}<span>{playing?'映像を停止':'映像を再生'}</span></button>}
  </div>;
}
