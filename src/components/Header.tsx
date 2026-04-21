"use client";

import { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function Header({ projects }: Props) {
  const live = projects.filter((p) => p.status === "live").length;
  const claudeCode = projects.filter((p) => p.builtWith === "claude_code").length;

  return (
    <header className="border-b border-white/[0.07] bg-white/[0.02] backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white/90">
            Yamanaka Portfolio
          </h1>
          <p className="text-[11px] text-white/35 mt-0.5">
            {projects.length} projects · {live} live · {claudeCode} built with Claude Code
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xl font-bold text-white tabular-nums">
              {projects.length}
              <span className="text-sm font-normal text-white/30 ml-1">/ 100</span>
            </div>
            <div className="text-[10px] text-white/30 mt-0.5 uppercase tracking-widest">April Goal</div>
          </div>
          <div
            className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white"
            title="Yamanaka Shuto"
          >
            Y
          </div>
        </div>
      </div>
    </header>
  );
}
