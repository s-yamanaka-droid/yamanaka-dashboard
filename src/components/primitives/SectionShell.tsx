"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { INSTRUMENT, SANS, FRANK, EASE, ACCENT } from "@/lib/design-tokens";

/**
 * SectionShell — Lakkan editorial section primitive.
 *
 * 必ずこれを使うこと。直接 <section> を書かない。
 * これにより全セクションで以下が自動保証される:
 *   - background / padding / maxWidth / フォント / 罫線 の統一
 *   - Eyebrow と Headline の規格遵守（FACTS.md §4 準拠）
 *   - モバイル対応 padding (clamp)
 *   - スクロール in アニメーション
 *
 * @see FACTS.md §4 (Design System)
 */

type AccentRole = "vermillion" | "blue" | "orange" | "forest";
type Tone = "cream" | "creamLight"; // 互いの色違い

const TONE_BG: Record<Tone, string> = {
  cream: "#EEF0EC",
  creamLight: "#E4E8E4",
};

export function SectionShell({
  id,
  tone = "cream",
  eyebrow,
  eyebrowVersion,
  accent = "vermillion",
  topBorder = false,
  children,
}: {
  id?: string;
  tone?: Tone;
  /** "Origin Story" のようなセクション名 */
  eyebrow?: string;
  /** "0.1" のようなバージョン番号。Eyebrow末尾に "· v.<version>" として付く */
  eyebrowVersion?: string;
  /** Eyebrow と見出し強調の色 */
  accent?: AccentRole;
  topBorder?: boolean;
  children: ReactNode;
}) {
  const accentColor = ACCENT[accent];
  return (
    <section
      id={id}
      style={{
        background: TONE_BG[tone],
        padding: "var(--section-padding, 120px 56px)",
        borderTop: topBorder ? "1px solid rgba(19,33,38,0.08)" : undefined,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: accentColor,
              textTransform: "uppercase",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 24, height: 1, background: accentColor }} />
            {eyebrow}
            {eyebrowVersion && (
              <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", letterSpacing: "0.04em" }}>
                · v.{eyebrowVersion}
              </span>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

/**
 * BigHeadline — Lakkan規格の巨大エディトリアル見出し。
 *
 * 使い方:
 *   <BigHeadline>
 *     ある日、<Em accent="blue">運</Em>が
 *     <br /><Em accent="blue">計画</Em>に変わった。
 *   </BigHeadline>
 */
export function BigHeadline({
  children,
  size = "lg",
  maxWidth = "22ch",
}: {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  maxWidth?: string;
}) {
  const sizeMap = {
    md: "clamp(40px, 6vw, 80px)",
    lg: "clamp(44px, 7.2vw, 112px)",
    xl: "clamp(56px, 9vw, 144px)",
  };
  return (
    <motion.h2
      className="editorial-heading"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        fontFamily: INSTRUMENT,
        fontSize: sizeMap[size],
        fontWeight: 400,
        lineHeight: 0.96,
        color: "#132126",
        letterSpacing: "-0.025em",
        margin: "0 0 48px",
        maxWidth,
      }}
    >
      {children}
    </motion.h2>
  );
}

/**
 * Em — 見出し中のイタリック強調（アクセント色付き）
 */
export function Em({
  children,
  accent = "vermillion",
}: {
  children: ReactNode;
  accent?: AccentRole;
}) {
  return (
    <em style={{ fontStyle: "italic", color: ACCENT[accent] }}>{children}</em>
  );
}

/**
 * Lede — エディトリアル序文（イタリックセリフ）
 */
export function Lede({ children, maxWidth = 640 }: { children: ReactNode; maxWidth?: number }) {
  return (
    <p
      style={{
        fontFamily: FRANK,
        fontSize: 17,
        fontWeight: 300,
        color: "#45545A",
        lineHeight: 1.7,
        maxWidth,
        margin: "0 0 56px",
        fontStyle: "italic",
      }}
    >
      {children}
    </p>
  );
}

/**
 * EditorialDivider — 上下のセクション罫線
 */
export function EditorialDivider({ marginY = 48 }: { marginY?: number }) {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(19,33,38,0.12)",
        margin: `${marginY}px 0`,
      }}
    />
  );
}
