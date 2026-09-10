import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
type Props={section:string;version?:string;title:string;lede:string;background?:string};
export function PageHero({section,title,lede}:Props){const phrases=title.split("、");return <section className="subpage-hero"><div className="subpage-top"><p className="eyebrow">{section}</p><Link href="/contact">LET’S TALK <ArrowUpRight size={14}/></Link></div><h1>{phrases.map((phrase,i)=><span key={i} style={{display:"inline-block",maxWidth:"100%"}}>{phrase}{i<phrases.length-1?"、":""}</span>)}</h1><p>{lede}</p></section>;}
