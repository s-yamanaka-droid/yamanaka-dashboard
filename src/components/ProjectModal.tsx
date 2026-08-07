"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Project, Category, resolveWorkType } from "@/types";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

const CAT_LABEL: Record<Exclude<Category, "all">, string> = {
  website: "Website", external: "External", internal: "Internal",
  analytics: "Analytics", onboarding: "Onboarding", ai_agent: "AI Agent",
};
const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  website: "#2C5268", external: "#315A4E", internal: "#5B5871",
  analytics: "#A14C3B", onboarding: "#806126", ai_agent: "#7C445E",
};
const STATUS = {
  live:     { label: "Live",     color: "#315A4E", dot: "#315A4E" },
  dev:      { label: "In Dev",   color: "#806126", dot: "#A14C3B" },
  archived: { label: "Archived", color: "#6E7A7C", dot: "#A8B4AE" },
};
const BUILT_LABEL: Record<string, string> = {
  claude_code: "Claude Code", manual: "Manual", v0: "v0", bolt: "Bolt",
};
const WORK_TYPE_LABEL = {
  client: "CLIENT WORK",
  own: "OWNED PRODUCT",
  "ai-concept": "AI CONCEPT",
};
const WORK_TYPE_COLOR = {
  client: "#315A4E",
  own: "#2C5268",
  "ai-concept": "#B4382B",
};

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(19,33,38,0.65)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 10000,
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 42 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              maxHeight: "90vh", background: "#F8F9F6",
              zIndex: 10001, borderRadius: "20px 20px 0 0",
              overflowY: "auto",
            }}
          >
            {/* Category color accent */}
            <div style={{ height: 4, background: CAT_COLOR[project.category], borderRadius: "20px 20px 0 0" }}/>

            <div style={{ padding: "36px clamp(24px,5vw,64px) 72px" }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    {(() => {
                      const type = resolveWorkType(project);
                      const color = WORK_TYPE_COLOR[type];
                      return (
                        <span style={{
                          fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                          color, border: `1px solid ${color}55`, background: `${color}0D`,
                          padding: "3px 10px", borderRadius: 100,
                        }}>
                          {WORK_TYPE_LABEL[type]}
                        </span>
                      );
                    })()}
                    <span style={{
                      fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                      color: CAT_COLOR[project.category],
                      background: CAT_COLOR[project.category] + "1A",
                      padding: "3px 10px", borderRadius: 100,
                    }}>
                      {CAT_LABEL[project.category].toUpperCase()}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 11, color: STATUS[project.status].color }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS[project.status].dot, display: "inline-block" }}/>
                      {STATUS[project.status].label}
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: 11, color: "#6E7A7C" }}>
                      {BUILT_LABEL[project.builtWith] ?? project.builtWith}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 style={{
                    fontFamily: FRANK,
                    fontSize: "clamp(32px, 5.5vw, 88px)",
                    fontWeight: 400, lineHeight: 0.92,
                    letterSpacing: "-0.02em",
                    color: "#132126", margin: "0 0 8px",
                  }}>
                    {project.name}
                  </h2>
                  {project.client && (
                    <p style={{ fontFamily: SANS, fontSize: 13, color: "#6E7A7C", margin: 0 }}>
                      for {project.client}
                    </p>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={onClose}
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(19,33,38,0.07)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, marginLeft: 20,
                  }}
                >
                  <X size={16} color="#132126"/>
                </button>
              </div>

              <div style={{ height: 1, background: "#132126", opacity: 0.08, marginBottom: 28 }}/>

              {/* Description */}
              <p style={{
                fontFamily: FRANK,
                fontSize: "clamp(18px, 2.3vw, 30px)",
                fontWeight: 300, lineHeight: 1.6,
                color: "#132126", margin: "0 0 40px",
                maxWidth: 700,
              }}>
                {project.description}
              </p>

              {/* Meta row */}
              {(() => {
                const created = new Date(project.createdAt);
                const updated = new Date(project.updatedAt);
                const diffDays = Math.max(1, Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
                const buildLabel = diffDays === 0 ? "1 day sprint" : diffDays === 1 ? "1 day" : `${diffDays} days`;
                return (
                  <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 32 }}>
                    {[
                      ["CREATED",    created.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })],
                      ["UPDATED",    updated.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })],
                      ["BUILD TIME", buildLabel],
                      ...(project.client ? [["CLIENT", project.client]] : []),
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", color: "#6E7A7C", marginBottom: 5 }}>{k}</div>
                        <div style={{
                          fontFamily: k === "BUILD TIME" ? FRANK : SANS,
                          fontSize: k === "BUILD TIME" ? 18 : 14,
                          fontWeight: k === "BUILD TIME" ? 400 : 400,
                          color: k === "BUILD TIME" ? CAT_COLOR[project.category] : "#132126",
                        }}>{v}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 44 }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: SANS, fontSize: 11,
                    color: CAT_COLOR[project.category],
                    border: `1px solid ${CAT_COLOR[project.category]}50`,
                    borderRadius: 6, padding: "4px 12px",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* URL / CTA */}
              {project.url ? (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#ECEAE4", borderRadius: 8,
                    padding: "10px 16px", marginBottom: 16,
                    maxWidth: 520,
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#315A4E", flexShrink: 0 }}/>
                    <span style={{ fontFamily: SANS, fontSize: 12, color: "#45545A", wordBreak: "break-all" }}>
                      {project.url}
                    </span>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: FRANK, fontSize: 18, fontWeight: 400,
                      color: "#F8F9F6",
                      background: CAT_COLOR[project.category],
                      padding: "15px 36px", borderRadius: 100,
                      textDecoration: "none",
                    }}
                  >
                    Visit Site <ArrowUpRight size={16}/>
                  </a>
                </div>
              ) : (
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  fontFamily: FRANK, fontSize: 15, fontWeight: 300,
                  color: "#6E7A7C", border: "1px solid #E0DBD2",
                  padding: "12px 28px", borderRadius: 100,
                }}>
                  Coming Soon
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
