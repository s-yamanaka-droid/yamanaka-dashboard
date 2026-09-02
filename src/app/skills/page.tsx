"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";

import { LUNA_SB_URL, LUNA_SB_KEY } from "@/lib/supabase";
import { PageHero } from "@/components/PageHero";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

const projects = projectsData as Project[];

/* ── Static skill definitions ── */
const TECH_STACK = [
  { category: "Frontend",  items: ["Next.js", "React", "TypeScript", "Framer Motion", "Tailwind CSS", "Vite"] },
  { category: "Backend",   items: ["Python", "Node.js", "Supabase", "PostgreSQL", "REST API"] },
  { category: "AI / LLM",  items: ["Claude API", "Gemma 3 12B", "Gemini Flash", "Ollama", "RAG Engine", "Prompt Engineering"] },
  { category: "Infra",     items: ["Vercel", "Cloudflare", "launchd", "Git", "GitHub Actions"] },
  { category: "Design",    items: ["Figma", "Typography Systems", "Motion Design", "Editorial UI"] },
  { category: "Business",  items: ["提案資料設計", "商談構造化", "議事録AI化", "CEO指示書生成", "KPI設計"] },
];

const CAPABILITY_AREAS = [
  {
    id: "ai-infra",
    label: "AI Infrastructure",
    desc: "ローカルLLM（Gemma 3 12B）+ Claude API のハイブリッド推論パイプライン。自律エージェント群をlaunchdで24/7稼働。",
    color: "#F4541A",
    metric: "24/7",
    metricLabel: "UPTIME",
  },
  {
    id: "product",
    label: "Product Engineering",
    desc: "企画から本番リリースまで単独完結。Next.js + Supabase スタックで企業向けSaaS・採用プラットフォームを高速構築。",
    color: "#1C3BCC",
    metric: "3–5d",
    metricLabel: "SHIP TIME",
  },
  {
    id: "knowledge",
    label: "Knowledge Automation",
    desc: "商談議事録・会議メモをSlack経由で自動構造化。CEO指示書・提案資料を自動生成し、Notion に転記。",
    color: "#3A8C5C",
    metric: "98%",
    metricLabel: "AUTO RATE",
  },
  {
    id: "design",
    label: "Design Systems",
    desc: "Frank Ruhl Libre × Space Grotesk のエディトリアル言語を軸に、コーポレートから採用まで一貫したUIを実装。",
    color: "#7C3AED",
    metric: "15+",
    metricLabel: "SITES SHIPPED",
  },
];

type BrainStat = {
  ceo_knowledge: number;
  cso_knowledge: number;
  patterns: number;
};

const HR = () => <div style={{ height: 1, background: "#0D0D0D", opacity: 0.1 }} />;

