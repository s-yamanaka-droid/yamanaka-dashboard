"use client";

import { motion } from "framer-motion";
import { INSTRUMENT, FRANK, SANS, EASE, ACCENT } from "@/lib/design-tokens";

const RULE = "rgba(19,33,38,0.12)";

type Props = {
  /** Section label, e.g. "Lab" — appears italic in eyebrow */
  section: string;
  /** Version label, e.g. "v.1.0" */
  version: string;
  /** Massive Instrument Serif headline */
  title: string;
  /** Italic lede in Frank Ruhl Libre, 1–2 lines */
  lede: string;
  /** Optional override for background color */
  background?: string;
};

/**
 * Unified subpage hero.
 * - Eyebrow: "Section · v.x" with horizontal rule, vermillion accent
 * - Title : Instrument Serif, huge, letter-spacing -0.025em
 * - Lede  : Frank Ruhl Libre italic
 */
export function PageHero({ section, version, title, lede, background = "#EEF0EC" }: Props) {
  const hasTerminalPunctuation = /[。.!！?？]$/.test(title.trim());
  const pauseIndex = title.indexOf("、");
  const titleLead = pauseIndex >= 0 ? title.slice(0, pauseIndex + 1) : title;
  const titleTail = pauseIndex >= 0 ? title.slice(pauseIndex + 1) : "";
  return (
    <section
      className="page-hero"
      style={{
        background,
        color: "#132126",
        padding: "120px 56px 64px",
        borderBottom: `1px solid ${RULE}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: ACCENT.vermillion,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 24, height: 1, background: ACCENT.vermillion }} />
          <span>{section}</span>
          <em
            style={{
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: 13,
              letterSpacing: "0.04em",
              textTransform: "none",
              color: ACCENT.vermillion,
            }}
          >
            · {version}
          </em>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="editorial-heading editorial-heading--display page-hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(56px, 9vw, 144px)",
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            margin: "0 0 28px",
            color: "#132126",
          }}
        >
          <span className="heading-phrase">{titleLead}</span>
          {titleTail && (
            <>
              <br />
              <span className="heading-phrase">{titleTail}</span>
            </>
          )}
          {!hasTerminalPunctuation && <span style={{ color: ACCENT.vermillion }}>.</span>}
        </motion.h1>

        {/* Lede */}
        <motion.p
          className="editorial-lede page-hero-lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          style={{
            fontFamily: FRANK,
            fontStyle: "italic",
            fontSize: "clamp(18px, 2vw, 24px)",
            fontWeight: 300,
            lineHeight: 1.55,
            color: "rgba(19,33,38,0.7)",
            maxWidth: 780,
            margin: 0,
          }}
        >
          {lede}
        </motion.p>
      </div>
    </section>
  );
}
