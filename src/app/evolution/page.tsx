"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LUNA_SB_URL, LUNA_SB_KEY } from "@/lib/supabase";
import { PageHero } from "@/components/PageHero";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

type BrainStat = {
  date: string;
  ceo_knowledge: number;
  cso_knowledge: number;
  patterns: number;
  today_processed: number;
  today_success: number;
  today_failed: number;
  recorded_at: string;
};

/* ── CountUp ── */
function CountUp({ target, started }: { target: number; started: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const dur = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return <>{val}</>;
}

/* ── Sparkline SVG ── */
function Sparkline({ data, color, height = 48 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const w = 280;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const fill = [
    `M ${pts[0]}`,
    ...pts.slice(1).map(p => `L ${p}`),
    `L ${w},${height} L 0,${height} Z`,
  ].join(" ");
  const line = [`M ${pts[0]}`, ...pts.slice(1).map(p => `L ${p}`)].join(" ");

  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#g-${color.replace("#","")})`} />
      <path d={line} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].split(",")[0]} cy={pts[pts.length-1].split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

const HR = () => <div style={{ height: 1, background: "#0D0D0D", opacity: 0.12 }} />;

export default function EvolutionPage() {
  const [stats, setStats]       = useState<BrainStat[]>([]);
  const [started, setStarted]   = useState(false);
  const [updated, setUpdated]   = useState("");
  const [pulse, setPulse]       = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    const res = await fetch(
      `${LUNA_SB_URL}/rest/v1/brain_stats?select=date,recorded_at,ceo_knowledge,cso_knowledge,patterns,today_processed,today_success,today_failed&order=date.asc&limit=90`,
      { headers: { apikey: LUNA_SB_KEY, Authorization: `Bearer ${LUNA_SB_KEY}` } }
    );
    const data: BrainStat[] = await res.json();
    setStats(data);
    if (data.length) {
      setUpdated(new Date(data[data.length-1].recorded_at).toLocaleString("ja-JP", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" }));
      setPulse(true);
      setTimeout(() => setPulse(false), 1500);
    }
  };

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 30_000); // 30秒ごと
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, [stats]);

  const latest = stats[stats.length - 1];
  const first  = stats[0];
  const total  = latest ? latest.cso_knowledge + latest.ceo_knowledge : 0;
  const delta  = (latest && first)
    ? total - (first.cso_knowledge + first.ceo_knowledge)
    : 0;

  const csoSpark = stats.map(s => s.cso_knowledge);
  const ceoSpark = stats.map(s => s.ceo_knowledge);
  const patSpark = stats.map(s => s.patterns);

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getMonth()+1}/${dt.getDate()}`;
  };

  return (
    <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#0D0D0D" }}>

      {/* ── Nav ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(247,244,238,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(13,13,13,0.1)", padding: "0 56px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: "#0D0D0D",
            textDecoration: "none", letterSpacing: "0.05em" }}>YAMANAKA SHUTO</Link>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {([["Works","/#works"],["Portals","/#portals"],["Skills","/skills"],["Lab","/lab"]] as [string,string][]).map(([l, h]) => (
              <Link key={l} href={h} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500,
                color: "#0D0D0D", textDecoration: "none", opacity: 0.55 }}>{l}</Link>
            ))}
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D" }}>Evolution</span>
            <Link href="/"
              style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 3, opacity: 0.55 }}>
              Lakkan
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Unified PageHero ── */}
      <div style={{ paddingTop: 52 }}>
        <PageHero
          section="Evolution"
          version="v.2.0"
          title="Brain in Motion"
          lede="Shoot Agent v2 が毎晩学習し、毎日進化する。知識ファイル・パターン・処理量の推移を、社長視点で生中継"
        />
      </div>

      {/* ── Hero ── */}
      <div ref={heroRef} style={{ background: "#F4541A", padding: "120px 56px 64px", position: "relative", overflow: "hidden" }}>
        {/* 背景テキスト */}
        <div style={{ position: "absolute", bottom: -24, right: 40, fontFamily: FRANK,
          fontSize: "clamp(120px,18vw,260px)", fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1px rgba(13,13,13,0.12)", lineHeight: 1, pointerEvents: "none",
          letterSpacing: "-0.03em", userSelect: "none" }}>
          brain/
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom: 20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width:6, height:6, borderRadius:"50%", background:"#0D0D0D" }}
              />
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", color: "#0D0D0D", opacity: 0.6 }}>
                SHOOT AGENT v2 — SYSTEM EVOLUTION
              </span>
            </div>
            {updated && (
              <motion.span
                animate={{ opacity: pulse ? 1 : 0.35, scale: pulse ? 1.04 : 1 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: SANS, fontSize: 10, color: "#0D0D0D",
                  background: "rgba(13,13,13,0.1)", padding: "3px 10px", borderRadius: 100,
                  letterSpacing: "0.08em" }}>
                synced {updated}
              </motion.span>
            )}
          </div>

          <div style={{ fontFamily: FRANK, fontSize: "clamp(56px,9vw,130px)", fontWeight: 400,
            lineHeight: 0.88, letterSpacing: "-0.02em", color: "#0D0D0D", marginBottom: 32 }}>
            <CountUp target={total} started={started} />
            <span style={{ opacity: 0.4, fontSize: "0.5em", marginLeft: 12 }}>docs</span>
          </div>

          <HR />

          <div style={{ display: "flex", gap: 56, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { label: "CSO KNOWLEDGE", value: latest?.cso_knowledge ?? 0 },
              { label: "CEO KNOWLEDGE", value: latest?.ceo_knowledge ?? 0 },
              { label: "PATTERNS",      value: latest?.patterns ?? 0 },
              { label: "DELTA",         value: `+${delta}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: FRANK, fontSize: "clamp(32px,4vw,56px)", fontWeight: 400,
                  lineHeight: 1, color: "#0D0D0D" }}>
                  {typeof value === "number"
                    ? <CountUp target={value} started={started} />
                    : value}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.2em",
                  color: "#0D0D0D", opacity: 0.45, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Body ── */}
      <div style={{ padding: "0 56px 120px" }}>

        {/* Growth charts */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.38, marginBottom: 24 }}>KNOWLEDGE GROWTH</div>
          <HR />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            {[
              { label: "CSO Knowledge",   data: csoSpark, color: "#3A8C5C", current: latest?.cso_knowledge },
              { label: "CEO Knowledge",   data: ceoSpark, color: "#1C3BCC", current: latest?.ceo_knowledge },
              { label: "Patterns",        data: patSpark, color: "#F4541A", current: latest?.patterns },
            ].map(({ label, data, color, current }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{ padding: "32px 32px 32px 0", borderRight: i < 2 ? "1px solid rgba(13,13,13,0.1)" : "none",
                  paddingLeft: i > 0 ? 32 : 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.1em",
                  color: "#0D0D0D", opacity: 0.45, marginBottom: 8 }}>{label.toUpperCase()}</div>
                <div style={{ fontFamily: FRANK, fontSize: 40, fontWeight: 400,
                  color: "#0D0D0D", lineHeight: 1, marginBottom: 20 }}>
                  {current ?? "—"}
                </div>
                {data.length >= 2
                  ? <Sparkline data={data} color={color} height={44} />
                  : <div style={{ height: 44, fontFamily: SANS, fontSize: 11,
                      color: "#0D0D0D", opacity: 0.3, display: "flex", alignItems: "center" }}>
                      蓄積中...
                    </div>
                }
              </motion.div>
            ))}
          </div>
          <HR />
        </div>

        {/* Nightly log */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.38, marginBottom: 24 }}>NIGHTLY REVIEW LOG</div>
          <HR />

          {[...stats].reverse().slice(0, 10).map((s, i) => (
            <motion.div key={s.date}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              style={{ display: "grid", gridTemplateColumns: "80px 80px 80px 1fr",
                gap: 24, padding: "20px 0", alignItems: "start",
                borderBottom: "1px solid rgba(13,13,13,0.08)" }}>
              <div style={{ fontFamily: FRANK, fontSize: 16, fontWeight: 400,
                color: "#0D0D0D", opacity: 0.5 }}>{fmtDate(s.date)}</div>
              <div>
                <div style={{ fontFamily: FRANK, fontSize: 22, fontWeight: 400, color: "#3A8C5C" }}>
                  {s.today_success}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.12em",
                  color: "#0D0D0D", opacity: 0.35, marginTop: 2 }}>SUCCESS</div>
              </div>
              <div>
                <div style={{ fontFamily: FRANK, fontSize: 22, fontWeight: 400,
                  color: s.today_failed > 0 ? "#E8694A" : "#0D0D0D", opacity: s.today_failed > 0 ? 1 : 0.2 }}>
                  {s.today_failed}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.12em",
                  color: "#0D0D0D", opacity: 0.35, marginTop: 2 }}>FAILED</div>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D",
                opacity: 0.5, lineHeight: 1.6, paddingTop: 4 }}>
                {s.today_processed > 0 ? `${s.today_processed} records processed` : "—"}
              </div>
            </motion.div>
          ))}

          {stats.length === 0 && (
            <div style={{ padding: "48px 0", fontFamily: SANS, fontSize: 13,
              color: "#0D0D0D", opacity: 0.3 }}>
              データ蓄積中 — nightly_review.py が毎晩23:30に記録します
            </div>
          )}
        </div>

        {/* Footer rule */}
        <div style={{ marginTop: 80 }}>
          <HR />
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", paddingTop: 20 }}>
            <span style={{ fontFamily: FRANK, fontSize: 13, color: "#0D0D0D", opacity: 0.32 }}>
              (shoot-agent@v2)
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
