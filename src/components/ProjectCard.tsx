"use client";

import { ArrowUpRight, Calendar, RotateCcw, Code2 } from "lucide-react";
import { Project } from "@/types";

const categoryStyle: Record<
  Project["category"],
  { label: string; color: string; bg: string; border: string }
> = {
  website:   { label: "Website",       color: "#2C5268", bg: "#DFE9ED", border: "#2C5268" },
  internal:  { label: "Internal Tool", color: "#5B5871", bg: "#E5E4EA", border: "#5B5871" },
  external:  { label: "External Tool", color: "#315A4E", bg: "#DDE8E2", border: "#315A4E" },
  onboarding:{ label: "Onboarding",    color: "#806126", bg: "#F0E8D5", border: "#A98643" },
  ai_agent:  { label: "AI Agent",      color: "#7C445E", bg: "#EDE1E7", border: "#7C445E" },
  analytics: { label: "Analytics",     color: "#A14C3B", bg: "#F1E3DE", border: "#A14C3B" },
};

const statusConfig: Record<Project["status"], { label: string; color: string; dot: string }> = {
  live:     { label: "Live",      color: "#315A4E", dot: "#315A4E" },
  dev:      { label: "In Dev",   color: "#806126", dot: "#A14C3B" },
  archived: { label: "Archived", color: "#6E7A7C", dot: "#A8B4AE" },
};

function fmt(s: string) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cat = categoryStyle[project.category];
  const st = statusConfig[project.status];

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer card-hover"
      style={{
        border: "1px solid #D8D3C8",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
        ["--cat-border" as string]: cat.border,
      }}
    >
      {/* Category color top bar */}
      <div
        className="h-[3px] w-full"
        style={{ background: cat.border }}
      />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
            style={{ color: cat.color, background: cat.bg }}
          >
            {cat.label}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: st.dot }}
            />
            <span className="text-[11px] font-medium" style={{ color: st.color }}>
              {st.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-semibold text-[15px] leading-snug text-[#132126] group-hover:text-[#2C5268] transition-colors">
            {project.name}
          </h3>
          {project.client && (
            <p className="text-[11px] text-[#6E7A7C] mt-0.5">for {project.client}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#45545A] leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium rounded-md px-2 py-0.5"
                style={{ color: "#45545A", background: "#DFE4E0", border: "1px solid #C7CFCA" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid #DFE4E0" }}
      >
        <div className="flex items-center gap-3 text-[11px] text-[#6E7A7C]">
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {fmt(project.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw size={10} />
            {fmt(project.updatedAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#6E7A7C]">
          <Code2 size={10} />
          <span>{project.builtWith === "claude_code" ? "Claude Code" : project.builtWith}</span>
        </div>
      </div>

      {/* Arrow on hover */}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowUpRight size={16} style={{ color: cat.color }} />
        </a>
      )}
    </article>
  );
}
