"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
// three.js を遅延ロード（初期バンドルから除外・SSR時は描画しない）
const NeuralNet = dynamic(() => import("@/components/NeuralNet"), { ssr: false, loading: () => null });

const TICKER = [
  "claude-code · indexing",
  "gemma-3-12b · summarizing",
  "gemini-flash · classifying",
  "vault · 451 docs",
  "patterns · learning",
  "agents · 12 jobs running",
];

export function NeuralSection() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % TICKER.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "80vh",
      background: "#F5F5F0",
      borderTop: "1px solid rgba(13,13,13,0.08)",
      borderBottom: "1px solid rgba(13,13,13,0.08)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      {/* 3D Neural Network */}
      <NeuralNet
        density={120}
        linkDist={3.8}
        bg={0xF5F5F0}
        nodeColor={0x0D0D0D}
        linkColor={0x0D0D0D}
        pulseColor={0xFF4F00}
        height="100%"
      />

      <div style={{
        position: "relative", zIndex: 2,
        padding: "80px 48px",
        maxWidth: 1200, margin: "0 auto",
        width: "100%",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: "0.22em", color: "#8A857A",
            textTransform: "uppercase", marginBottom: 24,
          }}>
            <span style={{ width: 32, height: 1, background: "#FF4F00" }} />
            <span>// neural ops · live</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(48px, 7vw, 96px)",
            fontWeight: 900, lineHeight: 0.96,
            letterSpacing: "-0.025em", marginBottom: 32,
            color: "#0D0D0D",
            maxWidth: 900,
          }}>
            脳と AI を、<br/>
            <em style={{ fontStyle: "italic", color: "#FF4F00" }}>同じ層</em>に配線する。
          </h2>

          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 16, lineHeight: 2,
            color: "#333", maxWidth: 640, marginBottom: 32,
          }}>
            6 社マルチハットの意思決定を、Claude Code・Gemma・Gemini が並列で支える。
            商談ナレッジは vault に流れ込み、パターンは毎晩抽出され、翌朝には<br/>
            次の判断材料として返ってくる。
          </p>

          {/* ライブティッカー */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "14px 24px",
            background: "#0D0D0D", color: "#fff",
            fontFamily: "'DM Mono', monospace", fontSize: 12,
            letterSpacing: "0.12em",
            border: "1px solid rgba(13,13,13,0.2)",
          }}>
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: "#5CFF8C", animation: "pulse 1.6s infinite",
            }} />
            <span style={{ color: "rgba(255,255,255,0.5)" }}>›</span>
            <motion.span
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              style={{ minWidth: 240 }}
            >
              {TICKER[idx]}
            </motion.span>
          </div>

          {/* 統計 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 0, marginTop: 40,
            border: "1px solid rgba(13,13,13,0.12)",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
          }}>
            {[
              { k: "AI MODELS", v: "3" },
              { k: "DAILY JOBS", v: "12" },
              { k: "KNOWLEDGE", v: "100" },
              { k: "PATTERNS", v: "39" },
              { k: "SKILLS", v: "32" },
              { k: "PRODUCTS", v: "55" },
            ].map(s => (
              <div key={s.k} style={{
                padding: "20px 22px",
                borderRight: "1px solid rgba(13,13,13,0.08)",
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  letterSpacing: "0.2em", color: "#8A857A", marginBottom: 8,
                  textTransform: "uppercase",
                }}>{s.k}</div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 36, fontWeight: 900, lineHeight: 1, color: "#0D0D0D",
                }}>{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </section>
  );
}
