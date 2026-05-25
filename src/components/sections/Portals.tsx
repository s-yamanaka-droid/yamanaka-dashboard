"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

type PortalItem = {
  label: string;
  jaLabel?: string;
  sub: string;
  desc: string;
  url: string;
  accent: string;
  status: "live" | "internal" | "beta" | "coming";
  meta?: string;
};

type PortalGroup = {
  group: string;
  num: string;
  items: PortalItem[];
};

const GROUPS: PortalGroup[] = [
  {
    group: "Group · Companies",
    num: "I",
    items: [
      {
        label: "Trepro",
        jaLabel: "株式会社トレプロ",
        sub: "Parent · TSE Growth",
        desc: "AI×採用支援を軸に展開する東証グロース上場グループ。Lakkanの母体。",
        url: "https://tre-pro.co.jp",
        accent: ACCENT.orange,
        status: "live",
        meta: "Public",
      },
      {
        label: "Lakkan",
        jaLabel: "株式会社Lakkan",
        sub: "This Site · Founded 2026",
        desc: "AIファースト企業。楽観と、計画と。あなたが今いる場所。",
        url: "/",
        accent: ACCENT.vermillion,
        status: "live",
        meta: "You are here",
      },
    ],
  },
  {
    group: "Group · Products",
    num: "II",
    items: [
      {
        label: "Now On Air",
        jaLabel: "AI Morning Dispatch",
        sub: "Daily Brief · Public",
        desc: "毎朝のAI業界モーニングディスパッチ。ビジネスに使える視点で整理。",
        url: "https://s-yamanaka-droid.github.io/nowonair/",
        accent: ACCENT.vermillion,
        status: "live",
        meta: "Updated daily",
      },
      {
        label: "KANOA Jobs",
        jaLabel: "求人プラットフォーム",
        sub: "Recruit Platform · Demo",
        desc: "Indeed型の求人検索 MVP。アクセスコード制で限定公開中。",
        url: "https://kanoa-jobs.vercel.app",
        accent: "#A8F5D8",
        status: "beta",
        meta: "Code: kanoa2026",
      },
      {
        label: "AI Quest",
        jaLabel: "AI研修ゲーム",
        sub: "RPG Training Game · Public",
        desc: "ゲーミフィケーション型のAI研修プラットフォーム。RPG世界観でAIスキルを冒険的に習得。",
        url: "https://ai-quest-delta.vercel.app/",
        accent: "#F5A8C8",
        status: "live",
        meta: "Play now",
      },
    ],
  },
  {
    group: "Group · Internal",
    num: "III",
    items: [
      {
        label: "Vigil",
        jaLabel: "Agent Headquarters",
        sub: "AI Harness · Internal",
        desc: "眠らない右腕。27のAIスキルとオートメーションが常駐するHQ。",
        url: "https://shoot-agent-v45.vercel.app",
        accent: "#FF4F00",
        status: "internal",
        meta: "27 skills",
      },
      {
        label: "Playbook",
        jaLabel: "Vigil Playbook",
        sub: "Knowledge Base · Internal",
        desc: "リアルタイム同期されるプレイブック。商談・提案ナレッジを集約。",
        url: "https://vigil-vert-gamma.vercel.app",
        accent: "#3A8C5C",
        status: "internal",
        meta: "Supabase synced",
      },
      {
        label: "Compete",
        jaLabel: "競合インテリジェンス",
        sub: "Market Watch · Internal",
        desc: "国内外AI企業20社のメモ集約。週次で動向更新。",
        url: "https://competitor-research-gamma.vercel.app",
        accent: "#7C3AED",
        status: "internal",
        meta: "20 companies",
      },
    ],
  },
];

const STATUS_COLOR: Record<PortalItem["status"], string> = {
  live: "#3A8C5C",
  internal: "#B07D00",
  beta: ACCENT.orange,
  coming: "#B0ADA6",
};
const STATUS_LABEL: Record<PortalItem["status"], string> = {
  live: "LIVE",
  internal: "INTERNAL",
  beta: "BETA",
  coming: "COMING",
};

