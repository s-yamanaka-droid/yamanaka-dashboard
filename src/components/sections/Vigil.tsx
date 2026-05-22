"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

type SkillCard = {
  code: string;
  name: string;
  jp: string;
  desc: string;
  category: "ops" | "growth" | "build" | "intel";
};

const CAT_META: Record<
  SkillCard["category"],
  { label: string; color: string }
> = {
  ops: { label: "Operations", color: "#3A8C5C" },
  growth: { label: "Growth", color: ACCENT.vermillion },
  build: { label: "Build", color: ACCENT.blue },
  intel: { label: "Intelligence", color: "#7C3AED" },
};

const SKILLS: SkillCard[] = [
  { code: "S.01", name: "Inbox Triage", jp: "受信箱トリアージ", desc: "Gmail / Slack / Notion を横断、未対応をすべて拾う。", category: "ops" },
  { code: "S.02", name: "Daily Brief", jp: "デイリーブリーフ", desc: "予定・重要案件・注意点を朝昼夕の3回ディスパッチ。", category: "ops" },
  { code: "S.03", name: "Calendar Sentinel", jp: "カレンダー番", desc: "プレフィックス整備とダブルブッキング検知。", category: "ops" },
  { code: "S.04", name: "Weekly KPI", jp: "週次KPI", desc: "毎週月曜にパイプライン・売上を社長視点で要約。", category: "intel" },
  { code: "S.05", name: "Competitor Intel", jp: "競合インテル", desc: "20社の動向を監視、変化点だけ通知。", category: "intel" },
  { code: "S.06", name: "Meeting → Proposal", jp: "商談→提案書", desc: "議事録から提案書まで一気通貫で生成。", category: "growth" },
  { code: "S.07", name: "Gmail Draft", jp: "メール起案", desc: "商談直後のフォローメールを下書きまで自動化。", category: "growth" },
  { code: "S.08", name: "Corporate Site Builder", jp: "企業サイト構築", desc: "クライアント情報→Vercelデプロイまでワンショット。", category: "build" },
  { code: "S.09", name: "Site Audit", jp: "サイト診断", desc: "8観点でWebアプリを採点、改善案を提示。", category: "build" },
  { code: "S.10", name: "Verify Deploy", jp: "デプロイ検証", desc: "本番デプロイ後30秒で異常検知。", category: "build" },
  { code: "S.11", name: "Notion Pipeline", jp: "案件パイプライン", desc: "案件DBの自動更新とステージ移行。", category: "ops" },
  { code: "S.12", name: "Monthly AI Report", jp: "月次AIレポート", desc: "AIで何をやったかを月末に自動集計。", category: "intel" },
];

const INK = "#0D0D0D";
const RULE = "rgba(13,13,13,0.12)";
const MUTED = "rgba(13,13,13,0.55)";

export function Vigil() {
  const [filter, setFilter] = useState<SkillCard["category"] | "all">("all");
  const filtered =
    filter === "all" ? SKILLS : SKILLS.filter((s) => s.category === filter);

  return (
    <SectionShell
      id="vigil"
      tone="creamLight"
      eyebrow="Vigil AI"
      eyebrowVersion="0.2"
      accent="forest"
    >
        {/* Headline + lede */}
        <div
          data-mobile-stack="vigil-head"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "6vw",
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <motion.h2
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
            <Em accent="forest">Vigil.</Em>
            <br />
            眠らない右腕。
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            style={{
              fontFamily: SANS,
              fontSize: 14,
              color: MUTED,
              lineHeight: 1.85,
              margin: 0,
              maxWidth: 380,
            }}
          >
            Slack に「Claude Code で〜やって」と書くだけ。
            12 の Skill が自律稼働して、商談議事録から提案書・採用 LP・競合レポートまで自動完結する。毎晩 23:30 に学習し、使うほど賢くなる。
          </motion.p>
        </div>

        {/* Stat strip */}
        <div
          data-mobile-stack="vigil-stat"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 0,
            borderTop: `1px solid ${RULE}`,
            borderBottom: `1px solid ${RULE}`,
            marginBottom: 48,
          }}
        >
          {[
            { v: "12", l: "Skills Live" },
            { v: "95", l: "Knowledge Files" },
            { v: "8", l: "CXO Agents" },
            { v: "23:30", l: "Nightly Learn" },
          ].map((s, i, arr) => (
            <div
              key={s.l}
              style={{
                padding: "24px 20px",
                borderRight:
                  i < arr.length - 1 ? `1px solid ${RULE}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: INSTRUMENT,
                  fontSize: "clamp(32px,4vw,52px)",
                  fontWeight: 400,
                  color: INK,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: "rgba(13,13,13,0.4)",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div
          style={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {(["all", "ops", "growth", "build", "intel"] as const).map((c) => {
            const isActive = filter === c;
            const label =
              c === "all" ? `All (${SKILLS.length})` : CAT_META[c].label;
            const color = c === "all" ? INK : CAT_META[c].color;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.08em",
                  color: isActive ? "#FFFFFF" : color,
                  background: isActive ? color : "transparent",
                  border: `1px solid ${isActive ? color : RULE}`,
                  borderRadius: 100,
                  padding: "6px 14px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.18s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Skill cards grid — white card on cream bg */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
            marginBottom: 56,
          }}
        >
          {filtered.map((s, i) => {
            const cat = CAT_META[s.category];
            return (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.3),
                  duration: 0.45,
                  ease: EASE,
                }}
                whileHover={{ y: -3 }}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${RULE}`,
                  borderRadius: 12,
                  padding: "22px 20px",
                  cursor: "default",
                  transition: "border-color 0.2s, background 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: INSTRUMENT,
                      fontStyle: "italic",
                      fontSize: 13,
                      color: cat.color,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {s.code}
                  </span>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 8,
                      letterSpacing: "0.16em",
                      color: cat.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: FRANK,
                    fontSize: 18,
                    fontWeight: 500,
                    color: INK,
                    lineHeight: 1.2,
                    margin: "0 0 4px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.name}
                </h3>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    color: "rgba(13,13,13,0.4)",
                    marginBottom: 12,
                  }}
                >
                  {s.jp}
                </div>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: 11.5,
                    color: MUTED,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            paddingTop: 32,
            borderTop: `1px solid ${RULE}`,
          }}
        >
          {[
            { href: "/vigil", label: "Engine Room", primary: true },
            { href: "/skills", label: "All Skills" },
            { href: "/evolution", label: "Evolution Log" },
            { href: "/vigil/brief/01", label: "Brief №01" },
          ].map((cta) => (
            <motion.a
              key={cta.href}
              href={cta.href}
              whileHover={{ x: 4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: cta.primary ? 700 : 500,
                color: cta.primary ? ACCENT.vermillion : INK,
                textDecoration: "none",
                border: `1px solid ${cta.primary ? "rgba(184,54,46,0.45)" : RULE}`,
                borderRadius: 8,
                padding: "12px 22px",
                letterSpacing: "0.04em",
                background: "transparent",
              }}
            >
              {cta.label} <ArrowUpRight size={14} />
            </motion.a>
          ))}
        </div>
    </SectionShell>
  );
}
