"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

type Service = {
  num: string;
  title: string;
  jaTitle?: string;
  lede: string;
  audience: string;
  process: [string, string, string];
  range: string;
  accent: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Vibe Coding",
    jaTitle: "バイブコーディング支援",
    lede: "コードを書けなくても、プロダクトは作れる。AIと対話しながら『動くもの』を翌日に出す。",
    audience: "PM / 事業オーナー / スタートアップ創業者",
    process: ["1. ヒアリング", "2. AI×実装ペアリング", "3. 1週間でMVP納品"],
    range: "¥800,000 〜 / 1案件",
    accent: ACCENT.blue,
  },
  {
    num: "02",
    title: "AI Recruiting",
    jaTitle: "採用コンサル / Direct Sourcing",
    lede: "感覚ではなく仕組みで良い人と出会う。AIスカウト×人の目利きで、採用の歩留まりを再設計する。",
    audience: "採用責任者 / HR / 30〜500名規模の事業会社",
    process: ["1. ペルソナ再定義", "2. AIスカウト基盤構築", "3. 運用＆面談支援"],
    range: "¥500,000 / 月（3ヶ月〜）",
    accent: ACCENT.vermillion,
  },
  {
    num: "03",
    title: "Performance Ads",
    jaTitle: "ウェブ広告運用",
    lede: "数字で語り、感情で動かす。データと直感、両方を握ってクリエイティブと予算配分を最適化する。",
    audience: "D2C / SaaS / 採用LP オーナー",
    process: ["1. KGI/KPI再設計", "2. AI生成クリエイティブ", "3. 週次運用 & 学習"],
    range: "広告費の20% or ¥300,000〜",
    accent: ACCENT.orange,
  },
  {
    num: "04",
    title: "Corporate Site",
    jaTitle: "コーポレートサイト構築",
    lede: "Anthropic / Granola / Pallas Partners 級のエディトリアルなサイトを、AI起点で1〜2週間で立ち上げる。",
    audience: "リブランディング中の企業 / 上場準備企業",
    process: ["1. ブランド診断", "2. デザイン選定 & 実装", "3. Vercel本番デプロイ"],
    range: "¥1,500,000 〜",
    accent: "#3A8C5C",
  },
  {
    num: "05",
    title: "AI Reskilling",
    jaTitle: "AIリスキリング支援",
    lede: "『AIを使える人』を社内に増やす。個人の可能性と組織の競争力を、同じ時間軸で押し上げる。",
    audience: "人事 / 経営企画 / 全社員にAIを浸透させたい企業",
    process: ["1. 現状診断", "2. 実務ハンズオン", "3. Skill運用伴走"],
    range: "¥800,000 / 月（3ヶ月〜）",
    accent: "#7C3AED",
  },
  {
    num: "06",
    title: "Apparel × AI",
    jaTitle: "アパレル（思想を纏う）",
    lede: "楽観的な世界観を、服にする。AIが生んだデザインで、ブランドの思想をプロダクトに変換する。",
    audience: "ブランド創業者 / クリエイティブディレクター",
    process: ["1. 世界観言語化", "2. AI生成 → 物質化", "3. 限定生産 / 販売"],
    range: "応相談（コラボ前提）",
    accent: "#D4317A",
  },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: i * 0.07, duration: 0.55, ease: EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "36px 32px 32px",
        border: "1px solid #E8E3D8",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov
          ? "0 16px 40px rgba(13,13,13,0.08)"
          : "0 2px 6px rgba(13,13,13,0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: s.accent,
        }}
      />

      {/* Header */}
      <header>
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
              fontSize: 14,
              color: s.accent,
              letterSpacing: "0.04em",
            }}
          >
            №{s.num}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#B0ADA6",
              textTransform: "uppercase",
            }}
          >
            Service
          </span>
        </div>
        <h3
          style={{
            fontFamily: FRANK,
            fontSize: 30,
            fontWeight: 400,
            color: "#0D0D0D",
            lineHeight: 1.1,
            margin: "0 0 6px",
            letterSpacing: "-0.015em",
          }}
        >
          {s.title}
        </h3>
        {s.jaTitle && (
          <div
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: "#8A857C",
              letterSpacing: "0.02em",
            }}
          >
            {s.jaTitle}
          </div>
        )}
      </header>

      {/* Lede */}
      <p
        style={{
          fontFamily: SANS,
          fontSize: 13,
          color: "#5A554D",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {s.lede}
      </p>

      {/* Spec rows */}
      <dl style={{ margin: 0, padding: 0, display: "grid", gap: 14 }}>
        <div>
          <dt
            style={{
              fontFamily: SANS,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#B0ADA6",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            For
          </dt>
          <dd
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              color: "#0D0D0D",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {s.audience}
          </dd>
        </div>
        <div>
          <dt
            style={{
              fontFamily: SANS,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#B0ADA6",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Process
          </dt>
          <dd style={{ margin: 0 }}>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 4 }}>
              {s.process.map((p) => (
                <li
                  key={p}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: "#5A554D",
                    lineHeight: 1.5,
                    paddingLeft: 12,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 8,
                      width: 6,
                      height: 1,
                      background: s.accent,
                    }}
                  />
                  {p}
                </li>
              ))}
            </ol>
          </dd>
        </div>
        <div
          style={{
            paddingTop: 14,
            borderTop: "1px solid rgba(13,13,13,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <dt
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#B0ADA6",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Range
            </dt>
            <dd
              style={{
                fontFamily: INSTRUMENT,
                fontStyle: "italic",
                fontSize: 18,
                color: "#0D0D0D",
                margin: 0,
                letterSpacing: "-0.005em",
              }}
            >
              {s.range}
            </dd>
          </div>
          <ArrowUpRight
            size={18}
            color={s.accent}
            style={{
              opacity: hov ? 1 : 0.3,
              transform: hov ? "translate(2px,-2px)" : "none",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          />
        </div>
      </dl>
    </motion.article>
  );
}

export function Service() {
  return (
    <SectionShell id="service" tone="creamLight" eyebrow="Service · 6 Capabilities" accent="orange">
        {/* Headline */}
        <div
          data-mobile-stack="svc-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 40,
            flexWrap: "wrap",
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
              fontSize: "clamp(48px, 8vw, 128px)",
              fontWeight: 400,
              lineHeight: 0.95,
              color: "#0D0D0D",
              letterSpacing: "-0.025em",
              margin: 0,
              maxWidth: "16ch",
            }}
          >
            <Em accent="orange">武器</Em>を、
            <br />
            事業に渡す。
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            style={{
              fontFamily: SANS,
              fontSize: 14,
              color: "#5A554D",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: 360,
              paddingBottom: 12,
            }}
          >
            Lakkanは『1社で複数事業』ではなく『1社でAI運用基盤』として動く。
            その上で、6つの武器を必要な事業に必要な分だけ渡している。
          </motion.p>
        </div>

        <div style={{ height: 1, background: "rgba(13,13,13,0.12)", marginBottom: 40 }} />

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.num} s={s} i={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: "1px solid rgba(13,13,13,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: "#6B6860",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            All prices are exclusive of tax · Custom scopes welcome
          </span>
          <a
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: 18,
              color: "#0D0D0D",
              textDecoration: "none",
              borderBottom: `1px solid ${ACCENT.vermillion}`,
              paddingBottom: 4,
            }}
          >
            まず、相談する <ArrowUpRight size={16} />
          </a>
        </motion.div>
    </SectionShell>
  );
}
