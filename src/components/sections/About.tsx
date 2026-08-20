"use client";

import { motion } from "framer-motion";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

const FOCUS = [
  {
    num: "01",
    title: "Strategy",
    jp: "事業と業務の再設計",
    body: "AIを追加するのではなく、会議・資料・判断・実行の流れそのものを組み直します。",
  },
  {
    num: "02",
    title: "Product",
    jp: "動くプロダクトへの実装",
    body: "構想を画面と仕組みに変え、実際に触れて検証できる状態まで短いサイクルで進めます。",
  },
  {
    num: "03",
    title: "Operation",
    jp: "使うほど育つ運用",
    body: "判断と修正を蓄積し、個人技に戻らない再現性のある業務フローへつなげます。",
  },
];

const METHOD = [
  { step: "01", title: "Observe", text: "現場の業務と意思決定を観察する。" },
  { step: "02", title: "Redesign", text: "AIを前提に、流れと役割を引き直す。" },
  { step: "03", title: "Build", text: "動く画面と運用へ、一気につなぐ。" },
  { step: "04", title: "Learn", text: "使った結果を蓄積し、次の判断を速くする。" },
];

const PROFILE = [
  ["Company", "株式会社Lakkan / Lakkan Inc."],
  ["Founded", "2026"],
  ["Location", "東京都渋谷区神宮前六丁目23番4号"],
  ["Focus", "AI Strategy / Product / Operation"],
];

export function About() {
  return (
    <SectionShell id="about" tone="cream" eyebrow="Company · Lakkan Inc." accent="vermillion">
      <div
        data-mobile-stack="about-intro"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
          gap: "7vw",
          alignItems: "end",
          marginBottom: 96,
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
            fontSize: "clamp(56px, 7.5vw, 112px)",
            fontWeight: 400,
            lineHeight: 0.94,
            color: "#132126",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          楽観を、<br />
          <Em accent="vermillion"><span className="heading-phrase">動く仕組みに。</span></Em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          style={{ paddingBottom: 8 }}
        >
          <p
            style={{
              fontFamily: FRANK,
              fontSize: "clamp(18px, 2vw, 26px)",
              fontWeight: 300,
              color: "#132126",
              lineHeight: 1.65,
              margin: "0 0 24px",
            }}
          >
            Lakkanは、AIを前提に事業と業務の流れを再設計する会社です。
          </p>
          <p style={{ fontFamily: SANS, fontSize: 14, color: "#45545A", lineHeight: 1.9, margin: 0 }}>
            構想、プロダクト、運用を分断しない。
            小さく作り、実際に使い、学びを次の判断へ戻す。
            楽観と計画を、ひとつの実装にします。
          </p>
        </motion.div>
      </div>

      <div
        data-mobile-stack="about-focus"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          borderTop: "1px solid rgba(19,33,38,0.14)",
          borderBottom: "1px solid rgba(19,33,38,0.14)",
          marginBottom: 112,
        }}
      >
        {FOCUS.map((item, index) => (
          <motion.article
            key={item.num}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.1, duration: 0.55, ease: EASE }}
            style={{
              padding: index === 0 ? "40px 32px 40px 0" : "40px 32px",
              borderLeft: index > 0 ? "1px solid rgba(19,33,38,0.12)" : undefined,
            }}
          >
            <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 16, color: ACCENT.vermillion }}>
              {item.num}
            </span>
            <h3 style={{ fontFamily: INSTRUMENT, fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 400, color: "#132126", margin: "20px 0 8px", lineHeight: 1 }}>
              {item.title}
            </h3>
            <p style={{ fontFamily: FRANK, fontSize: 17, color: "#132126", margin: "0 0 20px" }}>{item.jp}</p>
            <p style={{ fontFamily: SANS, fontSize: 13, color: "#45545A", lineHeight: 1.8, margin: 0 }}>{item.body}</p>
          </motion.article>
        ))}
      </div>

      <div
        data-mobile-stack="about-details"
        style={{ display: "grid", gridTemplateColumns: "minmax(220px, 0.7fr) minmax(0, 1.3fr)", gap: "8vw" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", color: ACCENT.vermillion, textTransform: "uppercase", margin: "0 0 24px" }}>
            How we work
          </p>
          <h3 style={{ fontFamily: INSTRUMENT, fontSize: "clamp(38px, 5vw, 72px)", fontWeight: 400, lineHeight: 1.02, letterSpacing: "-0.02em", color: "#132126", margin: "0 0 64px" }}>
            Think.<br />Build.<br /><em style={{ color: ACCENT.vermillion }}>Learn.</em>
          </h3>
          <div style={{ borderTop: "1px solid rgba(19,33,38,0.14)" }}>
            {PROFILE.map(([label, value]) => (
              <div key={label} style={{ padding: "18px 0", borderBottom: "1px solid rgba(19,33,38,0.1)" }}>
                <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.18em", color: "#6E7A7C", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: FRANK, fontSize: 15, color: "#132126", lineHeight: 1.55 }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ borderTop: "1px solid rgba(19,33,38,0.14)" }}>
          {METHOD.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: EASE }}
              data-mobile-stack="about-method"
              style={{
                display: "grid",
                gridTemplateColumns: "64px minmax(120px, 0.65fr) minmax(0, 1fr)",
                gap: 24,
                alignItems: "baseline",
                padding: "30px 0",
                borderBottom: "1px solid rgba(19,33,38,0.12)",
              }}
            >
              <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 16, color: ACCENT.vermillion }}>{item.step}</span>
              <strong style={{ fontFamily: INSTRUMENT, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 400, color: "#132126" }}>{item.title}</strong>
              <span style={{ fontFamily: SANS, fontSize: 14, color: "#45545A", lineHeight: 1.7 }}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
