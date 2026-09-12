"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export type NewsArticle = {title:string;category:string;link:string;lede?:string};

function articleDate(link:string) {
 const date = link.match(/\/news\/(\d{4})-(\d{2})-(\d{2})\//);
 return date ? `${date[1]}.${date[2]}.${date[3]}` : null;
}

export function NewsEditorial({articles}:{articles:NewsArticle[]}) {
 const [category,setCategory]=useState("すべて");
 const categories=["すべて",...new Set(articles.map(a=>a.category))];
 const selected=category==="すべて"?articles:articles.filter(a=>a.category===category);
 const [lead,...rest]=selected;
 return <div className="service-scene news-editorial">
  <div className="dispatch-masthead"><span>LAKKAN READS THE WORLD</span><span>CURATED BY NOW ON AIR</span></div>
  <div className="dispatch-title"><span>The Dispatch<span className="dispatch-dot">.</span></span><p>今日の変化から、<br/>明日のヒントを。</p></div>
  <div className="dispatch-filters" role="group" aria-label="ニュースのカテゴリ">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <div className="dispatch-content" aria-live="polite">
   {lead ? <><a className="dispatch-lead" href={lead.link} key={lead.link}><div className="dispatch-meta"><span>{lead.category}</span>{articleDate(lead.link)&&<time>{articleDate(lead.link)}</time>}</div><h4>{lead.title}</h4>{lead.lede&&<p>{lead.lede}</p>}<div className="dispatch-read"><span>記事を読む</span><span className="dispatch-arrow"><ArrowUpRight size={25}/></span></div></a><div className="dispatch-list">{rest.slice(0,4).map((a,i)=><a className="dispatch-row" href={a.link} key={a.link}><span className="dispatch-number">{String(i+2).padStart(2,"0")}</span><div><div className="dispatch-meta"><span>{a.category}</span>{articleDate(a.link)&&<time>{articleDate(a.link)}</time>}</div><h4>{a.title}</h4></div><ArrowUpRight size={18}/></a>)}{rest.length===0&&<div className="dispatch-empty"><span>Stay curious.</span><p>ほかのカテゴリにも、<br/>次のヒントがあるかもしれません。</p></div>}</div></> : <p>記事はNow on AIrでご覧ください。</p>}
  </div>
  <div className="dispatch-bottom"><span>AI / TECHNOLOGY / BUSINESS</span><a href="https://nowonair.vercel.app">Now on AIrですべて読む<ArrowUpRight size={16}/></a></div>
 </div>;
}