/* ── Tag frequency from projects ── */
function buildTagFreq(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  projects.forEach(p => {
    (p.tags || []).forEach(t => map.set(t, (map.get(t) || 0) + 1));
  });
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export default function SkillsPage() {
  const [brain, setBrain]     = useState<BrainStat | null>(null);
  const [started, setStarted] = useState(false);
  const tagFreq = buildTagFreq();

  useEffect(() => {
    fetch(`${LUNA_SB_URL}/rest/v1/brain_stats?select=ceo_knowledge,cso_knowledge,patterns&order=date.desc&limit=1`, {
      headers: { apikey: LUNA_SB_KEY, Authorization: `Bearer ${LUNA_SB_KEY}` },
    })
      .then(r => r.json())
      .then((d: BrainStat[]) => { if (d[0]) setBrain(d[0]); })
      .catch(() => {});
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const totalKnowledge = brain
    ? brain.ceo_knowledge + brain.cso_knowledge
    : projects.length * 4;

  return (
    <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#0D0D0D" }}>

      {/* ── Nav ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(247,244,238,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(13,13,13,0.1)", padding: "0 56px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700,
            color: "#0D0D0D", textDecoration: "none", letterSpacing: "0.05em" }}>YAMANAKA SHUTO</Link>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[["Works", "/#works"], ["Lab", "/lab"], ["Evolution", "/evolution"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500,
                color: "#0D0D0D", textDecoration: "none", opacity: 0.55 }}>{l}</Link>
            ))}
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D" }}>Skills</span>
            <Link href="https://github.com/s-yamanaka-droid" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 3, opacity: 0.55 }}>
              GitHub <ArrowUpRight size={11} />
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Unified PageHero ── */}
      <div style={{ paddingTop: 52 }}>
        <PageHero
          section="Skills"
          version="v.3.0"
          title="AI-Native Engineer"
          lede="ローカルLLMからプロダクト構築まで、企画から本番リリースまで単独完結する。Lakkanの中身を支える技術スタックと能力地図"
        />
      </div>

      {/* ── Hero ── */}
      <div style={{ background: "#F7F4EE", padding: "120px 56px 64px", position: "relative",
        borderBottom: "1px solid rgba(13,13,13,0.12)", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -16, right: 40, fontFamily: FRANK,
          fontSize: "clamp(120px,18vw,260px)", fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1px rgba(13,13,13,0.06)", lineHeight: 1, pointerEvents: "none",
          letterSpacing: "-0.03em", userSelect: "none" }}>
          skills/
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em",
            color: "#0D0D0D", opacity: 0.4, marginBottom: 20 }}>CAPABILITY PROFILE</div>

          <div style={{ fontFamily: FRANK, fontSize: "clamp(56px,9vw,128px)", fontWeight: 400,
            lineHeight: 0.88, letterSpacing: "-0.02em", color: "#0D0D0D", marginBottom: 40 }}>
            AI-Native<br />
            <span style={{ color: "#F4541A" }}>Engineer</span>
          </div>

          <HR />

          <div style={{ display: "flex", gap: 56, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { label: "PROJECTS SHIPPED",  value: projects.length },
              { label: "KNOWLEDGE DOCS",    value: totalKnowledge },
              { label: "TECH CATEGORIES",   value: TECH_STACK.length },
              { label: "PATTERNS LEARNED",  value: brain?.patterns ?? 16 },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: FRANK, fontSize: "clamp(36px,5vw,64px)",
                  fontWeight: 400, lineHeight: 1, color: "#0D0D0D" }}>{value}</div>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.2em",
                  color: "#0D0D0D", opacity: 0.38, marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ padding: "0 56px 120px" }}>

        {/* ── Capability Areas ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>CORE CAPABILITIES</div>
          <HR />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 0 }}>
            {CAPABILITY_AREAS.map((cap, i) => (
              <motion.div key={cap.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                style={{
                  padding: "40px 40px 40px 0",
                  borderRight: i % 2 === 0 ? "1px solid rgba(13,13,13,0.1)" : "none",
                  borderBottom: i < 2 ? "1px solid rgba(13,13,13,0.1)" : "none",
                  paddingLeft: i % 2 === 1 ? 40 : 0,
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.15em",
                    color: cap.color, fontWeight: 600 }}>{cap.label.toUpperCase()}</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FRANK, fontSize: 32, fontWeight: 400, color: cap.color, lineHeight: 1 }}>{cap.metric}</div>
                    <div style={{ fontFamily: SANS, fontSize: 8, letterSpacing: "0.15em", color: "#0D0D0D", opacity: 0.35, marginTop: 2 }}>{cap.metricLabel}</div>
                  </div>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 13, color: "#0D0D0D", opacity: 0.65, lineHeight: 1.7 }}>
                  {cap.desc}
                </div>
              </motion.div>
            ))}
          </div>
          <HR />
        </div>

        {/* ── Tech Stack ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>TECH STACK</div>
          <HR />

          {TECH_STACK.map((group, gi) => (
            <motion.div key={group.category}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.06 * gi }}
              style={{ display: "grid", gridTemplateColumns: "140px 1fr",
                gap: 24, padding: "20px 0",
                borderBottom: "1px solid rgba(13,13,13,0.07)", alignItems: "center" }}>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.12em",
                color: "#0D0D0D", opacity: 0.4, fontWeight: 600 }}>{group.category.toUpperCase()}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {group.items.map(item => (
                  <span key={item} style={{
                    fontFamily: SANS, fontSize: 11, color: "#0D0D0D",
                    border: "1px solid rgba(13,13,13,0.2)", borderRadius: 2,
                    padding: "3px 10px", letterSpacing: "0.04em",
                  }}>{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Project Tags Cloud ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>DOMAIN COVERAGE</div>
          <HR />
          <div style={{ paddingTop: 32, paddingBottom: 32, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "baseline" }}>
            {tagFreq.slice(0, 28).map(({ tag, count }) => {
              const size = 10 + count * 3;
              return (
                <motion.span key={tag}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: Math.random() * 0.4 }}
                  style={{
                    fontFamily: FRANK,
                    fontSize: Math.min(size, 28),
                    color: "#0D0D0D",
                    opacity: 0.35 + (count / 10),
                    lineHeight: 1.3,
                  }}>
                  {tag}
                </motion.span>
              );
            })}
          </div>
          <HR />
        </div>

        {/* ── Brain Stats from Supabase ── */}
        {brain && (
          <div style={{ marginTop: 64 }}>
            <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
              color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>ACCUMULATED INTELLIGENCE</div>
            <HR />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, paddingTop: 8 }}>
              {[
                { label: "CSO Knowledge", value: brain.cso_knowledge, desc: "商談・提案・顧客ナレッジ", color: "#3A8C5C" },
                { label: "CEO Knowledge", value: brain.ceo_knowledge, desc: "経営判断・指示書・思考パターン", color: "#1C3BCC" },
                { label: "Patterns",      value: brain.patterns,      desc: "学習済みビジネスパターン", color: "#F4541A" },
              ].map(({ label, value, desc, color }, i) => (
                <div key={label} style={{
                  padding: "32px 32px 32px 0",
                  borderRight: i < 2 ? "1px solid rgba(13,13,13,0.1)" : "none",
                  paddingLeft: i > 0 ? 32 : 0,
                }}>
                  <div style={{ fontFamily: FRANK, fontSize: 48, fontWeight: 400, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.1em",
                    color: "#0D0D0D", opacity: 0.45, marginTop: 6 }}>{label.toUpperCase()}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: "#0D0D0D",
                    opacity: 0.4, marginTop: 8, lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            <HR />
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: 80 }}>
          <HR />
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", paddingTop: 20 }}>
            <span style={{ fontFamily: FRANK, fontSize: 13, color: "#0D0D0D", opacity: 0.32 }}>
              (shoot-agent@v2 — updated daily)
            </span>
            <Link href="/" style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D",
              opacity: 0.45, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
