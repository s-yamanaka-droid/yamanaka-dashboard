"use client";

import { useEffect, useState } from "react";
import { SANS } from "@/lib/design-tokens";

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function LiveBadge({ skills = 27 }: { skills?: number }) {
  const [last, setLast] = useState<string>("4m ago");

  useEffect(() => {
    let cancel = false;
    const fetchLatest = async () => {
      try {
        const r = await fetch(
          "https://api.github.com/users/s-yamanaka-droid/events/public?per_page=10",
          { cache: "no-store" }
        );
        if (!r.ok) return;
        const arr = await r.json();
        const push = Array.isArray(arr)
          ? arr.find((e: { type?: string; created_at?: string }) => e.type === "PushEvent" && e.created_at) ?? arr[0]
          : null;
        if (!cancel && push?.created_at) setLast(relTime(push.created_at));
      } catch {
        /* keep fallback */
      }
    };
    fetchLatest();
    const id = setInterval(fetchLatest, 30000);
    return () => { cancel = true; clearInterval(id); };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 78,
        right: 56,
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: SANS,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#0D0D0D",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(13,13,13,0.18)",
        borderRadius: 999,
        padding: "6px 12px",
      }}
    >
      <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#3A8C5C",
            animation: "lakkan-pulse 1.6s ease-in-out infinite",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#3A8C5C",
            opacity: 0.55,
          }}
        />
      </span>
      <span>LIVE</span>
      <span style={{ opacity: 0.4 }}>—</span>
      <span style={{ letterSpacing: "0.08em" }}>{skills} skills</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ letterSpacing: "0.08em", textTransform: "none" }}>{last}</span>
      <style>{`@keyframes lakkan-pulse { 0%,100% { transform:scale(1); opacity:1 } 50% { transform:scale(1.6); opacity:0.2 } }`}</style>
    </div>
  );
}
