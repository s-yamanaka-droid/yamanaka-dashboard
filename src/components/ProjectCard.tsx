"use client";

import { ArrowUpRight, Calendar, RotateCcw, Code2 } from "lucide-react";
import { Project } from "@/types";

const categoryStyle: Record<
  Project["category"],
  { label: string; color: string; bg: string; border: string }
> = {
  website:   { label: "Website",       color: "#1C3BCC", bg: "#EEF1FF", border: "#1C3BCC" },
  internal:  { label: "Internal Tool", color: "#7C3AED", bg: "#F3EEFF", border: "#7C3AED" },
  external:  { label: "External Tool", color: "#3A8C5C", bg: "#EDF5F1", border: "#3A8C5C" },
  onboarding:{ label: "Onboarding",    color: "#B07D00", bg: "#FFF9CC", border: "#F5D800" },
  ai_agent:  { label: "AI Agent",      color: "#D4317A", bg: "#FEF0F6", border: "#D4317A" },
  analytics: { label: "Analytics",     color: "#C05A30", bg: "#FFF0EB", border: "#E8694A" },
};

const statusConfig: Record<Project["status"], { label: string; color: string; dot: string }> = {
  live:     { label: "Live",      color: "#3A8C5C", dot: "#3A8C5C" },
  dev:      { label: "In Dev",   color: "#B07D00", dot: "#F5D800" },
  archived: { label: "Archived", color: "#B0ADA6", dot: "#D0CCC4" },
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
          <h3 className="font-display font-semibold text-[15px] leading-snug text-[#0D0D0D] group-hover:text-[#1C3BCC] transition-colors">
            {project.name}
          </h3>
          {project.client && (
            <p className="text-[11px] text-[#B0ADA6] mt-0.5">for {project.client}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#6B6860] leading-relaxed line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium rounded-md px-2 py-0.5"
                style={{ color: "#6B6860", background: "#F0EDE6", border: "1px solid #E8E3D8" }}
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
        style={{ borderTop: "1px solid #F0EDE6" }}
      >
        <div className="flex items-center gap-3 text-[11px] text-[#B0ADA6]">
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {fmt(project.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw size={10} />
            {fmt(project.updatedAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#B0ADA6]">
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
