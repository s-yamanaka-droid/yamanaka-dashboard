"use client";

import Link from "next/link";
import { LiveWork } from "@/components/site/LiveWork";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { WaterContact } from "@/components/site/WaterContact";
import { PosterHeading } from "@/components/site/PosterHeading";
import { SectionShell } from "@/components/primitives/SectionShell";
import { selectedWorks, workPresentationLabel } from "@/data/selected-works";
import { CrmCaseCard } from "@/components/site/CrmCaseCard";
import type { Project } from "@/types";

function ProjectView({project:p, featured=false}: {project:Project; featured?:boolean}) {
  return <article className="poster-work">
    <LiveWork project={p} priority={featured} poster/>
    <div className="poster-work-caption">
      <h2><a href={p.url || `/works/${p.id}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}の公開サイトを開く（別タブ）`}>{p.name}<ArrowUpRight size={24} aria-hidden="true"/></a></h2>
      <p className="poster-work-scope">{p.tags.slice(0,2).join(" / ")}</p>
      <p className="poster-work-category">{workPresentationLabel(p)}</p>
      <p className="poster-work-description">{p.description}</p>
      <Link className="poster-work-story-link" href={`/works/${p.id}`} aria-label={`${p.name}の制作事例を読む`}>制作の詳細 <ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </article>;
}

export function WorksClient() {
  return <main id="main" className="poster-page poster-works">
    <SectionShell id="works-gallery">
      <PosterHeading index="01" label="WORKS" title={"「できるかな」を、\nかたちに。"} description="メディアも、ブランドも、仕事の道具も。Lakkanがつくってきた、表現と仕組み。" />
      <div className="poster-work-grid" data-selected-works>{selectedWorks.map((p,i)=><ProjectView key={p.id} project={p} featured={i<2}/>)}</div>
    </SectionShell>
    <SectionShell id="works-archive" topBorder>
      <div className="water-editorial-label"><h2>More than websites.</h2><p>サイトから、仕事の仕組みまで。</p></div>
      <CrmCaseCard />
    </SectionShell>
    <WaterContact/>
  </main>;
}
