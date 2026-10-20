"use client";

import { useState } from "react";
import { LiveWork } from "@/components/site/LiveWork";
import { ArrowUpRight } from "lucide-react";
import { WaterContact } from "@/components/site/WaterContact";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PosterHeading } from "@/components/site/PosterHeading";
import { SectionShell } from "@/components/primitives/SectionShell";
import { selectedWorks, archiveWorks, workPresentationLabel } from "@/data/selected-works";
import { CrmCaseCard } from "@/components/site/CrmCaseCard";
import type { Project } from "@/types";

const filters = [["all", "すべて"], ["client", "クライアントワーク"], ["own", "プロダクト・共同事業"], ["ai-concept", "コンセプト作品"]];
const projects = archiveWorks;
const availableFilters = filters.filter(([id]) => id === "all" || projects.some(project => project.workType === id));

function ProjectView({project:p, featured=false}: {project:Project; featured?:boolean}) {
  return <article className="poster-work">
    <LiveWork project={p} priority={featured} poster/>
    <div className="poster-work-caption">
      <h2><a href={p.url || `/works/${p.id}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}の公開サイトを開く（別タブ）`}>{p.name}<ArrowUpRight size={24} aria-hidden="true"/></a></h2>
      <p className="poster-work-scope">{p.tags.slice(0,2).join(" / ")}</p>
      <p className="poster-work-category">{workPresentationLabel(p)}</p>
      <p className="poster-work-description">{p.description}</p>
    </div>
  </article>;
}

export function WorksClient() {
  const [filter,setFilter] = useState("all");
  const reduced=useReducedMotion();
  const visible = projects.filter(p=>filter === "all" || p.workType === filter);
  return <main id="main" className="poster-page poster-works">
    <SectionShell id="works-gallery">
      <PosterHeading index="01" label="WORKS" title={"「できるかな」を、\nかたちに。"} description="メディアも、ブランドも、仕事の道具も。Lakkanがつくってきた、表現と仕組み。" />
      <div className="poster-work-grid" data-selected-works>{selectedWorks.map((p,i)=><ProjectView key={p.id} project={p} featured={i<2}/>)}</div>
    </SectionShell>
    <SectionShell id="works-archive" topBorder>
      <div className="water-editorial-label"><h2>More than websites.</h2><p>サイトから、仕事の仕組みまで。</p></div>
      <CrmCaseCard />
      {availableFilters.length > 2 && <div className="poster-work-filters" role="group" aria-label="実績を種類で絞り込む">{availableFilters.map(([id,name])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{name}</button>)}<p role="status" aria-live="polite">{visible.length} 件</p></div>}
      {filter === "ai-concept" && <p>架空のブランドを題材にした制作実験です。実在企業からの受託実績ではありません。</p>}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={filter} initial={{opacity:reduced?1:0,y:reduced?0:12}} animate={{opacity:1,y:0}} exit={{opacity:reduced?1:0}} transition={{duration:reduced?0:.24,ease:[.22,1,.36,1]}}>
          <div className="poster-work-grid">{visible.map((p,i)=><ProjectView key={p.id} project={p} featured={i===0}/>)}</div>
        </motion.div>
      </AnimatePresence>
    </SectionShell>
    <WaterContact/>
  </main>;
}
