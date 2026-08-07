"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Brain, ShieldCheck, Sparkles } from "lucide-react";
import { INSTRUMENT, SANS, EASE } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

const INK = "#132126";
const RULE = "rgba(19,33,38,0.12)";
const MUTED = "rgba(19,33,38,0.58)";
const LUNA_URL = "https://lunatech-migration-guide.vercel.app";

const PILLARS = [
  {
    code: "01",
    title: "Remember",
    jp: "あなたの判断を覚える",
    desc: "会話を消費して終わらせず、判断基準・言葉・修正を次の仕事で使える記憶として残します。",
    icon: Brain,
  },
  {
    code: "02",
    title: "Adapt",
    jp: "使うほど、あなた仕様に育つ",
    desc: "繰り返す仕事を再現可能なスキルへ変え、成功と失敗の証拠をもとに仕事の進め方を更新します。",
    icon: Sparkles,
  },
  {
    code: "03",
    title: "Protect",
    jp: "記憶と主導権を手元に残す",
    desc: "記憶は利用者のPCに読み返せる形で保存。送信・削除・公開などの重要操作は、人の確認を境界にします。",
    icon: ShieldCheck,
  },
];

export function Luna() {
  return (
    <SectionShell
      id="luna"
      tone="creamLight"
      eyebrow="Luna AI · by LunaTech"
      eyebrowVersion="Public"
      accent="forest"
    >
      <div
        data-mobile-stack="luna-head"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap: "6vw",
          alignItems: "end",
          marginBottom: 56,
        }}
      >
        <motion.h2
          className="editorial-heading editorial-heading--display"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(56px, 9vw, 144px)",
            fontWeight: 400,
            lineHeight: 0.92,
            color: INK,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          <Em accent="forest">Luna.</Em>
          <br />
          <span className="heading-phrase">育つAIの右腕。</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        >
          <p
            style={{
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: 23,
              color: INK,
              lineHeight: 1.5,
              margin: "0 0 16px",
            }}
          >
            月あかりの、知性。
          </p>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14,
              color: MUTED,
              lineHeight: 1.85,
              margin: 0,
              maxWidth: 420,
            }}
          >
            組み方を売るのではなく、育つ状態で渡す。
            Lunaは、あなたの判断・言葉・失敗を仕事の資産として蓄積し、使うほどあなた専用になっていくAIです。
          </p>
        </motion.div>
      </div>

      <div
        data-mobile-stack="luna-stat"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          borderTop: `1px solid ${RULE}`,
          borderBottom: `1px solid ${RULE}`,
          marginBottom: 48,
        }}
      >
        {["Local-first memory", "Evidence-based growth", "Human-approved actions"].map((label, i) => (
          <div
            key={label}
            style={{
              padding: "20px 22px",
              borderRight: i < 2 ? `1px solid ${RULE}` : "none",
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: INK,
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 48,
        }}
      >
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.article
              key={pillar.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${RULE}`,
                borderRadius: 12,
                padding: "28px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 14, color: MUTED }}>
                  {pillar.code}
                </span>
                <Icon size={20} strokeWidth={1.5} color="#315A4E" aria-hidden="true" />
              </div>
              <h3 style={{ fontFamily: INSTRUMENT, fontSize: 34, fontWeight: 400, margin: "0 0 4px", color: INK }}>
                {pillar.title}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: "#315A4E", margin: "0 0 16px" }}>
                {pillar.jp}
              </p>
              <p style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.8, color: MUTED, margin: 0 }}>
                {pillar.desc}
              </p>
            </motion.article>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a
          href={LUNA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 18px",
            borderRadius: 999,
            background: "#315A4E",
            color: "#FFFFFF",
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          Luna AIを見る <ArrowUpRight size={14} />
        </a>
        <a
          href="/contact?topic=luna"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 18px",
            borderRadius: 999,
            border: `1px solid ${INK}`,
            color: INK,
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          導入を相談する
        </a>
      </div>
    </SectionShell>
  );
}
