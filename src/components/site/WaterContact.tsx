import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { StudioPeople } from "./PosterHeading";
export function WaterContact({href="/contact",note="いま困っていること、これから実現したいことを聞かせてください。"}:{href?:string;note?:string}){
 return <SectionShell id="poster-contact-cta" className="poster-contact-cta" topBorder>
  <div className="poster-cta-layout"><div><p className="poster-small-label">LET’S TALK</p><h2><span>一緒に、</span><span>次の一歩を。</span></h2><p>{note}</p><Link className="poster-button" href={href}>相談をはじめる <ArrowUpRight size={20} aria-hidden="true"/></Link></div><StudioPeople scene="wave"/></div>
 </SectionShell>;
}
