"use client";

import { motion } from "framer-motion";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

export function Manifesto() {
  return (
    <SectionShell
      id="manifesto"
      tone="cream"
      eyebrow="Manifesto"
      eyebrowVersion="0.1"
      accent="vermillion"
    >
      {/* Big editorial headline — keep manual h2 to preserve lineHeight 0.98 / maxWidth 20ch */}
      <motion.h2
        className="editorial-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          fontFamily: INSTRUMENT,
          fontSize: "clamp(44px, 7.2vw, 112px)",
          fontWeight: 400,
          lineHeight: 0.98,
          color: "#132126",
          letterSpacing: "-0.025em",
          margin: "0 0 48px",
          maxWidth: "20ch",
        }}
      >
        AIは武器だ。<br />
        <Em accent="vermillion">才能の民主化が、</Em>
        <br />
        ここから始まる。
      </motion.h2>

      {/* Three pillars */}
      <div
        data-mobile-stack="pillars"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 0,
          borderTop: "1px solid rgba(19,33,38,0.12)",
          marginTop: 48,
        }}
      >
        {[
          {
            num: "I.",
            title: "楽観的に動く。",
            body: "正解は走った先にある。完成度より、世に出す速度を選ぶ。",
          },
          {
            num: "II.",
            title: "悲観的に計画する。",
            body: "最悪を直視し、それでも前に進む準備を整える。これがLakkan。",
          },
          {
            num: "III.",
            title: "AIで再定義する。",
            body: "コストが下がれば、挑戦できる回数が増える。AI起点で全てを組み直す。",
          },
        ].map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
            style={{
              padding: "40px 32px 40px 0",
              borderRight:
                i < 2 ? "1px solid rgba(19,33,38,0.12)" : "none",
              paddingLeft: i > 0 ? 32 : 0,
            }}
          >
            <div
              style={{
                fontFamily: INSTRUMENT,
                fontSize: 14,
                fontStyle: "italic",
                color: ACCENT.vermillion,
                marginBottom: 14,
                letterSpacing: "0.04em",
              }}
            >
              {p.num}
            </div>
            <h3
              style={{
                fontFamily: FRANK,
                fontSize: 28,
                fontWeight: 400,
                color: "#132126",
                lineHeight: 1.18,
                margin: "0 0 14px",
                letterSpacing: "-0.01em",
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 13.5,
                color: "#45545A",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Signature */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
          marginTop: 64,
          paddingTop: 28,
          borderTop: "1px solid rgba(19,33,38,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: 11,
            color: "#45545A",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Shuto Yamanaka · Founder
        </span>
        <span
          style={{
            fontFamily: INSTRUMENT,
            fontStyle: "italic",
            fontSize: 22,
            color: "#132126",
          }}
        >
          山中 秀斗
        </span>
      </motion.div>
    </SectionShell>
  );
}
