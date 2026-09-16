import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { BrandFilm } from "@/components/site/BrandFilm";

export function ServiceLab() {
 return <div className="lab">
  <div className="lab-heading">
   <p className="sv-kicker">サービス</p>
   <h1>ばらばらを、<br/>可能性に。</h1>
   <p>AI導入・業務改善、システム開発、Web制作。仕事の流れを整理し、事業が前に進む仕組みをつくります。</p>
   <div className="lab-actions"><a href="#support" className="sv-button">支援内容を見る <ArrowRight size={18}/></a><Link href="/contact" className="sv-text-link">相談する <ArrowUpRight size={18}/></Link></div>
  </div>
  <div className="brand-service-art"><BrandFilm compact/></div>
  <nav className="lab-services" aria-label="支援領域">
   <a href="#ai-operations">AI導入・業務改善 <ArrowUpRight size={18}/></a>
   <a href="#crm">CRM・業務アプリ開発 <ArrowUpRight size={18}/></a>
   <a href="#digital">Webサイト・LP制作 <ArrowUpRight size={18}/></a>
   <a href="#people">採用・人財支援 <ArrowUpRight size={18}/></a>
  </nav>
 </div>;
}
