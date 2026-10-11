import { ArrowUpRight } from "lucide-react";
import { PosterHeading } from "@/components/site/PosterHeading";

export function ServiceLab() {
 return <div>
  <PosterHeading index="02" label="SERVICES" title={"頭はやわらかく。\nつくるのは、しっかり。"} description="業務の見直し、システム開発、Web制作、採用・人財支援。仕事の流れを整理し、事業が前に進む仕組みをつくります。" />
  <nav className="poster-service-list" aria-label="支援領域">
   {[
    ["ai-operations", "AI導入・業務改善", "業務の課題を整理し、AIの活用で、より効率的な仕事の進め方を設計します。"],
    ["crm", "CRM・業務アプリ開発", "業務に合わせたシステム・アプリを開発し、日々の仕事をスムーズにします。"],
    ["digital", "Webサイト・LP制作", "伝わるデザインと構成で、WebサイトやLPを企画・制作します。"],
    ["people", "採用・人財支援", "採用の仕組みづくりから、組織の育成まで。人に関わる課題を一緒に考えます。"],
   ].map(([id,title,body],i)=><a href={`#${id}`} key={id}><span className="poster-service-number">0{i+1}</span><h2>{title}</h2><p>{body}</p><ArrowUpRight size={24} aria-hidden="true"/></a>)}
  </nav>
 </div>;
}
