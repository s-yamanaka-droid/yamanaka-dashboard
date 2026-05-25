"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import productsData from "@/data/products.full.json";

type Product = {
  id: string;
  company: string;
  flag: string;
  url: string;
  desc: string;
};

const COMPANIES = ["All", "Lakkan", "LunaTech", "SKYLINK", "KANOA", "トレプロ", "Solve", "_shared"];
const FLAGS = ["All", "PUBLIC", "PRE-LAUNCH", "WORKTREE", "INTERNAL", "ARCHIVED"];

const FLAG_COLOR: Record<string, string> = {
  "PUBLIC":     "#137333",
  "PRE-LAUNCH": "#C9A84C",
  "WORKTREE":   "#3F73C3",
  "INTERNAL":   "#6B6860",
  "ARCHIVED":   "#A0A0A0",
};

const CO_COLOR: Record<string, string> = {
  "Lakkan":   "#1A6E3A",
  "LunaTech": "#003E8A",
  "SKYLINK":  "#4B1A8A",
  "KANOA":    "#8A3E00",
  "トレプロ": "#8A0000",
  "Solve":    "#4A4A4A",
  "_shared":  "#666666",
};

export default function ProductsPage() {
  const products = (productsData as { products: Product[] }).products;
  const [coFilter, setCoFilter] = useState("All");
  const [flagFilter, setFlagFilter] = useState("All");
  const [q, setQ] = useState("");
  const [clock, setClock] = useState("");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const z = (n: number) => String(n).padStart(2, "0");
      setClock(`${d.getFullYear()}.${z(d.getMonth()+1)}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    const pulseId = setInterval(() => setPulse(p => p + 1), 3500);
    return () => { clearInterval(id); clearInterval(pulseId); };
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p =>
      (coFilter === "All" || p.company === coFilter) &&
      (flagFilter === "All" || p.flag === flagFilter) &&
      (q === "" || p.id.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase()))
    );
  }, [products, coFilter, flagFilter, q]);

  const launchDate = new Date("2026-06-16T00:00:00+09:00");
  const today = new Date();
  const daysToLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 統計
  const stats = useMemo(() => {
    const byFlag: Record<string, number> = {};
    products.forEach(p => { byFlag[p.flag] = (byFlag[p.flag] || 0) + 1; });
    return byFlag;
  }, [products]);

  const ink = "#0D0D0D";
  const accent = "#FF4F00";
  const lime = "#137333";

  return (
    <main style={{
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
        borderBottom: "1px solid rgba(13,13,13,0.08)",
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
            VIGIL<span style={{ color: accent }}>.</span>
            <span style={{
              marginLeft: 10, fontSize: 9, color: "#8A857A",
              border: "1px solid #C0C0C0", padding: "2px 6px",
              letterSpacing: "0.05em",
            }}>products-cortex</span>
          </Link>
          <div style={{ display: "flex", gap: 0 }}>
            <Link href="/" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: "#8A857A",
              textDecoration: "none", padding: "8px 16px",
              textTransform: "uppercase",
            }}>Corporate</Link>
            <Link href="/products" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: ink,
              textDecoration: "none", padding: "8px 16px",
              borderBottom: `2px solid ${accent}`,
              textTransform: "uppercase",
            }}>🔒 Products</Link>
            <Link href="https://vigil-vert-gamma.vercel.app" target="_blank" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.15em", color: "#8A857A",
              textDecoration: "none", padding: "8px 16px",
              textTransform: "uppercase",
            }}>Vigil ↗</Link>
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
            }} /> AI ONLINE
          </span>
          <span>{clock}</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "80px 40px 40px",
        maxWidth: 1400, margin: "0 auto",
        borderBottom: "1px solid rgba(13,13,13,0.08)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          letterSpacing: "0.22em", color: "#8A857A",
          textTransform: "uppercase", marginBottom: 22,
        }}>
          <span style={{ width: 32, height: 1, background: accent }} />
          <span>// products.cortex · agent-indexed</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(56px, 8vw, 120px)",
          fontWeight: 900, lineHeight: 0.92,
          letterSpacing: "-0.03em", marginBottom: 18,
        }}>
          <em style={{ fontStyle: "italic", color: accent }}>{products.length}</em>{" "}
          products<br/>
          <span style={{ color: "#5A554D", fontSize: "0.5em", fontWeight: 300, letterSpacing: "-0.01em" }}>
            indexed across 6 companies.
          </span>
        </h1>
        <p style={{
          fontSize: 14, color: "#5A554D", lineHeight: 1.85,
          maxWidth: 640, marginBottom: 24,
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          山中のすべてのプロダクトが、AI による横断インデックスで瞬時に呼び出せる。
          会社・状態・キーワードで切り替えて、頭の中をそのままブラウザに展開する。
        </p>

        {/* ライブステータスバー */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 1, background: "rgba(13,13,13,0.08)",
          border: "1px solid rgba(13,13,13,0.08)",
          marginTop: 32,
        }}>
          {[
            { k: "TOTAL", v: products.length, c: ink },
            { k: "PUBLIC", v: stats["PUBLIC"] || 0, c: lime },
            { k: "PRE-LAUNCH", v: stats["PRE-LAUNCH"] || 0, c: "#C9A84C" },
            { k: "INTERNAL", v: stats["INTERNAL"] || 0, c: "#6B6860" },
            { k: "WORKTREE", v: stats["WORKTREE"] || 0, c: "#3F73C3" },
            { k: "T-LAUNCH", v: `${daysToLaunch}d`, c: accent, sub: "LunaTech 6.16" },
          ].map(s => (
            <div key={s.k} style={{
              background: "#fff", padding: "16px 18px",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                letterSpacing: "0.18em", color: "#8A857A", marginBottom: 6,
              }}>{s.k}</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32, fontWeight: 900, color: s.c, lineHeight: 1,
              }}>{s.v}</div>
              {s.sub && (
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  color: "#8A857A", marginTop: 4, letterSpacing: "0.06em",
                }}>{s.sub}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "32px 40px 16px",
        maxWidth: 1400, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: "0.2em", color: "#8A857A",
          marginBottom: 12,
        }}>
          // context-switch · company
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20 }}>
          {COMPANIES.map(co => (
            <button key={co} onClick={() => setCoFilter(co)} style={{
              padding: "7px 14px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11, letterSpacing: "0.1em",
              background: coFilter === co ? ink : "transparent",
              color: coFilter === co ? "#fff" : ink,
              border: "1px solid rgba(13,13,13,0.15)",
              borderRadius: 0, cursor: "pointer",
              transition: "all 0.15s",
            }}>{co}</button>
          ))}
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: "0.2em", color: "#8A857A",
          marginBottom: 12,
        }}>
          // status · embedding
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {FLAGS.map(f => (
              <button key={f} onClick={() => setFlagFilter(f)} style={{
                padding: "5px 11px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: "0.08em",
                background: flagFilter === f ? (FLAG_COLOR[f] || ink) : "transparent",
                color: flagFilter === f ? "#fff" : "#5A554D",
                border: `1px solid ${flagFilter === f ? (FLAG_COLOR[f] || ink) : "rgba(13,13,13,0.15)"}`,
                borderRadius: 99, cursor: "pointer",
              }}>{f}</button>
            ))}
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontFamily: "'DM Mono', monospace", fontSize: 13, color: accent,
            }}>⌕</span>
            <input
              type="search"
              placeholder="ask agent — search vector..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px 9px 34px",
                fontFamily: "'DM Mono', monospace", fontSize: 12,
                letterSpacing: "0.04em",
                border: "1px solid rgba(13,13,13,0.15)",
                borderRadius: 0, background: "#fff", outline: "none",
              }}
            />
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#8A857A", letterSpacing: "0.1em",
            whiteSpace: "nowrap",
          }}>
            <span style={{ color: ink, fontWeight: 700 }}>{filtered.length}</span> / {products.length} indexed
            <span key={pulse} style={{
              marginLeft: 10, color: lime, opacity: 0,
              animation: "blink-once 1s",
            }}>● synced</span>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{
        position: "relative", zIndex: 1,
        padding: "16px 40px 80px",
        maxWidth: 1400, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: "0.2em", color: "#8A857A",
          marginBottom: 18,
        }}>
          // agent.index → {filtered.length} results
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 1, background: "rgba(13,13,13,0.06)",
          border: "1px solid rgba(13,13,13,0.06)",
        }}>
          {filtered.map((p, i) => {
            const hasUrl = !!p.url;
            const Tag = hasUrl ? "a" : "div";
            const props = hasUrl ? { href: p.url, target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Tag
                key={p.id}
                {...props}
                style={{
                  background: "#fff",
                  padding: "20px 22px",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: hasUrl ? "pointer" : "default",
                  transition: "all 0.18s ease",
                  display: "block",
                  position: "relative",
                  borderLeft: `3px solid ${CO_COLOR[p.company] || ink}`,
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  if (hasUrl) {
                    e.currentTarget.style.background = "#FAFAF8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, letterSpacing: "0.18em",
                    color: CO_COLOR[p.company] || "#6B6860", fontWeight: 700,
                    textTransform: "uppercase",
                  }}>{p.company}</span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, letterSpacing: "0.08em",
                    color: FLAG_COLOR[p.flag] || "#6B6860",
                    border: `1px solid ${FLAG_COLOR[p.flag] || "#6B6860"}`,
                    padding: "2px 8px", borderRadius: 99,
                  }}>{p.flag}</span>
                </div>
                <div style={{
                  fontFamily: "'DM Mono', 'SF Mono', monospace",
                  fontSize: 15, fontWeight: 700, marginBottom: 8,
                  wordBreak: "break-all", color: ink,
                }}>{p.id}</div>
                {p.desc && (
                  <div style={{
                    fontSize: 12, color: "#5A554D", lineHeight: 1.6, marginBottom: 8,
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}>
                    {p.desc}
                  </div>
                )}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 10, fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: "0.06em",
                }}>
                  <span style={{ color: "#A0A0A0" }}>
                    idx:{String(i).padStart(3, "0")}
                  </span>
                  {hasUrl ? (
                    <span style={{ color: accent }}>
                      {p.url.replace(/^https?:\/\//, "").slice(0, 30)} ↗
                    </span>
                  ) : (
                    <span style={{ color: "#A0A0A0" }}>// no public url</span>
                  )}
                </div>
              </Tag>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{
            padding: "60px 40px", textAlign: "center",
            fontFamily: "'DM Mono', monospace", fontSize: 13,
            color: "#8A857A", letterSpacing: "0.1em",
            background: "#fff", border: "1px solid rgba(13,13,13,0.08)",
          }}>
            // 0 results — try adjusting filters
          </div>
        )}
      </section>

      <footer style={{
        position: "relative", zIndex: 1,
        padding: "32px 40px", textAlign: "center",
        borderTop: "1px solid rgba(13,13,13,0.08)",
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        letterSpacing: "0.18em", color: "#8A857A",
      }}>
        powered by: claude-code · gemma-3-12b · gemini-flash · vault-451docs
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes blink-once {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
