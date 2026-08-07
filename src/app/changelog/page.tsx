"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import changelog from "@/data/changelog.json";

type Entry = {
  date: string;
  tag: string;
  title: string;
  body: string;
  links?: { label: string; url: string }[];
};

const TAG_COLOR: Record<string, string> = {
  BRAND:   "#B4382B",
  UI:      "#3F73C3",
  PRODUCT: "#137333",
  OPS:     "#C9A84C",
  ARCH:    "#5B5871",
  REPORT:  "#315A4E",
  COMPANY: "#8A3E00",
  COMING:  "#A0A0A0",
};

export default function ChangelogPage() {
  const entries = (changelog as { entries: Entry[] }).entries;
  const [tag, setTag] = useState("All");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const z = (n: number) => String(n).padStart(2, "0");
      setClock(`${d.getFullYear()}.${z(d.getMonth()+1)}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const allTags = ["All", ...Array.from(new Set(entries.map(e => e.tag)))];
  const filtered = tag === "All" ? entries : entries.filter(e => e.tag === tag);

  const ink = "#132126";
  const accent = "#B4382B";
  const lime = "#137333";

  // 月ごとにグルーピング
  const grouped: Record<string, Entry[]> = {};
  filtered.forEach(e => {
    const month = e.date.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(e);
  });

  return (
    <main id="main" style={{
      minHeight: "100vh",
      background: "#F5F5F0",
      color: ink,
      fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
      position: "relative",
    }}>
      {/* グリッド背景 */}
      <div aria-hidden style={{
        position: "fixed", inset: 0,
        backgroundImage:
          "linear-gradient(#0d0d0d08 1px, transparent 1px),"
        + "linear-gradient(90deg, #0d0d0d08 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.6, pointerEvents: "none", zIndex: 0,
      }} />

      {/* TOP NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(245,245,240,.94)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(19,33,38,0.08)",
        padding: "14px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/" style={{
            textDecoration: "none", color: ink,
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            letterSpacing: "0.1em", fontWeight: 700,
          }}>
            Lakkan<span style={{ color: accent, fontWeight: 900 }}>.</span>
            <span style={{
              marginLeft: 10, fontSize: 9, color: "#8A857A",
              border: "1px solid #C0C0C0", padding: "2px 6px",
              letterSpacing: "0.05em",
            }}>changelog</span>
          </Link>
          <div style={{ display: "flex", gap: 0 }}>
            <Link href="/" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: "#8A857A",
              textDecoration: "none", padding: "8px 16px",
              textTransform: "uppercase",
            }}>Home</Link>
            <Link href="/changelog" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: ink,
              textDecoration: "none", padding: "8px 16px",
              borderBottom: `2px solid ${accent}`,
              textTransform: "uppercase",
            }}>Changelog</Link>
            <Link href="https://lunatech-migration-guide.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: "#8A857A",
              textDecoration: "none", padding: "8px 16px",
              textTransform: "uppercase",
            }}>Luna AI ↗</Link>
          </div>
        </div>
        <div style={{
          display: "flex", gap: 16, alignItems: "center",
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: "0.12em", color: "#8A857A",
        }}>
          <span style={{
            color: lime, background: ink,
            padding: "3px 10px", letterSpacing: "0.18em", fontSize: 9,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "#5CFF8C", animation: "pulse 1.8s infinite",
            }} /> LIVE
          </span>
          <span>{clock}</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "80px 40px 40px",
        maxWidth: 1100, margin: "0 auto",
        borderBottom: "1px solid rgba(19,33,38,0.08)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          letterSpacing: "0.22em", color: "#8A857A",
          textTransform: "uppercase", marginBottom: 22,
        }}>
          <span style={{ width: 32, height: 1, background: accent }} />
          <span>{"// changelog · "}{entries.length} entries</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(56px, 8vw, 112px)",
          fontWeight: 900, lineHeight: 0.92,
          letterSpacing: "-0.03em", marginBottom: 18,
        }}>
          What&apos;s <em style={{ fontStyle: "italic", color: accent }}>new</em>.
        </h1>
        <p style={{
          fontSize: 15, color: "#45545A", lineHeight: 1.85,
          maxWidth: 640, marginBottom: 16,
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          Lakkanと公開プロダクトの直近のアップデート。
          ブランド · UI · プロダクト · 会社トピックを時系列で。
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 22 }}>
          {allTags.map(t => (
            <button key={t} onClick={() => setTag(t)} style={{
              padding: "6px 12px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, letterSpacing: "0.1em",
              background: tag === t ? (t === "All" ? ink : TAG_COLOR[t] || ink) : "transparent",
              color: tag === t ? "#fff" : ink,
              border: `1px solid ${tag === t ? (t === "All" ? ink : TAG_COLOR[t] || ink) : "rgba(19,33,38,0.15)"}`,
              borderRadius: 99, cursor: "pointer",
              textTransform: "uppercase",
            }}>{t}</button>
          ))}
        </div>
      </section>

      {/* ENTRIES — タイムライン */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "40px 40px 80px",
        maxWidth: 1100, margin: "0 auto",
      }}>
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} style={{ marginBottom: 64 }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              fontSize: 28, fontWeight: 400,
              color: "#8A857A", marginBottom: 24,
              borderBottom: "1px solid rgba(19,33,38,0.08)",
              paddingBottom: 12,
            }}>
              {month}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {items.map((e, i) => (
                <motion.div
                  key={`${e.date}-${i}`}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 32,
                    padding: "24px 0",
                    borderBottom: "1px solid rgba(19,33,38,0.06)",
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11, letterSpacing: "0.12em",
                      color: "#8A857A", marginBottom: 8,
                    }}>{e.date}</div>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9, letterSpacing: "0.18em", fontWeight: 700,
                      color: "#fff",
                      background: TAG_COLOR[e.tag] || ink,
                      padding: "3px 10px", borderRadius: 99,
                      textTransform: "uppercase",
                    }}>{e.tag}</span>
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "'Frank Ruhl Libre', 'Playfair Display', serif",
                      fontSize: 20, fontWeight: 500, lineHeight: 1.4,
                      letterSpacing: "-0.005em", marginBottom: 10, color: ink,
                    }}>
                      {e.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: 13.5, color: "#45545A", lineHeight: 1.85,
                      marginBottom: 12,
                    }}>
                      {e.body}
                    </p>
                    {e.links && e.links.length > 0 && (
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {e.links.map(l => (
                          <a key={l.url} href={l.url} target={l.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11, letterSpacing: "0.08em",
                            color: accent, textDecoration: "none",
                            borderBottom: `1px solid ${accent}`,
                            paddingBottom: 2,
                          }}>
                            {l.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer style={{
        position: "relative", zIndex: 1,
        padding: "32px 40px", textAlign: "center",
        borderTop: "1px solid rgba(19,33,38,0.08)",
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        letterSpacing: "0.18em", color: "#8A857A",
      }}>
        Lakkan changelog · auto-curated by Claude Code · last sync {clock.slice(0, 10)}
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </main>
  );
}
