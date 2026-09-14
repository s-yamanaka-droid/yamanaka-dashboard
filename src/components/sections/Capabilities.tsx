"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionShell, Em, Lede } from "@/components/primitives/SectionShell";
import { ACCENT, EASE, FRANK, INSTRUMENT, SANS } from "@/lib/design-tokens";

const PHASES = [
  {
    num: "01",
    label: "Define",
    title: "AI導入・業務再設計",
    body: "いまの業務を棚卸しし、AIに任せる領域と人が担う判断を整理。実装できるロードマップまで落とし込みます。",
    outputs: ["業務フロー", "導入ロードマップ", "KPI設計"],
  },
  {
    num: "02",
    label: "Build",
    title: "AIプロダクト・Web開発",
    body: "AIエージェント、業務アプリ、コーポレートサイトを素早く形にし、実際に触れるプロダクトとして公開します。",
    outputs: ["AIエージェント", "Webアプリ", "コーポレートサイト"],
  },
  {
    num: "03",
    label: "Run",
    title: "運用・定着・改善",
    body: "導入して終わりにせず、現場で使われる状態まで伴走。運用データと知見を次の改善へつなげます。",
    outputs: ["導入伴走", "改善サイクル", "ナレッジ化"],
  },
] as const;

export function Capabilities({ totalProjects }: { totalProjects: number }) {
  return (
    <SectionShell
      id="capabilities"
      tone="creamLight"
      eyebrow="What we do"
      eyebrowVersion="0.3"
      accent="blue"
      topBorder
    >
      <div data-mobile-stack="capability-head" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: "clamp(32px, 8vw, 120px)", alignItems: "end" }}>
        <motion.h2
          className="editorial-heading editorial-heading--display"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(44px, 7.2vw, 108px)",
            fontWeight: 400,
            lineHeight: 0.98,
            color: "#132126",
            letterSpacing: "-0.025em",
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          AIを、<br />
          <Em accent="blue">現場で動かす。</Em>
        </motion.h2>
        <Lede maxWidth={420}>
          Lakkanは、戦略だけでも制作だけでもない。構想、実装、運用をひとつのチームでつなぎ、AIが現場で動くところまで前に進めます。
        </Lede>
      </div>

      <div
        data-mobile-stack="capability-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          borderTop: "1px solid rgba(19,33,38,0.14)",
          borderBottom: "1px solid rgba(19,33,38,0.14)",
          marginTop: 56,
        }}
      >
        {PHASES.map((phase, index) => (
          <motion.article
            key={phase.num}
            data-mobile-stack="capability-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.1, duration: 0.55, ease: EASE }}
            style={{
              padding: index === 0 ? "40px 32px 42px 0" : "40px 32px 42px",
              borderRight: index < PHASES.length - 1 ? "1px solid rgba(19,33,38,0.12)" : 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, marginBottom: 24 }}>
              <span style={{ fontFamily: INSTRUMENT, fontSize: 28, fontStyle: "italic", color: ACCENT.blue }}>{phase.num}</span>
              <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#6E7A7C", textTransform: "uppercase" }}>{phase.label}</span>
            </div>
            <h3 style={{ fontFamily: FRANK, fontSize: "clamp(24px, 2.2vw, 32px)", fontWeight: 400, lineHeight: 1.22, letterSpacing: "-0.01em", color: "#132126", margin: "0 0 18px" }}>
              {phase.title}
            </h3>
            <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.8, color: "#45545A", margin: "0 0 28px" }}>
              {phase.body}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {phase.outputs.map((output) => (
                <li key={output} style={{ fontFamily: SANS, fontSize: 10.5, color: "#2C5268", letterSpacing: "0.04em", border: "1px solid rgba(44,82,104,0.22)", padding: "6px 9px", borderRadius: 99 }}>
                  {output}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      <div
        data-mobile-stack="capability-proof"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 28, paddingTop: 36 }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: INSTRUMENT, fontSize: "clamp(44px, 5vw, 72px)", fontStyle: "italic", lineHeight: 1, color: "#132126" }}>{totalProjects}</span>
          <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.17em", color: "#45545A", textTransform: "uppercase" }}>Public works — every link is open</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/services" style={{ minHeight: 46, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 18px", borderRadius: 6, background: "#132126", color: "#EEF0EC", fontFamily: SANS, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            サービスを見る <ArrowRight size={15} />
          </Link>
          <Link href="/works" style={{ minHeight: 46, display: "inline-flex", alignItems: "center", gap: 8, padding: "0 17px", borderRadius: 6, border: "1px solid rgba(19,33,38,0.22)", color: "#132126", fontFamily: SANS, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            公開実績を見る <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
