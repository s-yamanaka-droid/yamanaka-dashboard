"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import type * as THREE from "three";

const worlds = [
  {name:"AI・業務改善", en:"OPERATIONS", color:"#b4472e", problem:"繰り返す手作業", result:"判断に集中できる仕事", path:["情報を集める","AIで整理する","人が判断する"], topic:"ai-consult", caption:"繰り返す仕事を整理し、人の判断へつなぐ。", detail:"ai-operations"},
  {name:"CRM・開発", en:"CONNECTION", color:"#366b78", problem:"点在する顧客情報", result:"次の対応までつながる情報", path:["顧客の接点","一つの履歴","次のアクション"], topic:"crm", caption:"ばらばらの接点を、チームで動ける仕組みへ。", detail:"crm"},
  {name:"Web・デザイン", en:"EXPERIENCE", color:"#8b6634", problem:"埋もれている魅力", result:"伝わり、選ばれる体験", path:["強みを見つける","体験を設計する","行動につなげる"], topic:"corp-site", caption:"伝えたいことを整理し、選ばれる体験をつくる。", detail:"digital"},
  {name:"人と組織", en:"PEOPLE", color:"#567444", problem:"曖昧な役割と負担", result:"一人ひとりが力を発揮する組織", path:["仕事を見直す","役割を定める","人とつなげる"], topic:"placement", caption:"仕事と役割を見直し、人の力が活きる配置へ。", detail:"people"},
];

export function ServiceLab() {
  const [paused, setPaused] = useState(true);
  return <div className="lab" style={{'--lab-accent':'#b4472e'} as CSSProperties}>
    <div className="lab-heading">
      <p className="sv-kicker">Lakkanのサービス</p>
      <h1>AIとシステムで、<br/>日々の業務を<br/><em>組み直す。</em></h1>
      <p>手作業の整理から、顧客管理・Web制作まで。業務の見直しと、必要な仕組みづくりを支援します。</p>
      <div className="lab-actions"><a href="#support" className="sv-button">困りごとから支援を探す <ArrowRight size={18}/></a><Link href="/contact" className="sv-text-link">相談する <ArrowUpRight size={18}/></Link></div>
    </div>
    <div className="lab-art">
      <div className="lab-stage"><MorphSculpture world={0} amount={100} paused={paused}/><button className="lab-pause" onClick={()=>setPaused(!paused)} aria-label={paused?'立体の動きを再生':'立体の動きを停止'}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{paused?'動きを見る':'動きを止める'}</span></button></div>
      <p className="lab-caption">業務を整理し、必要な仕組みをつなぐ。</p>
    </div>
    <nav className="lab-services" aria-label="支援領域">
      <a href="#ai-operations">AI導入・業務改善 <ArrowUpRight size={18}/></a>
      <a href="#crm">CRM・業務アプリ開発 <ArrowUpRight size={18}/></a>
      <a href="#digital">Webサイト・LP制作 <ArrowUpRight size={18}/></a>
      <a href="#people">採用・人財支援 <ArrowUpRight size={18}/></a>
    </nav>
  </div>;
}

