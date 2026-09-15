"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, RotateCcw, Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import type * as THREE from "three";

const worlds = [
  {name:"AI・業務改善", en:"OPERATIONS", color:"#b4472e", problem:"繰り返す手作業", result:"判断に集中できる仕事", path:["情報を集める","AIで整理する","人が判断する"], topic:"ai-consult", caption:"繰り返す仕事を整理し、人の判断へつなぐ。", detail:"ai-operations"},
  {name:"CRM・開発", en:"CONNECTION", color:"#366b78", problem:"点在する顧客情報", result:"次の対応までつながる情報", path:["顧客の接点","一つの履歴","次のアクション"], topic:"crm", caption:"ばらばらの接点を、チームで動ける仕組みへ。", detail:"crm"},
  {name:"Web・デザイン", en:"EXPERIENCE", color:"#8b6634", problem:"埋もれている魅力", result:"伝わり、選ばれる体験", path:["強みを見つける","体験を設計する","行動につなげる"], topic:"corp-site", caption:"伝えたいことを整理し、選ばれる体験をつくる。", detail:"digital"},
  {name:"人と組織", en:"PEOPLE", color:"#567444", problem:"曖昧な役割と負担", result:"一人ひとりが力を発揮する組織", path:["仕事を見直す","役割を定める","人とつなげる"], topic:"placement", caption:"仕事と役割を見直し、人の力が活きる配置へ。", detail:"people"},
];

export function ServiceLab() {
  const [world,setWorld]=useState(0);
  const [amount,setAmount]=useState(12);
  const [playing,setPlaying]=useState(false);
  const [paused,setPaused]=useState(false);
  const animation=useRef(0);
  const worldData=worlds[world];
  const organized=amount>=70;
  useEffect(()=>()=>cancelAnimationFrame(animation.current),[]);
  function stop(){cancelAnimationFrame(animation.current);setPlaying(false);}
  function compose(){
    stop();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setAmount(100);return;}
    setPlaying(true);setAmount(0);
    let start=0;
    function tick(now:number){
      if(!start)start=now;
      const progress=Math.min((now-start)/2600,1);
      setAmount(Math.round((progress<.5?4*progress**3:1-(-2*progress+2)**3/2)*100));
      if(progress<1)animation.current=requestAnimationFrame(tick);else setPlaying(false);
    }
    animation.current=requestAnimationFrame(tick);
  }
  return <div className="lab" style={{'--lab-accent':worldData.color} as CSSProperties}>
    <div className="lab-heading"><p className="sv-kicker"><span/> LAKKAN / POSSIBILITIES IN MOTION</p><h1>ばらばらを、<br/><em>可能性</em>に。</h1><p>仕事も、情報も、アイデアも。<br/>つながり方を変えると、動き出す。</p><Link href="/contact" className="lab-invite">あなたの事業なら？ <ArrowUpRight size={18}/></Link></div>
    <div className="lab-stage">
      <div className="lab-stage-label"><span>THE POSSIBILITY STUDIO</span><span>触って、変化を見てみる。</span></div>
      <MorphSculpture world={world} amount={amount} paused={paused}/>
      <div className="lab-stage-word" aria-hidden="true">{organized?'Possibility.':'Complexity.'}</div>
      <div className="lab-coordinate" aria-hidden="true">{worldData.en} / LAKKAN</div>
      <button className="lab-pause" onClick={()=>setPaused(!paused)} aria-label={paused?'自動モーションを再生':'自動モーションを停止'}>{paused?<Play size={13}/>:<Pause size={13}/>}</button>
    </div>
    <div className="lab-console">
      <div className="lab-worlds" role="group" aria-label="体験するサービス">{worlds.map((w,i)=><button key={w.en} aria-pressed={world===i} onClick={()=>{stop();setWorld(i);setAmount(12);}}><span>0{i+1}</span>{w.name}<ArrowUpRight size={13}/></button>)}</div>
      <div className="lab-control">
        <div className="lab-meaning" aria-live="polite"><span>{organized?'AFTER / 目指す状態':'BEFORE / よくある課題'}</span><strong>{organized?worldData.result:worldData.problem}</strong></div>
        <div className="lab-range"><label htmlFor="lab-progress"><span>ばらばら</span><span>つながる</span></label><input id="lab-progress" aria-label="仕事の組み替え" aria-valuetext={amount<35?'ばらばらの状態':amount<70?'組み替えている途中':'つながった状態'} type="range" min="0" max="100" value={amount} onChange={e=>{stop();setAmount(Number(e.target.value));}}/><small>スライダーを動かして、組み替える。</small></div>
        <button className="lab-transform" onClick={organized?()=>{stop();setAmount(12);}:compose}>{organized?<RotateCcw size={17}/>:<ArrowRight size={17}/>}<span>{organized?'もう一度、試す':playing?'組み替えています':'仕事を組み替える'}</span></button>
      </div>
      <div className="lab-story"><p>{worldData.caption}</p><a href={`#${worldData.detail}`}>支援内容を見る <ArrowDownIcon/></a></div>
    </div>
    <div className="lab-path" aria-label="支援の流れ">{worldData.path.map((step,i)=><div key={step} className={amount>i*33?'is-connected':''}><span>0{i+1}</span><p>{step}</p>{i<2&&<ArrowRight size={18}/>}</div>)}</div>
    <p className="lab-note">小さな組み替えから、事業の可能性をひらく。</p>
  </div>;
}

function ArrowDownIcon(){return <ArrowRight size={15} style={{transform:'rotate(90deg)'}}/>;}

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