function PortalCard({ p, i }: { p: PortalItem; i: number }) {
  const [hov, setHov] = useState(false);
  const isInternal = p.status === "internal";
  const isExternal = p.url.startsWith("http");
  return (
    <motion.a
      href={p.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        padding: "32px 28px 28px",
        textDecoration: "none",
        color: "#0D0D0D",
        background: hov ? "#FFFFFF" : "transparent",
        border: "1px solid rgba(13,13,13,0.1)",
        borderRadius: 4,
        transition: "background 0.2s, transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 18px 40px rgba(13,13,13,0.08), 0 0 0 1px ${p.accent}33` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Status pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: STATUS_COLOR[p.status],
              animation: p.status === "live" ? "pulse-status 1.8s ease-in-out infinite" : undefined,
            }}
          />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: STATUS_COLOR[p.status],
              textTransform: "uppercase",
            }}
          >
            {STATUS_LABEL[p.status]}
          </span>
        </div>
        {isInternal ? (
          <Lock size={11} color="#B0ADA6" />
        ) : (
          <ArrowUpRight
            size={14}
            color={hov ? p.accent : "#B0ADA6"}
            style={{ transition: "color 0.2s" }}
          />
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: INSTRUMENT,
          fontSize: 40,
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          color: hov ? p.accent : "#0D0D0D",
          transition: "color 0.2s",
          marginBottom: 6,
        }}
      >
        {p.label}<em style={{ fontStyle: "italic", opacity: 0.4 }}>.</em>
      </div>
      {p.jaLabel && (
        <div
          style={{
            fontFamily: FRANK,
            fontSize: 13,
            color: "#6B6860",
            marginBottom: 18,
            letterSpacing: "0.04em",
            fontWeight: 300,
          }}
        >
          {p.jaLabel}
        </div>
      )}

      {/* Sub */}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.16em",
          color: "#B0ADA6",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {p.sub}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: SANS,
          fontSize: 13,
          color: "#5A554D",
          lineHeight: 1.65,
          margin: "0 0 24px",
        }}
      >
        {p.desc}
      </p>

      {/* Meta footer */}
      {p.meta && (
        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid rgba(13,13,13,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: SANS,
            fontSize: 10,
            color: "#B0ADA6",
            letterSpacing: "0.06em",
          }}
        >
          <span>{p.meta}</span>
          <span
            style={{
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: 13,
              color: hov ? p.accent : "#B0ADA6",
              transition: "color 0.2s",
            }}
          >
            {isInternal ? "Open →" : "Visit →"}
          </span>
        </div>
      )}
    </motion.a>
  );
}

export function Portals() {
  return (
    <SectionShell
      id="portals"
      tone="cream"
      eyebrow="Portals · The Lakkan Universe"
      accent="vermillion"
      topBorder
    >
        {/* Big editorial headline */}
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
            color: "#0D0D0D",
            letterSpacing: "-0.025em",
            margin: "0 0 28px",
          }}
        >
          すべての入口は、<br />
          <Em accent="vermillion">ここに集まる。</Em>
        </motion.h2>
        <p
          style={{
            fontFamily: FRANK,
            fontSize: 17,
            fontWeight: 300,
            color: "#5A554D",
            lineHeight: 1.7,
            maxWidth: 640,
            margin: "0 0 80px",
            fontStyle: "italic",
          }}
        >
          Lakkan / Trepro が運用する全プロダクト・全ツールへのポータル。
          公開・限定・社内専用を含めて、ここから全てに辿れる。
        </p>

        {/* Groups */}
        {GROUPS.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: gi * 0.08, duration: 0.6, ease: EASE }}
            style={{ marginBottom: 64 }}
          >
            {/* Group header */}
            <div
              data-mobile-stack="grp-head"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                paddingBottom: 16,
                marginBottom: 24,
                borderBottom: "1px solid rgba(13,13,13,0.12)",
              }}
            >
              <span
                style={{
                  fontFamily: INSTRUMENT,
                  fontStyle: "italic",
                  fontSize: 24,
                  color: ACCENT.vermillion,
                  letterSpacing: "-0.01em",
                }}
              >
                {g.num}.
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "#0D0D0D",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {g.group}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  color: "#B0ADA6",
                  marginLeft: "auto",
                  letterSpacing: "0.1em",
                }}
              >
                {g.items.length} {g.items.length === 1 ? "ENTRY" : "ENTRIES"}
              </span>
            </div>

            {/* Cards grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {g.items.map((p, i) => (
                <PortalCard key={p.label} p={p} i={i} />
              ))}
            </div>
          </motion.div>
        ))}

      <style jsx>{`
        @keyframes pulse-status {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </SectionShell>
  );
}
