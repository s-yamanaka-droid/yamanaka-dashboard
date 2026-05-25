"use client";

import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function Hero({ projects }: Props) {
  const live = projects.filter((p) => p.status === "live").length;

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
            <span
              className="font-frank font-bold text-[22px] tracking-wider text-[#0D0D0D]"
              style={{ fontFamily: "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif", letterSpacing: "0.08em" }}
            >
              LAKKAN
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium text-[#6B6860]">
            <a href="#story" className="hover:text-[#0D0D0D] transition-colors">Story</a>
            <a href="#works" className="hover:text-[#0D0D0D] transition-colors">Works</a>
            <a href="#service" className="hover:text-[#0D0D0D] transition-colors">Service</a>
            <a href="#vigil" className="hover:text-[#0D0D0D] transition-colors">Vigil</a>
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
              自分らしく。楽観して。LUCKを、計画する。
            </p>
            <h1
              style={{
                fontFamily: "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif",
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                color: "#0D0D0D",
                fontSize: "clamp(56px, 8vw, 108px)",
              }}
            >
              楽観と、
              <br />
              <span
                style={{ WebkitTextStroke: "2px #0D0D0D", color: "transparent" }}
              >
                計画と。
              </span>
            </h1>
            <p className="mt-6 text-[15px] text-[#6B6860]" style={{ fontFamily: "var(--font-display), 'Space Grotesk', system-ui, sans-serif" }}>
              LUCK × 楽観 = LAKKAN — Built with AI
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 pb-2">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-[#0D0D0D]">{projects.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#B0ADA6] mt-0.5">プロダクト数</div>
              </div>
              <div className="w-px h-10 bg-[#E8E3D8]" />
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-[#3A8C5C]">{live}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#B0ADA6] mt-0.5">Live</div>
              </div>
              <div className="w-px h-10 bg-[#E8E3D8]" />
              <div className="text-center">
                <div className="font-display font-bold text-sm text-[#1C3BCC] leading-tight">株式会社Lakkan</div>
                <div className="text-[10px] text-[#B0ADA6] mt-0.5">東京・渋谷 / 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
