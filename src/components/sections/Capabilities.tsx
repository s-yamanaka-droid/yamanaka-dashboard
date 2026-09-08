"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionShell, Em, Lede } from "@/components/primitives/SectionShell";
import { ACCENT, EASE, SANS } from "@/lib/design-tokens";

const PHASES = [
  {
    num: "01",
    label: "Define",
    title: "AI導入・業務再設計",
    body: "いまの業務を棚卸しし、AIに任せる領域と人が担う判断を整理。実装できるロードマップまで落とし込みます。",
    outputs: ["業務フロー", "導入ロードマップ", "KPI設計"],
    accent: ACCENT.vermillion,
    note: "ASK THE RIGHT QUESTION",
  },
  {
    num: "02",
    label: "Build",
    title: "AIプロダクト・Web開発",
    body: "AIエージェント、業務アプリ、コーポレートサイトを素早く形にし、実際に触れるプロダクトとして公開します。",
    outputs: ["AIエージェント", "Webアプリ", "コーポレートサイト"],
    accent: ACCENT.blue,
    note: "MAKE IT REAL",
  },
  {
    num: "03",
    label: "Run",
    title: "運用・定着・改善",
    body: "導入して終わりにせず、現場で使われる状態まで伴走。運用データと知見を次の改善へつなぎます。",
    outputs: ["導入伴走", "改善サイクル", "ナレッジ化"],
    accent: ACCENT.forest,
    note: "KEEP IT MOVING",
  },
] as const;

function PhaseDiagram({ index, accent }: { index: number; accent: string }) {
  const common = {
    fill: "none",
    stroke: accent,
    strokeWidth: 1.4,
    vectorEffect: "non-scaling-stroke" as const,
  };

  if (index === 0) {
    return (
      <svg viewBox="0 0 520 280" role="img" aria-label="業務を分解して実装計画へ変換する設計図">
        <circle cx="258" cy="140" r="90" {...common} opacity="0.34" />
        <circle cx="258" cy="140" r="55" {...common} strokeDasharray="5 9" />
        <motion.path d="M55 212 C135 165 164 78 258 140 C348 201 390 96 470 54" {...common} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />
        {[[55,212],[258,140],[470,54],[167,89],[389,185]].map(([cx,cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={i === 1 ? 8 : 5} fill={i === 1 ? accent : "#E4E8E4"} stroke={accent} strokeWidth="1.4" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: EASE }} />
        ))}
        <text x="52" y="238" fill="#45545A" fontSize="11" fontFamily={SANS}>CURRENT</text>
        <text x="424" y="40" fill="#45545A" fontSize="11" fontFamily={SANS}>TARGET</text>
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 520 280" role="img" aria-label="プロダクトを組み立てる画面設計図">
        <rect x="48" y="38" width="424" height="204" rx="4" {...common} opacity="0.4" />
        <path d="M48 78 H472 M178 78 V242" {...common} opacity="0.28" />
        <motion.rect x="198" y="101" width="104" height="74" rx="2" {...common} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} />
        <motion.rect x="320" y="101" width="126" height="28" rx="2" fill={accent} opacity="0.16" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.7, ease: EASE }} style={{ transformOrigin: "320px 115px" }} />
        <path d="M320 148 H446 M320 166 H410 M198 198 H446 M198 216 H372" {...common} opacity="0.5" />
        <circle cx="77" cy="58" r="4" fill={accent} />
        <circle cx="92" cy="58" r="4" fill={accent} opacity="0.45" />
        <circle cx="107" cy="58" r="4" fill={accent} opacity="0.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 280" role="img" aria-label="運用データを継続改善につなげる設計図">
      <path d="M48 220 H472 M48 176 H472 M48 132 H472 M48 88 H472 M48 44 H472" {...common} opacity="0.16" />
      <motion.path d="M48 205 C92 197 112 158 158 172 C206 187 229 105 278 126 C326 147 354 72 404 89 C434 99 452 63 472 52" {...common} strokeWidth="2.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.35, ease: EASE }} />
      {[42,72,102,132,162].map((height, i) => (
        <motion.rect key={height} x={76 + i * 72} y={234 - height} width="34" height={height} fill={accent} opacity={0.12 + i * 0.05} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.65, ease: EASE }} style={{ transformOrigin: `${93 + i * 72}px 234px` }} />
      ))}
      <circle cx="472" cy="52" r="7" fill={accent} />
    </svg>
  );
}

function CapabilityScene({
  phase,
  index,
}: {
  phase: (typeof PHASES)[number];
  index: number;
}) {
  return (
    <article className="capability-scene" style={{ "--phase-accent": phase.accent } as React.CSSProperties}>
      <div className="capability-scene-copy">
        <div className="capability-scene-kicker">
          <span>{phase.num}</span>
          <span>{phase.label}</span>
        </div>
        <h3>{phase.title}</h3>
        <p>{phase.body}</p>
        <ul>
          {phase.outputs.map((output) => <li key={output}>{output}</li>)}
        </ul>
      </div>
      <div className="capability-scene-visual">
        <span className="capability-scene-note">{phase.note}</span>
        <PhaseDiagram index={index} accent={phase.accent} />
        <span className="capability-scene-coordinate">LAKKAN / 35.6762° N / 139.6503° E</span>
      </div>
    </article>
  );
}

export function Capabilities({ totalProjects }: { totalProjects: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const railX = useTransform(scrollYProgress, [0, 1], ["0%", "-66.6667%"]);
  const progressX: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0.03, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActivePhase(Math.min(2, Math.floor(value * 3)));
  });

  const jumpToPhase = (index: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const range = stage.offsetHeight - window.innerHeight;
    const stageTop = window.scrollY + stage.getBoundingClientRect().top;
    window.scrollTo({
      top: stageTop + range * (index / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <SectionShell
      id="capabilities"
      tone="creamLight"
      eyebrow="What we do"
      eyebrowVersion="0.4"
      accent="blue"
      topBorder
      allowSticky
    >
      <div ref={stageRef} className="capability-motion-stage">
        <div className="capability-motion-stick">
          <div className="capability-motion-head" data-mobile-stack="capability-head">
            <motion.h2
              className="editorial-heading editorial-heading--display"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              AIを、<br />
              <Em accent="blue">現場で動かす。</Em>
            </motion.h2>
            <div>
              <Lede maxWidth={420}>
                Lakkanは、戦略だけでも制作だけでもない。構想、実装、運用をひとつのチームでつなぎ、AIが現場で動くところまで前に進めます。
              </Lede>
              <div className="capability-phase-nav" aria-label="支援フェーズ">
                {PHASES.map((phase, index) => (
                  <button
                    key={phase.num}
                    type="button"
                    className={activePhase === index ? "is-active" : ""}
                    aria-current={activePhase === index ? "step" : undefined}
                    onClick={() => jumpToPhase(index)}
                  >
                    <span>{phase.num}</span>{phase.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="capability-progress" aria-hidden="true">
            <motion.span style={{ scaleX: progressX }} />
          </div>

          <div className="capability-motion-viewport">
            <motion.div className="capability-motion-track" style={{ x: railX }}>
              {PHASES.map((phase, index) => (
                <CapabilityScene key={phase.num} phase={phase} index={index} />
              ))}
            </motion.div>
          </div>

          <div className="capability-proof" data-mobile-stack="capability-proof">
            <div>
              <span>{totalProjects}</span>
              <span>Public works — every link is open</span>
            </div>
            <div>
              <Link href="/services">サービスを見る <ArrowRight size={15} /></Link>
              <Link href="/works">公開実績を見る <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
