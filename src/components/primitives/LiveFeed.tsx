"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FRANK, SANS } from "@/lib/design-tokens";
import changelogData from "@/data/changelog.json";

type FeedItem = {
  id: string;
  time: string; // HH:MM or date
  text: string;
  href?: string;
  tone?: "ship" | "news" | "skill" | "live" | "edit";
};

const TAG_TONE: Record<string, FeedItem["tone"]> = {
  BRAND: "edit", UI: "ship", PRODUCT: "live",
  OPS: "skill", ARCH: "news", REPORT: "news",
  COMPANY: "ship", COMING: "live",
};

// 最新5件を changelog から
const SEED: FeedItem[] = (changelogData as { entries: { date: string; tag: string; title: string; links?: {url: string}[] }[] })
  .entries
  .filter(e => e.tag !== "COMING")  // 未来予定は除く
  .slice(0, 5)
  .map((e, i) => ({
    id: `cl-${i}`,
    time: e.date.slice(5).replace("-", "/"),  // MM/DD
    text: e.title.length > 60 ? e.title.slice(0, 60) + "…" : e.title,
    href: e.links?.[0]?.url || "/changelog",
    tone: TAG_TONE[e.tag] || "edit",
  }));

const ROTATION: Omit<FeedItem, "id" | "time">[] = [
  { text: "Vigil — nightly review completed", href: "https://shoot-agent-v45.vercel.app", tone: "skill" },
  { text: "Compete — 20 companies synced", href: "https://competitor-research-gamma.vercel.app", tone: "news" },
  { text: "Playbook — entry added", href: "https://vigil-vert-gamma.vercel.app", tone: "live" },
  { text: "Just shipped — Hero Flex Mode", href: "#works", tone: "ship" },
  { text: "AI News — top story refreshed", href: "/ai-news", tone: "news" },
  { text: "Vigil — skill /artifacts updated", href: "https://shoot-agent-v45.vercel.app", tone: "skill" },
  { text: "KANOA Jobs — listing index rebuilt", href: "https://kanoa-jobs.vercel.app", tone: "edit" },
];

const TONE_COLOR: Record<NonNullable<FeedItem["tone"]>, string> = {
  ship: "#B8362E",
  news: "#1C3BCC",
  skill: "#7C3AED",
  live: "#3A8C5C",
  edit: "#0D0D0D",
};

function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(SEED);

  // Try to enrich with GitHub events on mount
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(
          "https://api.github.com/users/s-yamanaka-droid/events/public?per_page=6",
          { cache: "no-store" }
        );
        if (!r.ok) return;
        type Ev = {
          id?: string;
          type?: string;
          created_at?: string;
          repo?: { name?: string };
          payload?: { commits?: { message?: string }[]; ref?: string };
        };
        const arr: Ev[] = await r.json();
        const mapped: FeedItem[] = arr
          .filter((e) => e.type === "PushEvent" && e.repo?.name)
          .slice(0, 3)
          .map((e) => {
            const t = new Date(e.created_at ?? Date.now());
            const repo = (e.repo?.name ?? "").split("/").pop() ?? "repo";
            const msg = e.payload?.commits?.[0]?.message?.split("\n")[0] ?? "push";
            return {
              id: `gh-${e.id ?? Math.random()}`,
              time: `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`,
              text: `${repo} — ${msg.slice(0, 48)}`,
              href: `https://github.com/${e.repo?.name}`,
              tone: "edit",
            };
          });
        if (!cancel && mapped.length) {
          setItems((prev) => [...mapped, ...prev].slice(0, 8));
        }
      } catch { /* noop */ }
    })();
    return () => { cancel = true; };
  }, []);

  // Rotate-in new entries every 5s
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const next = ROTATION[i % ROTATION.length];
      i++;
      setItems((prev) => {
        const item: FeedItem = {
          id: `r-${Date.now()}-${i}`,
          time: nowHM(),
          ...next,
        };
        return [item, ...prev].slice(0, 8);
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const ink = "#0D0D0D";

  return (
    <div style={{ display: "flex", flexDirection: "column", justifySelf: "end", width: "100%", maxWidth: 380 }}>
      <div style={{
        fontFamily: SANS, fontSize: 10, fontWeight: 700,
        letterSpacing: "0.22em", color: ink, opacity: 0.5,
        marginBottom: 14, textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ position: "relative", display: "inline-flex", width: 6, height: 6 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3A8C5C", animation: "lakkan-pulse 1.6s ease-in-out infinite" }} />
        </span>
        Live Feed · realtime
      </div>

      <div style={{ position: "relative" }}>
        <AnimatePresence initial={false}>
          {items.map((it, i) => {
            const tc = TONE_COLOR[it.tone ?? "edit"];
            const fading = i >= 6;
            return (
              <motion.a
                key={it.id}
                href={it.href ?? "#works"}
                target={it.href?.startsWith("http") ? "_blank" : undefined}
                rel={it.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                layout
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: fading ? 0.35 : 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 8, height: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto 1fr",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderTop: i === 0 ? "none" : "1px solid rgba(13,13,13,0.1)",
                  textDecoration: "none",
                  color: ink,
                  cursor: "pointer",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: tc, flexShrink: 0 }} />
                <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: ink, opacity: 0.55, letterSpacing: "0.06em" }}>
                  {it.time}
                </span>
                <span style={{ fontFamily: FRANK, fontSize: 13, fontWeight: 400, color: ink, lineHeight: 1.35, letterSpacing: "0.01em" }}>
                  {it.text}
                </span>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </div>

      <div style={{
        borderTop: "1px solid rgba(13,13,13,0.18)", paddingTop: 10, marginTop: 6,
        fontFamily: SANS, fontSize: 9, color: ink, opacity: 0.4, letterSpacing: "0.18em", textTransform: "uppercase",
      }}>
        ↓ scroll to works
      </div>
    </div>
  );
}
