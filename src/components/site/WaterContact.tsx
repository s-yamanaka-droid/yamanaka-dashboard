import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { RaccoGuide } from "./RaccoGuide";
export function WaterContact({href="/contact",note="いま困っていること、これから実現したいことを聞かせてください。"}:{href?:string;note?:string}){
 return <SectionShell id="poster-contact-cta" className="poster-contact-cta" topBorder>
  <div className="poster-cta-layout racco-consultation"><RaccoGuide compact pose="welcoming"/><div><p className="poster-small-label">相談から、日々の運用まで。</p><h2><span>現場で、</span><span>一緒につくる。</span></h2><p>{note}</p><Link className="racco-ticket" href={href}>いまの面倒を話す <ArrowUpRight size={20} aria-hidden="true"/></Link></div></div>
 </SectionShell>;
}
