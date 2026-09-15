"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play, ArrowRight } from "lucide-react";

const services = [
  { id: "ai-operations", label: "仕事の負担を減らしたい", en: "AI & OPERATIONS", title: "仕事の流れを、\nAIと組み直す。", text: "転記、情報探し、確認待ち。日々の小さな負担から見直し、人にしかできない判断に時間を使える仕組みへ。", items: ["業務ヒアリングと改善テーマの整理", "AIエージェント・業務自動化の設計と実装", "AI活用研修・導入後の運用支援"], tags:["業務再設計", "AI導入", "Luna AI"], before:"情報を探す → 転記する → 確認を待つ", after:"情報を整理する → 人が判断する", topic:"ai-consult" },
  { id: "crm", label: "情報と仕事をつなげたい", en: "CRM & DEVELOPMENT", title: "ばらばらの情報を、\n次の行動へ。", text: "顧客情報、商談の履歴、次にやること。チームの仕事がつながるCRMや業務アプリを、現場に合わせて設計します。", items:["顧客情報・画面・権限の設計", "CRM・Webアプリ・業務ツールの開発", "既存システムとの連携・運用改善"], tags:["CRM構築", "業務アプリ", "プロダクト開発"], before:"メール・表計算・担当者の記憶に分散", after:"顧客履歴 → 担当者 → 次の対応", topic:"crm" },
  { id: "digital", label: "事業の魅力を届けたい", en: "WEB & EXPERIENCE", title: "らしさが伝わる。\n行動につながる。", text: "会社やサービスの強みを整理し、言葉とデザインを一つに。訪れた人が理解し、相談や応募へ進めるWeb体験をつくります。", items:["コーポレート・ブランドサイト制作", "採用LP・サービスLPの設計と制作", "モバイル対応・公開前検証・更新支援"], tags:["Webサイト", "サービスLP", "採用LP"], before:"伝えたいことが多く、強みが埋もれる", after:"強みを知る → 納得する → 相談する", topic:"corp-site" },
  { id: "people", label: "人と組織の課題を解きたい", en: "PEOPLE & ORGANIZATION", title: "人が力を発揮する、\n仕事と組織へ。", text: "「人が足りない」の背景から整理します。技術で減らせる負担と、人に任せたい役割を分け、必要な人財との出会いにつなぎます。", items:["業務と役割の整理", "採用要件・魅力の伝え方の設計", "人財支援・人材紹介のご相談"], tags:["採用設計", "役割の整理", "人財支援"], before:"忙しいから、まず人を増やしたい", after:"仕事を見直す → 必要な役割を定める", topic:"placement" },
];

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const change = () => {
      const hash = window.location.hash.slice(1);
      const i = services.findIndex(s=>s.id===hash);
      if(i>=0) setActive(i);
      if(hash==='product') setActive(1);
    };
    change(); window.addEventListener('hashchange', change);
    return ()=>window.removeEventListener('hashchange', change);
  }, []);
  const s = services[active];
  return <>
    <div className="sv-explorer">
      <div className="sv-options" role="tablist" aria-label="変えたいことから支援を選ぶ" aria-orientation="vertical">{services.map((item,i)=><button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={active===i} aria-controls="service-panel" tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{
        let next=i;
        if(e.key==='ArrowDown'||e.key==='ArrowRight') next=(i+1)%services.length;
        else if(e.key==='ArrowUp'||e.key==='ArrowLeft') next=(i+services.length-1)%services.length;
        else if(e.key==='Home') next=0;
        else if(e.key==='End') next=services.length-1;
        else return;
        e.preventDefault();setActive(next);document.getElementById(`tab-${services[next].id}`)?.focus();
      }}><span id={item.id}>0{i+1}{item.id==='crm'&&<span id="product"/>}</span><span>{item.label}<small>{item.en}</small></span><ArrowUpRight size={19}/></button>)}</div>
      <div id="service-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} tabIndex={0} className="sv-panel">
        <div key={s.id} className="sv-panel-content"><p className="sv-kicker">{s.en}</p><h3>{s.title.split('\n').map(t=><span key={t}>{t}</span>)}</h3><p className="sv-body">{s.text}</p><div className="sv-tags">{s.tags.map(t=><span key={t}>{t}</span>)}</div>
          <div className="sv-flow"><small>たとえば、こんな変化を。</small><p>{s.before}</p><ArrowRight size={19}/><strong>{s.after}</strong></div>
          <ul>{s.items.map(t=><li key={t}>{t}</li>)}</ul><Link className="sv-text-link" href={`/contact?topic=${s.topic}`}>この課題について相談する <ArrowUpRight size={18}/></Link>
        </div>
      </div>
    </div>
    <div className="sv-fde" id="fde"><p className="sv-kicker">HOW WE WORK / FDE</p><h3>現場に入る。<br/>使われるまで、つなぐ。</h3><div><p>エンジニアが現場の仕事を理解し、課題の発見から開発・運用まで伴走する。それがLakkanのFDE支援です。</p><Link href="/contact?topic=fde" className="sv-text-link">伴走型の開発を相談する <ArrowUpRight size={17}/></Link></div></div>
  </>;
}

