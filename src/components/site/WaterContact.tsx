import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WaterSculpture } from "./WaterSculpture";
export function WaterContact({href="/contact",note="いま困っていること、これから実現したいことを聞かせてください。"}:{href?:string;note?:string}){
 return <SectionShell id="water-contact">
  <div className="water-contact-top"><h2>一緒に、次の一歩を。</h2><p>まだ、まとまっていなくても。</p></div>
  <Link className="water-contact-art" href={href} aria-label="相談をはじめる — Let’s talk">
   <WaterSculpture src="/brand/lets-talk-orange.jpg" alt="水滴と水面に浮かぶ、オレンジのLet’s talk."/>
   <span className="water-contact-orb" aria-hidden="true"><ArrowUpRight/></span>
  </Link>
  <div className="water-contact-bottom"><p>{note}</p><Link href={href}>相談をはじめる <ArrowUpRight size={18}/></Link></div>
 </SectionShell>;
}
