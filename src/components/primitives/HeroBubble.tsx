"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { INSTRUMENT, SANS } from "@/lib/design-tokens";

/**
 * HeroBubble — editorial stat card.
 * Replaces glassmorphism pill with a publication-style card:
 *   - cream background with accent top stripe
 *   - number rendered in Instrument Serif italic
 *   - accent color used as ink for the number, not as background
 */
export function HeroBubble({
  label, sub, accent, x, y, delay, floatDur, onClick,
}: {
  label: string; sub: string; accent: string;
  x: string; y: string; delay: number; floatDur: number;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      style={{ position: "absolute", left: x, top: y, zIndex: 2 }}
      animate={{ y: [0, -6, 0, -3, 0] }}
      transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.button
        onMouseEnter={() => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: accent })); }}
        onMouseLeave={() => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); }}
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18 }}
        style={{
          background: hov ? "#FFFFFF" : "#F7F4EE",
          border: `1px solid ${hov ? accent : "rgba(13,13,13,0.12)"}`,
          borderTop: `3px solid ${accent}`,
          padding: "14px 20px 12px",
          cursor: "pointer",
          textAlign: "left",
          minWidth: 132,
          borderRadius: 2,
          boxShadow: hov
            ? `0 14px 32px rgba(13,13,13,0.18), 0 0 0 1px ${accent}22`
            : "0 4px 14px rgba(13,13,13,0.06)",
          transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Top: dot + sub */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: accent,
              flexShrink: 0,
              opacity: 0.85,
            }}
          />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#0D0D0D",
              opacity: 0.55,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {sub}
          </span>
        </div>

        {/* Big number / label */}
        <div
          style={{
            fontFamily: INSTRUMENT,
            fontStyle: "italic",
            fontSize: "clamp(28px, 3vw, 38px)",
            fontWeight: 400,
            color: accent,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </div>
      </motion.button>
    </motion.div>
  );
}
