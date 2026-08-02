"use client";

import { motion } from "framer-motion";
import { INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

/**
 * Story (Origin Story)
 * Manifesto と被らないよう、起源 / 系譜 / なぜLakkanという法人を作ったか の編集記事として再定義。
 */
export function Story() {
  return (
    <SectionShell
      id="story"
      tone="cream"
      eyebrow="Origin Story"
      eyebrowVersion="0.1"
      accent="blue"
    >
      {/* Headline — keep manual h2: lineHeight 0.98, margin "0 0 56px" */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          fontFamily: INSTRUMENT,
          fontSize: "clamp(44px, 7.2vw, 112px)",
          fontWeight: 400,
          lineHeight: 0.98,
          color: "#0D0D0D",
          letterSpacing: "-0.025em",
          margin: "0 0 56px",
          maxWidth: "22ch",
        }}
      >
        ある日、<Em accent="blue">運</Em>が
        <br />
        <Em accent="blue">計画</Em>に変わった。
      </motion.h2>

      {/* Editorial body — single column, breath */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        data-mobile-stack="story-body"
        style={{
          borderTop: "1px solid rgba(13,13,13,0.12)",
          paddingTop: 48,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "6vw",
          alignItems: "start",
        }}
      >
        <p
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(20px, 2.2vw, 30px)",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#0D0D0D",
            margin: 0,
            letterSpacing: "-0.005em",
          }}
        >
          <Em accent="vermillion">LUCK × 楽観 = LAKKAN.</Em>
          <br />
          運に頼ったまま終わるのではなく、
          運を計画に翻訳する。
          <br />
          そのために法人格を持った。
        </p>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 14,
            color: "#5A554D",
            lineHeight: 1.95,
            margin: 0,
            maxWidth: "44ch",
          }}
        >
          Lakkan は、AIファーストで再設計された実験体。
          「数を打つ・速く出す・賢く失敗する」を組織として実装するため、
          既存の組織図ではなく{" "}
          <em>AI Harness</em>{" "}
          を中心に動かす。
          <br />
          <br />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              color: "#B0ADA6",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ※ 個人の経歴は{" "}
            <a
              href="/about"
              style={{ color: ACCENT.vermillion, textDecoration: "none", borderBottom: `1px solid ${ACCENT.vermillion}` }}
            >
              About
            </a>{" "}
            を参照
          </span>
        </p>
      </motion.div>

      {/* Pull quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
        style={{
          margin: "80px auto 0",
          padding: "40px 0 0",
          borderTop: "1px solid rgba(13,13,13,0.12)",
          maxWidth: 920,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: INSTRUMENT,
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 40px)",
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#0D0D0D",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          “運を計画に変えるのは、いつだって、走った人間だけだ。”
        </p>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.16em",
            color: ACCENT.vermillion,
            textTransform: "uppercase",
            marginTop: 18,
          }}
        >
          — Founder&apos;s Note
        </div>
      </motion.blockquote>
    </SectionShell>
  );
}