function MorphSculpture({world,amount,paused}:{world:number;amount:number;paused:boolean}) {
  const host=useRef<HTMLDivElement>(null);
  const current=useRef({world,amount,paused});
  const [ready,setReady]=useState(false);
  useEffect(()=>{current.current={world,amount,paused};},[world,amount,paused]);
  useEffect(()=>{
    const element=host.current;if(!element)return;
    let dead=false,cleanup=()=>{};
    Promise.all([import('three'),import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),import('three/examples/jsm/loaders/GLTFLoader.js')]).then(([T,{RoundedBoxGeometry},{GLTFLoader}])=>{
      if(dead)return;
      let renderer:THREE.WebGLRenderer;
      try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.setSize(element.clientWidth,element.clientHeight);
      renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
      const scene=new T.Scene(), group=new T.Group();scene.add(group);
      const camera=new T.PerspectiveCamera(34,element.clientWidth/element.clientHeight,.1,100);camera.position.set(7,5,11);camera.lookAt(0,.4,0);
      scene.add(new T.HemisphereLight(0xfffbef,0x556654,3));
      for(const [x,y,z,power,color] of [[-5,7,4,5,0xfff5df],[6,3,-2,3,0xd8e8f0]] as const){const light=new T.DirectionalLight(color,power);light.position.set(x,y,z);scene.add(light);}
      const material=new T.MeshStandardMaterial({color:0xb4c1ac,metalness:.4,roughness:.28});
      const accent=new T.MeshStandardMaterial({color:worlds[0].color,metalness:.3,roughness:.2});
      const count=48;
      const tiles=new T.InstancedMesh(new RoundedBoxGeometry(.53,.2,.42,3,.05),material,count);group.add(tiles);
      const dummy=new T.Object3D(), vector=new T.Vector3();
      const positions=Array.from({length:count},()=>new T.Vector3());
      const seeds=Array.from({length:count},(_,i)=>new T.Vector3(Math.sin(i*13.31)*3.5,Math.cos(i*7.79)*2.4+.4,Math.sin(i*3.41)*2.5));
      const nodes=Array.from({length:6},()=>{const node=new T.Mesh(new T.SphereGeometry(.17,20,14),accent);group.add(node);return node;});
      const orbit=new T.Mesh(new T.TorusGeometry(2.4,.018,6,128),new T.MeshStandardMaterial({color:0x9baa94,metalness:.4,roughness:.5,transparent:true,opacity:.6}));orbit.rotation.x=Math.PI/2;orbit.position.y=-1.05;group.add(orbit);
      const lineGeo=new T.BufferGeometry();lineGeo.setAttribute('position',new T.BufferAttribute(new Float32Array(6*3),3));
      const line=new T.LineLoop(lineGeo,new T.LineBasicMaterial({color:0x597965,transparent:true,opacity:.5}));group.add(line);
      const gate=new T.Group();gate.scale.setScalar(.6);gate.position.set(0,-.75,0);group.add(gate);
      new GLTFLoader().load('/services/passage.glb',gltf=>{if(dead){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});return;}gltf.scene.traverse(o=>{if(o instanceof T.Mesh){const old=Array.isArray(o.material)?o.material:[o.material];old.forEach(m=>m.dispose());o.material=o.name==='Sphere'?accent:material;}});gate.add(gltf.scene);},undefined,()=>{});
      element.appendChild(renderer.domElement);setReady(true);
      let visible=true,time=0,last=0,mix=.12,pointerX=0,pointerY=0;
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
      const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});observer.observe(element);
      const resize=new ResizeObserver(()=>{renderer.setSize(element.clientWidth,element.clientHeight);camera.aspect=element.clientWidth/element.clientHeight;camera.updateProjectionMatrix();});resize.observe(element);
      const move=(event:PointerEvent)=>{const rect=element.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;};
      const leave=()=>{pointerX=0;pointerY=0;};element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);
      renderer.setAnimationLoop(now=>{
        const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;
        const config=current.current, motion=!config.paused&&!reduced.matches;
        if(motion)time+=dt;
        const lerp=reduced.matches?1:1-Math.exp(-dt*7);
        mix=T.MathUtils.lerp(mix,config.amount/100,lerp);
        accent.color.lerp(new T.Color(worlds[config.world].color),lerp);
        for(let i=0;i<count;i++){
          if(config.world===0){const lane=Math.floor(i/16);vector.set((i%16-7.5)*.37,lane*.5-.6,(lane-1)*1.1);}
          else if(config.world===1){const a=i/count*Math.PI*2;vector.set(Math.cos(a)*2.3,Math.sin(a*3)*.35,Math.sin(a)*2.3);}
          else if(config.world===2){vector.set((i%8-3.5)*.62,(Math.floor(i/8)-2.5)*.37,Math.sin(i%8*.4)*.2);}
          else {const a=(i%8)/8*Math.PI*2,c=Math.floor(i/8)/6*Math.PI*2;vector.set(Math.cos(c)*2+Math.cos(a)*.42,Math.sin(a)*.45,Math.sin(c)*2+Math.sin(a)*.35);}
          vector.lerpVectors(seeds[i],vector,mix);
          if(motion){vector.y+=Math.sin(time*.6+i)*.07*(1-mix);}
          positions[i].lerp(vector,lerp);dummy.position.copy(positions[i]);
          dummy.rotation.set((1-mix)*Math.sin(i)*1.5,config.world===1?i/count*Math.PI*2:(1-mix)*i*.11,(1-mix)*Math.cos(i)*.8);
          dummy.scale.setScalar(config.world===0?.85:1);dummy.updateMatrix();tiles.setMatrixAt(i,dummy.matrix);
        }
        tiles.instanceMatrix.needsUpdate=true;
        nodes.forEach((node,i)=>{const a=i/6*Math.PI*2+time*.13;const r=2.35;node.position.set(Math.cos(a)*r,.2+Math.sin(a*2)*.3,Math.sin(a)*r);node.scale.setScalar(.8+mix*.6);const p=lineGeo.attributes.position;p.setXYZ(i,node.position.x,node.position.y,node.position.z);});lineGeo.attributes.position.needsUpdate=true;lineGeo.computeBoundingSphere();
        line.visible=config.world===1||config.world===3;line.material.opacity=mix*.5;
        gate.visible=config.world===0;gate.scale.setScalar(.3+mix*.3);gate.position.y=-.8;
        orbit.scale.setScalar(1.05+(1-mix)*.3);orbit.material.opacity=.15+mix*.35;
        group.rotation.y=T.MathUtils.lerp(group.rotation.y,-.45+(motion?Math.sin(time*.11)*.15+pointerX*.35:0),lerp);
        group.rotation.x=T.MathUtils.lerp(group.rotation.x,motion?pointerY*.08:0,lerp);
        renderer.render(scene,camera);
      });
      cleanup=()=>{renderer.setAnimationLoop(null);observer.disconnect();resize.disconnect();element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);const geometries=new Set<THREE.BufferGeometry>();const mats=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));}});geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{});
    return()=>{dead=true;cleanup();};
  },[]);
  return <div className="lab-canvas" ref={host} role="img" aria-label={`${worlds[world].name}：${amount<70?'分散している要素':'一つの仕組みにまとまった要素'}を表現する立体`}>
    {!ready&&<div className="lab-fallback" aria-hidden="true"><span/><span/><span/><span/><span/><span/><i/></div>}
  </div>;
}
