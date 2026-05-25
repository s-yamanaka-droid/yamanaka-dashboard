"use client";

import { useState } from "react";
import { Works } from "@/components/sections/Works";
import { PageHero } from "@/components/PageHero";
import { ProjectModal } from "@/components/ProjectModal";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";
import { SortKey } from "@/lib/design-tokens";

const projects = projectsData as Project[];

export function WorksClient() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sort, setSort] = useState<SortKey>("updatedAt");

  return (
    <main>
      <PageHero
        section="Works"
        version="v.1"
        title="つくったもの、すべて。"
        lede="AIエージェント、採用LP、コーポレートサイト、社内ダッシュボード — 動くプロダクトだけを並べる。"
      />
      <Works
        projects={projects}
        sort={sort}
        setSort={setSort}
        onSelectProject={setSelectedProject}
      />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
