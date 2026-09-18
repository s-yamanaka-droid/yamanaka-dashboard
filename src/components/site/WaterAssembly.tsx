"use client";
import { useEffect, useRef } from "react";
import { WaterSculpture } from "./WaterSculpture";

/** Blender assembly plays once, then yields to the pointer-reactive water. */
export function WaterAssembly(){
 const host=useRef<HTMLDivElement>(null);
 const film=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const element=host.current,video=film.current;if(!element||!video)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,finished=false,requested=false;
  const finish=()=>{finished=true;element.classList.remove('is-playing');video.pause();};
  const playing=()=>{if(!finished&&!reduced.matches)element.classList.add('is-playing');};
  const sync=()=>{
   if(reduced.matches){finish();return;}
   if(finished)return;
   if(!visible||document.hidden){video.pause();return;}
   if(!requested){requested=true;video.src='/brand/lakkan-orange-assembly.mp4';video.load();}
   void video.play().catch(()=>element.classList.remove('is-playing'));
  };
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.12});intersection.observe(element);
  video.addEventListener('playing',playing);video.addEventListener('ended',finish);video.addEventListener('error',finish);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  return()=>{intersection.disconnect();video.pause();video.removeAttribute('src');video.load();video.removeEventListener('playing',playing);video.removeEventListener('ended',finish);video.removeEventListener('error',finish);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
 },[]);
 return <div className="water-assembly" ref={host}>
  <WaterSculpture src="/brand/lakkan-orange-settled.jpg" priority/>
  <video ref={film} className="water-assembly-film" muted playsInline preload="none" disablePictureInPicture disableRemotePlayback aria-hidden="true" tabIndex={-1}/>
 </div>;
}
