"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
// Adapted from Ruixen UI Ripple Distortion, 21st component 7753.
// Copyright (c) 2025 Ruixen UI, MIT. See docs/vendor/ruixen-ui-LICENSE.
const vertexShader = `varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragmentShader = `
uniform sampler2D uTexture;uniform float time;uniform vec2 uMouse;
uniform float activity;uniform float aspect;varying vec2 vUv;
void main(){
 vec2 delta=vUv-uMouse;float dist=length(delta*vec2(aspect,1.));
 float ripple=sin(dist*27.-time*2.4)*.009*activity*exp(-dist*3.);
 vec2 offset=delta/max(dist,.035)*ripple;
 offset+=vec2(sin(vUv.y*9.+time*.65),cos(vUv.x*8.-time*.54))*.0038;
 offset+=vec2(sin(vUv.y*17.-time*.32),cos(vUv.x*14.+time*.29))*.0012;
 vec2 cover=vec2(min(1.,aspect/1.8),min(1.,1.8/aspect));
 gl_FragColor=texture2D(uTexture,clamp((vUv+offset-.5)*cover+.5,vec2(.001),vec2(.999)));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export function WaterSculpture({src="/brand/lakkan-orange.jpg",alt="浅い水面に浮かぶ、透明なオレンジのLakkan",priority=false}:{src?:string;alt?:string;priority?:boolean}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');canvas.style.opacity='0';el.appendChild(canvas);
  const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);camera.position.z=1;
  const uniforms={uTexture:{value:null as THREE.Texture|null},time:{value:0},uMouse:{value:new THREE.Vector2(.5,.5)},activity:{value:0},aspect:{value:1.8}};
  const material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms});const geometry=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geometry,material));
  let disposed=false,visible=false,ready=false,frame=0,last=0,clock=0,active=0;
  const target=new THREE.Vector2(.5,.5);
  const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
  const draw=(now:number)=>{
   frame=0;if(disposed||!visible||document.hidden||reduced.matches||!ready)return;
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;clock+=dt;
   uniforms.time.value=clock;uniforms.uMouse.value.lerp(target,1-Math.exp(-dt*7));
   active*=Math.exp(-dt*.7);uniforms.activity.value=active;
   renderer.render(scene,camera);frame=requestAnimationFrame(draw);
  };
  const sync=()=>{stop();canvas.style.opacity=ready&&!reduced.matches?'1':'0';if(ready&&visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(draw);};
  const resize=()=>{const rect=el.getBoundingClientRect();if(rect.width&&rect.height){renderer.setSize(rect.width,rect.height);uniforms.aspect.value=rect.width/rect.height;}};
  const observer=new ResizeObserver(resize);observer.observe(el);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});intersection.observe(el);
  new THREE.TextureLoader().load(src,texture=>{
   if(disposed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;uniforms.uTexture.value=texture;ready=true;resize();sync();
  },undefined,()=>{canvas.style.opacity='0';});
  const move=(event:PointerEvent)=>{const rect=el.getBoundingClientRect();target.set((event.clientX-rect.left)/rect.width,1-(event.clientY-rect.top)/rect.height);active=1;};
  const lost=(event:Event)=>{event.preventDefault();ready=false;canvas.style.opacity='0';stop();};
  el.addEventListener('pointermove',move,{passive:true});canvas.addEventListener('webglcontextlost',lost);
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  return()=>{disposed=true;stop();observer.disconnect();intersection.disconnect();el.removeEventListener('pointermove',move);canvas.removeEventListener('webglcontextlost',lost);reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);uniforms.uTexture.value?.dispose();geometry.dispose();material.dispose();renderer.dispose();canvas.remove();};
 },[src]);
 return <div className="water-sculpture" ref={host}><Image className="water-sculpture-still" src={src} alt={alt} width={1800} height={1000} sizes="100vw" preload={priority} loading={priority?undefined:"lazy"}/></div>;
}
