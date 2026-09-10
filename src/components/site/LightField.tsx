"use client";

import { useEffect, useRef } from "react";

// Original shader: folded white light, reconstructed for Lakkan from the
// approved reference's composition. No template code or third-party asset.
const fragment = `precision mediump float;
uniform vec2 resolution; uniform float time; uniform vec2 pointer;
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 float x=uv.x*resolution.x/resolution.y;
 float q=x*0.85-uv.y*0.7+0.025*sin(uv.y*3.0+time*0.12)+pointer.x*0.018;
 float fold=sin(q*17.0+time*0.08);
 float soft=pow(0.5+0.5*fold,8.0);
 float shadow=pow(0.5+0.5*sin(q*17.0+0.65+time*0.08),3.0);
 vec3 c=vec3(0.976,0.978,0.973)-vec3(0.075,0.073,0.064)*shadow;
 c+=soft*vec3(0.035,0.039,0.042);
 float edge=pow(0.5+0.5*sin(q*17.0-0.25+time*0.08),48.0);
 c+=edge*vec3(0.008,-0.013,0.027);
 float glow=exp(-pow((uv.x-0.75)*1.8,2.0)-pow((uv.y-0.8)*2.0,2.0));
 c=mix(c,vec3(1.0),glow*0.4);
 gl_FragColor=vec4(c,1.0);
}`;

export function LightField(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current; if(!el)return;
  const gl=el.getContext("webgl",{alpha:false,antialias:false,powerPreference:"low-power"}); if(!gl)return;
  const compile=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);return s;};
  const vs=compile(gl.VERTEX_SHADER,"attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}");
  const fs=compile(gl.FRAGMENT_SHADER,fragment); const program=gl.createProgram()!;
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,"resolution"),t=gl.getUniformLocation(program,"time"),p=gl.getUniformLocation(program,"pointer");
  let frame=0,visible=true,last=0;let mouse=0; const mq=matchMedia("(prefers-reduced-motion: reduce)");
  const draw=(now:number)=>{gl.uniform2f(res,el.width,el.height);gl.uniform1f(t,mq.matches?0:now/1000);gl.uniform2f(p,mouse,0);gl.drawArrays(gl.TRIANGLES,0,6);};
  const resize=()=>{const r=el.getBoundingClientRect();el.width=Math.round(r.width*Math.min(devicePixelRatio,1.5));el.height=Math.round(r.height*Math.min(devicePixelRatio,1.5));gl.viewport(0,0,el.width,el.height);draw(0);};
  const tick=(now:number)=>{if(visible&&!document.hidden&&!mq.matches&&now-last>33){draw(now);last=now;}frame=requestAnimationFrame(tick);};
  const move=(e:PointerEvent)=>{mouse=e.clientX/innerWidth-.5;};
  const observer=new ResizeObserver(resize);observer.observe(el);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});io.observe(el);
  const change=()=>draw(0);mq.addEventListener("change",change);window.addEventListener("pointermove",move,{passive:true});resize();frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();io.disconnect();mq.removeEventListener("change",change);window.removeEventListener("pointermove",move);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);};
 },[]);
 return <canvas ref={canvas} className="light-field" aria-hidden="true"/>;
}