export function ServiceSculpture() {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [paused,setPaused] = useState(false);
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    const element=host.current;
    if(!element) return;
    let disposed=false;
    let cleanup=()=>{};
    Promise.all([import('three'), import('three/examples/jsm/loaders/GLTFLoader.js')]).then(([T,{GLTFLoader}])=>{
      if(disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try {renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
      renderer.setClearColor(0,0);
      renderer.outputColorSpace=T.SRGBColorSpace;
      const scene=new T.Scene();
      const camera=new T.PerspectiveCamera(35,1,.1,100);
      camera.position.set(5,4,7);camera.lookAt(0,1.2,0);
      scene.add(new T.HemisphereLight(0xffffff,0x556455,3));
      const key=new T.DirectionalLight(0xffffff,4);key.position.set(3,7,5);scene.add(key);
      const fill=new T.DirectionalLight(0xd6e5de,2);fill.position.set(-4,2,-1);scene.add(fill);
      const group=new T.Group();scene.add(group);
      let loaded=false, visible=true, time=0;
      const media=window.matchMedia('(prefers-reduced-motion: reduce)');
      pausedRef.current=media.matches;setPaused(media.matches);
      const mediaChange=()=>{pausedRef.current=media.matches;setPaused(media.matches);};
      media.addEventListener('change',mediaChange);
      const resize=new ResizeObserver(()=>{const {width,height}=element.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});resize.observe(element);
      const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(element);
      element.appendChild(renderer.domElement);
      new GLTFLoader().load('/services/passage.glb',gltf=>{if(disposed)return;group.add(gltf.scene);loaded=true;setReady(true);},undefined,()=>{});
      let last=0;
      renderer.setAnimationLoop((now)=>{
        const dt=Math.min((now-last)/1000,.05);last=now;
        if(!visible||document.hidden||!loaded)return;
        if(!pausedRef.current)time+=dt;
        group.rotation.y=Math.sin(time*.24)*.24-.3;
        renderer.render(scene,camera);
      });
      cleanup=()=>{renderer.setAnimationLoop(null);resize.disconnect();observer.disconnect();media.removeEventListener('change',mediaChange);scene.traverse(obj=>{if(obj instanceof T.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();};
    });
    return ()=>{disposed=true;cleanup();};
  },[]);
  return <div className="sv-sculpture">
    <Image src="/services/passage.png" alt="三つの緑のフレームが道をつくり、朱色の球がその先へ進む立体作品" fill priority sizes="(max-width:760px) 100vw, 50vw" style={{objectFit:'contain',opacity:ready?0:1}}/>
    <div ref={host} className="sv-webgl" aria-hidden="true"/>
    {ready&&<button className="sv-motion" aria-label={paused?'立体の動きを再生':'立体の動きを一時停止'} onClick={()=>{pausedRef.current=!paused;setPaused(!paused);}}>{paused?<Play size={13}/>:<Pause size={13}/>}<span>{paused?'再生':'一時停止'}</span></button>}
  </div>;
}
