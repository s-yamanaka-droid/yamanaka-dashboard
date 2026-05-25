"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SB_URL, SB_KEY } from "@/lib/supabase";
import { PageHero } from "@/components/PageHero";
const GH_USER = "s-yamanaka-droid";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

type ActivityItem = {
  id: string;
  ts: string;
  source: "github" | "claude_code" | "claude_desktop" | "system";
  action: string;
  target: string;
  summary: string;
  url?: string;
};

type GHEvent = {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: { commits?: { message: string }[]; ref?: string; description?: string };
  created_at: string;
};

type SBActivity = {
  id: string;
  recorded_at: string;
  source: string;
  action: string;
  target: string;
  summary: string;
};

/* ── helpers ── */
const reltime = (ts: string) => {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

const SOURCE_LABEL: Record<string, string> = {
  github:         "GitHub",
  claude_code:    "Claude Code",
  claude_desktop: "Claude Desktop",
  system:         "System",
};
const SOURCE_COLOR: Record<string, string> = {
  github:         "#0D0D0D",
  claude_code:    "#F4541A",
  claude_desktop: "#1C3BCC",
  system:         "#3A8C5C",
};

const HR = () => <div style={{ height: 1, background: "#0D0D0D", opacity: 0.1 }} />;

function ghEventToActivity(e: GHEvent): ActivityItem {
  const repo = e.repo.name.replace(`${GH_USER}/`, "");
  const msg = e.payload.commits?.[0]?.message || e.payload.description || e.type;
  return {
    id:      e.id,
    ts:      e.created_at,
    source:  "github",
    action:  e.type.replace("Event", "").toLowerCase(),
    target:  repo,
    summary: msg.split("\n")[0].slice(0, 100),
    url:     `https://github.com/${e.repo.name}`,
  };
}

export default function LabPage() {
  const [items, setItems]       = useState<ActivityItem[]>([]);
  const [ghCount, setGhCount]   = useState(0);
  const [ccCount, setCcCount]   = useState(0);
  const [live, setLive]         = useState(false);
  const prevIds = useRef(new Set<string>());

  const fetchGitHub = async (): Promise<ActivityItem[]> => {
    try {
      const res = await fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=30`);
      if (!res.ok) return [];
      const data: GHEvent[] = await res.json();
      return data.map(ghEventToActivity);
    } catch { return []; }
  };

  const fetchSupabase = async (): Promise<ActivityItem[]> => {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/activity_log?order=recorded_at.desc&limit=50`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      if (!res.ok) return [];
      const data: SBActivity[] = await res.json();
      return data.map(d => ({
        id:      d.id,
        ts:      d.recorded_at,
        source:  d.source as ActivityItem["source"],
        action:  d.action,
        target:  d.target,
        summary: d.summary,
      }));
    } catch { return []; }
  };

  const merge = (a: ActivityItem[], b: ActivityItem[]): ActivityItem[] => {
    const map = new Map<string, ActivityItem>();
    [...a, ...b].forEach(i => map.set(i.id, i));
    return [...map.values()].sort((x, y) => new Date(y.ts).getTime() - new Date(x.ts).getTime());
  };

  const refresh = async () => {
    const [gh, sb] = await Promise.all([fetchGitHub(), fetchSupabase()]);
    const merged = merge(gh, sb);

    // 新着検出
    const newIds = merged.map(i => i.id);
    const isNew = newIds.some(id => !prevIds.current.has(id));
    if (isNew && prevIds.current.size > 0) setLive(true);
    newIds.forEach(id => prevIds.current.add(id));

    setItems(merged);
    setGhCount(gh.length);
    setCcCount(sb.length);
    setTimeout(() => setLive(false), 2000);
  };

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 30_000); // 30秒ごと
    return () => clearInterval(iv);
  }, []);

  const today = items.filter(i => {
    const d = new Date(i.ts);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

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
            {([["Works","/#works"],["Portals","/#portals"],["Skills","/skills"],["Evolution","/evolution"]] as [string,string][]).map(([l,h]) => (
              <Link key={l} href={h} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500,
                color: "#0D0D0D", textDecoration: "none", opacity: 0.55 }}>{l}</Link>
            ))}
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D" }}>Lab</span>
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
          section="Lab"
          version="v.1.0"
          title="Activity Stream"
          lede="GitHub・Claude Code・社内システムの稼働ログを一本のストリームに束ねる。30秒ごとに更新される、生中継の作業記録"
        />
      </div>

      {/* ── Hero ── */}
      <div style={{ background: "#0D0D0D", padding: "120px 56px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -32, right: 40, fontFamily: FRANK,
          fontSize: "clamp(100px,16vw,240px)", fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1px rgba(247,244,238,0.08)", lineHeight: 1,
          pointerEvents: "none", letterSpacing: "-0.03em", userSelect: "none" }}>
          live/
        </div>

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#F4541A" }}
          />
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em",
            color: "rgba(247,244,238,0.45)" }}>
            {live ? "NEW ACTIVITY" : "LIVE — updates every 30s"}
          </span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontFamily: FRANK, fontSize: "clamp(48px,8vw,110px)", fontWeight: 400,
            lineHeight: 0.9, letterSpacing: "-0.02em", color: "#F7F4EE", marginBottom: 40 }}>
            Activity<br />
            <span style={{ opacity: 0.35 }}>Stream</span>
          </div>

          <div style={{ height: 1, background: "rgba(247,244,238,0.12)", marginBottom: 32 }} />

          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { label: "TODAY",          value: today.length },
              { label: "GITHUB EVENTS",  value: ghCount },
              { label: "CLAUDE ACTIONS", value: ccCount },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: FRANK, fontSize: "clamp(28px,4vw,52px)",
                  fontWeight: 400, lineHeight: 1, color: "#F7F4EE" }}>{value}</div>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.2em",
                  color: "rgba(247,244,238,0.35)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Stream ── */}
      <div style={{ padding: "0 56px 120px" }}>
        <div style={{ marginTop: 56 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>ACTIVITY LOG</div>
          <HR />

          <AnimatePresence>
            {items.length === 0 && (
              <div style={{ padding: "48px 0", fontFamily: SANS, fontSize: 13, color: "#0D0D0D", opacity: 0.3 }}>
                Loading activity...
              </div>
            )}
            {items.slice(0, 60).map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.6) }}
                style={{ display: "grid", gridTemplateColumns: "100px 110px 140px 1fr 60px",
                  gap: 20, padding: "16px 0", alignItems: "center",
                  borderBottom: "1px solid rgba(13,13,13,0.07)" }}>

                {/* Timestamp */}
                <div style={{ fontFamily: SANS, fontSize: 11, color: "#0D0D0D", opacity: 0.35 }}>
                  {reltime(item.ts)}
                </div>

                {/* Source badge */}
                <div>
                  <span style={{
                    fontFamily: SANS, fontSize: 9, letterSpacing: "0.12em", fontWeight: 600,
                    color: SOURCE_COLOR[item.source] || "#0D0D0D",
                    border: `1px solid ${SOURCE_COLOR[item.source] || "#0D0D0D"}`,
                    borderRadius: 2, padding: "2px 6px", opacity: 0.75,
                  }}>
                    {SOURCE_LABEL[item.source] || item.source}
                  </span>
                </div>

                {/* Action */}
                <div style={{ fontFamily: SANS, fontSize: 11, color: "#0D0D0D", opacity: 0.5 }}>
                  {item.action}
                </div>

                {/* Summary */}
                <div style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D",
                  opacity: 0.75, lineHeight: 1.4 }}>
                  <span style={{ opacity: 0.45, marginRight: 8 }}>{item.target}</span>
                  {item.summary}
                </div>

                {/* Link */}
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: SANS, fontSize: 10, color: "#0D0D0D", opacity: 0.3,
                      textDecoration: "none", display: "flex", alignItems: "center",
                      gap: 2, justifyContent: "flex-end" }}>
                    view <ArrowUpRight size={9} />
                  </a>
                ) : <div />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 80 }}>
          <HR />
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", paddingTop: 20 }}>
            <span style={{ fontFamily: FRANK, fontSize: 13, color: "#0D0D0D", opacity: 0.32 }}>
              (github@s-yamanaka-droid + claude_code)
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
