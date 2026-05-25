"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NeuralNet from "@/components/NeuralNet";

const LIVE_LINES = [
  "[agent] indexing products...",
  "[vault] 451 docs synced",
  "[brain] 6 cortical regions online",
  "[skills] 32 invocable",
];

export function ProductsBanner() {
  const launchDate = new Date("2026-06-16T00:00:00+09:00");
  const today = new Date();
  const daysToLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const [clock, setClock] = useState("");
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const z = (n: number) => String(n).padStart(2, "0");
      setClock(`${d.getFullYear()}.${z(d.getMonth()+1)}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    const logId = setInterval(() => setLogIdx(i => (i + 1) % LIVE_LINES.length), 2200);
    return () => { clearInterval(id); clearInterval(logId); };
  }, []);

  const ink = "#0D0D0D";
  const accent = "#FF4F00";
  const lime = "#5CFF8C";

  return (
    <section style={{
      background: ink,
      color: "#fff",
      padding: "80px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 3D Neural Network 背景 */}
      <NeuralNet
        density={90}
        linkDist={4.5}
        bg={0x0D0D0D}
        nodeColor={0xFFFFFF}
        linkColor={0xFFFFFF}
        pulseColor={0xFF4F00}
        height="100%"
      />
      {/* グリッド（重ね）*/}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),"
        + "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />
      {/* 大watermark */}
      <div aria-hidden style={{
        position: "absolute", right: -40, bottom: -80,
        fontFamily: "'Playfair Display', serif", fontStyle: "italic",
        fontSize: 280, fontWeight: 900, color: "rgba(255,79,0,0.06)",
        letterSpacing: "-0.05em", lineHeight: 1, pointerEvents: "none",
      }}>cortex</div>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1200, margin: "0 auto",
      }}>
        {/* topバー */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 36,
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: lime, padding: "4px 10px",
              border: "1px solid rgba(92,255,140,0.4)",
              fontSize: 10, letterSpacing: "0.2em",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: lime, animation: "pulse 1.8s infinite",
              }} /> AGENT ONLINE
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>{clock}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>// products.cortex</div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 48, alignItems: "center",
        }} className="banner-grid">
          {/* 左：文言 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.22em", color: accent,
              marginBottom: 16, textTransform: "uppercase", fontWeight: 700,
            }}>
              ━━ Restricted · Neural Vault
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 5.5vw, 68px)",
              fontWeight: 900, lineHeight: 0.98,
              letterSpacing: "-0.025em", marginBottom: 20,
            }}>
              山中の頭の中、<br/>
              <em style={{ fontStyle: "italic", color: accent }}>そのまま</em>展開する。
            </h2>
            <p style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              color: "rgba(255,255,255,0.7)",
              fontSize: 14, lineHeight: 1.85,
              maxWidth: 500, marginBottom: 28,
            }}>
              6社マルチハットの全 <b style={{ color: "#fff" }}>55プロダクト</b>を
              AIで横断インデックス。会社・状態・キーワードで瞬時に呼び出し、
              そのままURLへ。<br/>
              {daysToLaunch > 0 && (
                <span style={{ color: accent }}>
                  LunaTech ローンチまで <b>{daysToLaunch}日</b>。
                </span>
              )}
            </p>

            {/* ライブログ */}
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11,
              letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)",
              marginBottom: 32, minHeight: 24,
            }}>
              <motion.span
                key={logIdx}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span style={{ color: lime }}>›</span> {LIVE_LINES[logIdx]}
              </motion.span>
            </div>

            <Link href="/products" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 32px",
              background: accent,
              color: "#fff",
              textDecoration: "none",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              fontWeight: 700,
              textTransform: "uppercase",
              border: "1px solid " + accent,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = accent;
              e.currentTarget.style.color = "#fff";
            }}
            >
              <span>▶ Enter the Vault</span>
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
            <div style={{
              marginTop: 14,
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em",
            }}>
              passphrase required · 山中専用
            </div>
          </motion.div>

          {/* 右：ステータスパネル */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "28px 26px",
              background: "rgba(255,255,255,0.02)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
            }}
          >
            <div style={{
              fontSize: 10, letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.4)", marginBottom: 18,
              textTransform: "uppercase",
            }}>
              // index.summary
            </div>
            {[
              { k: "products", v: "55", c: accent },
              { k: "companies", v: "6", c: "#fff" },
              { k: "skills", v: "32", c: "#fff" },
              { k: "vault_docs", v: "451", c: "#fff" },
              { k: "patterns", v: "39", c: "#fff" },
              { k: "knowledge", v: "100", c: "#fff" },
            ].map(s => (
              <div key={s.k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                letterSpacing: "0.1em",
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{s.k}</span>
                <span style={{ color: s.c, fontWeight: 700 }}>{s.v}</span>
              </div>
            ))}
            <div style={{
              marginTop: 16, padding: "10px 12px",
              background: "rgba(255,79,0,0.1)",
              border: "1px solid rgba(255,79,0,0.3)",
              fontSize: 10, color: accent, letterSpacing: "0.1em",
            }}>
              ⚡ T-{daysToLaunch}d · LunaTech ローンチ
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @media (max-width: 880px) {
          .banner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
