"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectModal } from "@/components/ProjectModal";
import { CommandSearch } from "@/components/CommandSearch";
import projectsData from "@/data/projects.json";
import { Category, Project } from "@/types";
import { ACCENT, CAT_COLOR, MarqueeItem, isNew } from "@/lib/design-tokens";

import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { News } from "@/components/sections/News";
import { Story } from "@/components/sections/Story";
import { Luna } from "@/components/sections/Luna";
import { Join } from "@/components/sections/Join";
import { Portals } from "@/components/sections/Portals";
import { Footer } from "@/components/sections/Footer";
import { Marquee2 } from "@/components/primitives/Marquee2";

const projects = projectsData as Project[];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  /* Cmd+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const live     = useMemo(() => projects.filter(p => p.status==="live").length, []);
  const cc       = useMemo(() => projects.filter(p => p.builtWith==="claude_code").length, []);
  const newCount = useMemo(() => projects.filter(p => isNew(p.updatedAt)).length, []);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = useMemo(() => projects.filter(p => p.updatedAt === todayStr).length, [todayStr]);

  /* Tag frequency for marquee row 2 */
  const tagCounts = useMemo(() => {
    const c: Record<string,number> = {};
    projects.forEach(p => p.tags.forEach(t => { c[t] = (c[t]||0)+1; }));
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,16);
  }, []);

  /* Marquee row 1: project names with category colors */
  const marqueeRow1: MarqueeItem[] = useMemo(() => projects.map(p => ({
    text: p.name.toUpperCase(),
    color: CAT_COLOR[p.category as Exclude<Category,"all">],
    dot:   CAT_COLOR[p.category as Exclude<Category,"all">],
  })), []);

  /* Marquee row 2: tags × counts */
  const marqueeRow2: MarqueeItem[] = useMemo(() => [
    ...tagCounts.map(([t,n]) => ({ text:`${t.toUpperCase()} ×${n}` })),
    { text:`${projects.length} PUBLIC WORKS` },
    { text:`${live} LIVE` },
    { text:`${cc} CLAUDE CODE BUILT` },
    { text:`${newCount} UPDATED THIS WEEK` },
  ], [tagCounts, live, cc, newCount]);

  const MARQUEE_TOP: MarqueeItem[] = [
    { text:"株式会社Lakkan" },{ text:"LUCK × 楽観 = LAKKAN" },{ text:"BUILT WITH AI" },
    { text:"東京・渋谷" },{ text:"2026" },{ text:"楽観と、計画と。" },{ text:`${projects.length} PUBLIC WORKS` },
  ];

  return (
    <div>
      <Hero
        totalProjects={projects.length}
        live={live}
        cc={cc}
        newCount={newCount}
        todayCount={todayCount}
        onOpenCmd={() => setCmdOpen(true)}
      />

      <Marquee2 items={MARQUEE_TOP} bg="#132126" speed="normal" />
      <Marquee2 items={marqueeRow1} bg="#132126" speed="slow" />

      <Manifesto />

      {/* Works は /works ページに隔離（縦長解消・2026-05-23）*/}

      <News />

      <Story />
      {/* Service は /services ページに隔離（縦長解消・2026-05-23）*/}
      <Luna />
      {/* About は /about ページに隔離（個人色をトップから外し縦長解消・2026-05-23）*/}
      <Join />

      <Marquee2 items={marqueeRow2} bg="#132126" speed="slow" />
      <Marquee2 items={marqueeRow1} bg={ACCENT.vermillion} speed="normal" reverse />

      <Portals />
      <Footer onOpenCmd={() => setCmdOpen(true)} />

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      {cmdOpen && (
        <CommandSearch
          projects={projects}
          onSelect={p => { setSelectedProject(p); setCmdOpen(false); }}
          onClose={() => setCmdOpen(false)}
        />
      )}
    </div>
  );
}
