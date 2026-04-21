"use client";

import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function Hero({ projects }: Props) {
  const live = projects.filter((p) => p.status === "live").length;
  const cc = projects.filter((p) => p.builtWith === "claude_code").length;

  return (
    <section className="relative overflow-hidden border-b border-[#E8E3D8]">
      {/* Yellow accent block — top-right decoration */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-70 pointer-events-none"
        style={{
          background: "#F5D800",
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        }}
      />

      <div className="mx-auto max-w-7xl px-8 pt-14 pb-12">
        {/* Nav row */}
        <nav className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full font-display font-bold text-[11px] flex items-center justify-center text-white"
              style={{ background: "#1C3BCC" }}
            >
              Y
            </div>
            <span className="font-display font-semibold text-[13px] text-[#0D0D0D]">
              Yamanaka Allen
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium text-[#6B6860]">
            <a href="#works" className="hover:text-[#0D0D0D] transition-colors">Works</a>
            <a
              href="https://tre-pro.co.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0D0D0D] transition-colors flex items-center gap-0.5"
            >
              Trepro <ArrowUpRight size={12} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-white text-[12px] font-semibold"
              style={{ background: "#1C3BCC" }}
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Hero type */}
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[13px] font-semibold tracking-widest uppercase text-[#B0ADA6] mb-4">
              Product Builder × Claude Code
            </p>
            <h1
              className="font-display font-bold leading-[0.92] tracking-tight text-[#0D0D0D]"
              style={{ fontSize: "clamp(56px, 8vw, 108px)" }}
            >
              YAMA
              <br />
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2px #0D0D0D", color: "transparent" }}
              >
                NAKA
              </span>
              <br />
              <span style={{ color: "#1C3BCC" }}>ALLEN</span>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 pb-2">
            <p className="text-[14px] text-[#6B6860] leading-relaxed mb-6">
              Claude Codeを使って、事業に直結するプロダクトを爆速で作る。
              <br />
              株式会社Trepro / CEO
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-[#0D0D0D]">{projects.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#B0ADA6] mt-0.5">Products</div>
              </div>
              <div className="w-px h-10 bg-[#E8E3D8]" />
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-[#3A8C5C]">{live}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#B0ADA6] mt-0.5">Live</div>
              </div>
              <div className="w-px h-10 bg-[#E8E3D8]" />
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-[#1C3BCC]">{cc}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#B0ADA6] mt-0.5">Claude Code</div>
              </div>
            </div>
          </div>
        </div>

        {/* April goal bar */}
        <div className="mt-10 flex items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B0ADA6]">
            April Goal
          </span>
          <div className="flex-1 max-w-xs h-1.5 rounded-full bg-[#E8E3D8] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((projects.length / 100) * 100, 100)}%`,
                background: "#F5D800",
              }}
            />
          </div>
          <span className="font-display font-bold text-[13px] text-[#0D0D0D]">
            {projects.length}
            <span className="text-[#B0ADA6] font-normal"> / 100</span>
          </span>
        </div>
      </div>
    </section>
  );
}
