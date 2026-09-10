import type { Metadata } from "next";
import { ArrowUpRight, Shapes } from "lucide-react";
import { PageHero } from "@/components/PageHero";
export const metadata:Metadata={title:"Lab — Lakkan Inc.",description:"Lakkanのデザイン実験室。WebGL、タイポグラフィ、サイトの表現を試す公開デモ。"};
const demos=[
["particles","RESONA STUDIO","Particles","マウスに反応する粒子で、音と空間を表現する。"],
["fluid","Liora Atelier","Fluid","やわらかな流体と光で、ブランドの空気をつくる。"],
["terrain","TERRA NOSU","Terrain","地形のうねりを、建築と空間のストーリーへ。"],
["saas","Flowdesk","Product","機能から使い方まで、一続きで伝えるサービス紹介。"],
["portfolio","STUDIO HARUKAZE","Editorial","文字と余白、作品の大きさで個性を伝える。"],
["restaurant","日和テーブル","Food","食の写真と、予約までのわかりやすい道筋。"],
["leadform","トコハ住建","Conversion","相談への一歩を、自然な読み進め方でつくる。"]];
export default function AtelierPage(){return <main id="main" className="new-site"><PageHero section="Lab / Atelier" title="次の表現を、試す場所。" lede="光の動き、文字のリズム、使いやすい導線。Lakkanの制作実験を、ブラウザで体験できます。"/><section className="site-section"><p className="lab-intro">以下は架空ブランドによるデザインデモです。制作実績とは区別して掲載しています。デモ内の価格やお客様の声は、レイアウト検証用のサンプルです。</p><div className="lab-list">{demos.map(([id,name,type,description])=><a key={id} className="lab-row" href={"/atelier/"+id} target="_blank" rel="noopener noreferrer"><Shapes aria-hidden/><div><small>{type}</small><h2>{name}</h2></div><p>{description}</p><ArrowUpRight aria-hidden/></a>)}</div></section></main>}
