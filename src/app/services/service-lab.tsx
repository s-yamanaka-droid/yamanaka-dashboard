import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { WaterSculpture } from "@/components/site/WaterSculpture";
import { BrandHeading } from "@/components/site/BrandHeading";

export function ServiceLab() {
 return <div className="lab">
  <div className="lab-heading">
   <p className="water-page-kicker">Services<span>.</span></p>
   <BrandHeading as="h1">{"頭はやわらかく。\nつくるのは、しっかり。"}</BrandHeading>
   <p>業務の見直し、システム開発、Web制作、採用・人財支援。仕事の流れを整理し、事業が前に進む仕組みをつくります。</p>
   <div className="lab-actions"><a href="#support" className="sv-button">支援内容を見る <ArrowRight size={18}/></a><Link href="/contact" className="sv-text-link">相談する <ArrowUpRight size={18}/></Link></div>
  </div>
  <div className="brand-service-art"><WaterSculpture/></div>
  <nav className="lab-services" aria-label="支援領域">
   <a href="#ai-operations"><span>AI導入・<span className="lab-service-line">業務改善</span></span><ArrowUpRight size={18}/></a>
   <a href="#crm"><span>CRM・<span className="lab-service-line">業務アプリ開発</span></span><ArrowUpRight size={18}/></a>
   <a href="#digital"><span>Webサイト・<span className="lab-service-line">LP制作</span></span><ArrowUpRight size={18}/></a>
   <a href="#people"><span>採用・<span className="lab-service-line">人財支援</span></span><ArrowUpRight size={18}/></a>
  </nav>
 </div>;
}
