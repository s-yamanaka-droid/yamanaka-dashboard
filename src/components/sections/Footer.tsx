"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Command } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";

const NAV_PRIMARY: [string, string][] = [
  ["Manifesto", "#manifesto"],
  ["Works", "#works"],
  ["News", "#news"],
  ["Story", "#story"],
  ["Service", "#service"],
];
const NAV_SECONDARY: [string, string][] = [
  ["Vigil", "#vigil"],
  ["About", "#about"],
  ["Join", "#join"],
  ["Portals", "#portals"],
];

export function Footer({ onOpenCmd }: { onOpenCmd: () => void }) {
  return (
    <footer
      id="contact"
      style={{
        background: "#0D0D0D",
        padding: "96px 56px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 24,
              height: 1,
              background: "rgba(255,255,255,0.4)",
            }}
          />
          Closing — 2026
        </motion.div>

        {/* Mega type */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(72px, 16vw, 240px)",
            fontWeight: 400,
            lineHeight: 0.85,
            color: "#FFFFFF",
            letterSpacing: "-0.04em",
            margin: "0 0 12px",
          }}
        >
          Lakkan.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          style={{
            fontFamily: INSTRUMENT,
            fontStyle: "italic",
            fontSize: "clamp(20px,2.4vw,34px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 64px",
            letterSpacing: "-0.005em",
          }}
        >
          楽観と、計画と。
        </motion.p>

        {/* Big editorial grid */}
        <div
          data-mobile-stack="foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            gap: "4vw",
            paddingTop: 40,
            paddingBottom: 48,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Company */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Company
            </div>
            <div
              style={{
                fontFamily: FRANK,
                fontSize: 18,
                color: "#FFFFFF",
                marginBottom: 12,
                letterSpacing: "0.04em",
              }}
            >
              株式会社 Lakkan
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 12.5,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.85,
                margin: "0 0 12px",
              }}
            >
              東京都渋谷区神宮前
              <br />
              六丁目 23 番 4 号
              <br />
              Founded 2026
            </p>
            <a
              href="mailto:s-yamanaka@tre-pro.co.jp"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: INSTRUMENT,
                fontStyle: "italic",
                fontSize: 16,
                color: "#FFFFFF",
                textDecoration: "none",
                borderBottom: `1px solid ${ACCENT.vermillion}`,
                paddingBottom: 3,
              }}
            >
              s-yamanaka@tre-pro.co.jp
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Explore */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Explore
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {NAV_PRIMARY.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    style={{
                      fontFamily: FRANK,
                      fontSize: 15,
                      color: "rgba(255,255,255,0.78)",
                      textDecoration: "none",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              More
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
              {NAV_SECONDARY.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    style={{
                      fontFamily: FRANK,
                      fontSize: 15,
                      color: "rgba(255,255,255,0.78)",
                      textDecoration: "none",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Newsletter-ish */}
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Be in touch
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 12.5,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                margin: "0 0 18px",
              }}
            >
              採用・業務委託・コラボ。
              1 通のメールから始めましょう。
            </p>
            <a
              href="#join"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#0D0D0D",
                background: ACCENT.vermillion,
                textTransform: "uppercase",
                padding: "12px 18px",
                borderRadius: 100,
                textDecoration: "none",
              }}
            >
              Join Lakkan <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Lakkan Inc. — Designed &amp; Built with AI.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a
              href="/privacy"
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Privacy
            </a>
            <a
              href="https://tre-pro.co.jp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Parent: Trepro
            </a>
            <button
              onClick={onOpenCmd}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 6,
                padding: "5px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Command size={11} /> K
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
