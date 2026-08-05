"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category, Project, WorkType, resolveWorkType } from "@/types";
import {
  INSTRUMENT, FRANK, SANS, EASE, ACCENT,
  CAT_COLOR, CAT_LABEL, STATUS, ALL_CATS, isNew, SortKey,
} from "@/lib/design-tokens";

const BORDER = "rgba(13,13,13,0.12)";
const BORDER_SOFT = "rgba(13,13,13,0.08)";
const INK = "#0D0D0D";
const INK_MID = "#5A554D";
const INK_LOW = "#B0ADA6";
const PAPER = "#F5F3EE";

const WORK_TYPE_META: Record<WorkType | "all", { label: string; short: string; desc: string; color: string }> = {
  all: { label: "All Work", short: "All", desc: "すべての制作物", color: INK },
  client: { label: "Client Work", short: "Client", desc: "実案件・クライアントワーク", color: ACCENT.forest },
  own: { label: "Owned Products", short: "Owned", desc: "Lakkan・関係会社のプロダクト", color: ACCENT.blue },
  "ai-concept": { label: "AI Concept Lab", short: "AI Concept", desc: "架空ブランドのAIデザイン実験", color: ACCENT.vermillion },
};

function WorkTypeBadge({ project }: { project: Project }) {
  const meta = WORK_TYPE_META[resolveWorkType(project)];
  return (
    <span style={{
      fontFamily: SANS,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: "0.14em",
      color: meta.color,
      border: `1px solid ${meta.color}55`,
      background: `${meta.color}0D`,
      padding: "3px 8px",
      borderRadius: 100,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {meta.short}
    </span>
  );
}

/* -------------------------------------------------- */
/* Featured big card                                   */
/* -------------------------------------------------- */
function FeaturedRow({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  const cc = CAT_COLOR[project.category];
  const cl = CAT_LABEL[project.category];
  const st = STATUS[project.status];

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: cc })); }}
      onMouseLeave={() => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.55, ease: EASE }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
        gap: 32,
        alignItems: "stretch",
        textAlign: "left",
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hov ? "0 18px 40px rgba(13,13,13,0.10)" : "0 2px 8px rgba(13,13,13,0.04)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "transform .25s ease, box-shadow .25s ease, border-color .2s ease",
        borderColor: hov ? cc + "55" : BORDER,
      }}
    >
      {/* Visual block */}
      <div
        style={{
          position: "relative",
          minHeight: 260,
          background: `linear-gradient(135deg, ${cc}14 0%, ${cc}05 60%, transparent 100%)`,
          borderRight: `1px solid ${BORDER_SOFT}`,
          padding: "32px 32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cc, display: "inline-block" }} />
          <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: cc, textTransform: "uppercase" }}>
            {cl} · Featured
          </span>
        </div>
        <div
          aria-hidden
          style={{
            fontFamily: INSTRUMENT,
            fontStyle: "italic",
            fontSize: "clamp(80px, 11vw, 160px)",
            lineHeight: 0.9,
            color: cc,
            opacity: 0.18,
            letterSpacing: "-0.04em",
            margin: "0 0 -12px",
            userSelect: "none",
            textAlign: "right",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content block */}
      <div style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <WorkTypeBadge project={project} />
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 11, color: st.color, letterSpacing: "0.06em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
            {st.label}
          </span>
          {project.client && (
            <span style={{ fontFamily: SANS, fontSize: 11, color: INK_LOW, letterSpacing: "0.04em" }}>
              for {project.client}
            </span>
          )}
          {isNew(project.updatedAt) && (
            <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#FFF", background: ACCENT.orange, padding: "2px 8px", borderRadius: 100 }}>
              NEW
            </span>
          )}
        </div>

        <h3
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(28px, 2.3vw, 38px)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
            color: hov ? cc : INK,
            margin: 0,
            transition: "color .2s ease",
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            fontFamily: SANS,
            fontSize: 14,
            color: INK_MID,
            lineHeight: 1.65,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
          {project.tags.slice(0, 4).map(t => (
            <span key={t} style={{ fontFamily: SANS, fontSize: 10, color: INK_MID, border: `1px solid ${BORDER_SOFT}`, borderRadius: 100, padding: "2px 9px", letterSpacing: "0.02em" }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, color: INK_LOW, letterSpacing: "0.16em" }}>
            UPDATED {new Date(project.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}
          </span>
          <span style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
            color: cc, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            View Case <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* -------------------------------------------------- */
/* All-works mini row                                  */
/* -------------------------------------------------- */
function MiniRow({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  const cc = CAT_COLOR[project.category];
  const cl = CAT_LABEL[project.category];
  const st = STATUS[project.status];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: cc })); }}
      onMouseLeave={() => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); }}
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr auto auto",
        alignItems: "center",
        gap: 20,
        width: "100%",
        textAlign: "left",
        background: hov ? "rgba(13,13,13,0.025)" : "transparent",
        border: "none",
        borderTop: `1px solid ${BORDER_SOFT}`,
        padding: "18px 4px",
        cursor: "pointer",
        transition: "background .15s ease",
      }}
    >
      <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 18, color: INK_LOW, fontWeight: 400 }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: INSTRUMENT,
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: "-0.015em",
          color: hov ? cc : INK,
          transition: "color .15s ease",
          lineHeight: 1.15,
        }}>
          {project.name}
        </span>
        {project.client && (
          <span style={{ fontFamily: SANS, fontSize: 11, color: INK_LOW }}>for {project.client}</span>
        )}
        {isNew(project.updatedAt) && (
          <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: ACCENT.orange }}>NEW</span>
        )}
        <WorkTypeBadge project={project} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: cc, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {cl}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 10, color: st.color }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot }} />
          {st.label}
        </span>
      </div>

      <ArrowUpRight size={14} color={cc} style={{ opacity: hov ? 0.9 : 0.3, transition: "opacity .15s ease", flexShrink: 0 }} />
    </button>
  );
}

/* -------------------------------------------------- */
/* Section                                             */
/* -------------------------------------------------- */
export function Works({
  projects,
  onSelectProject,
}: {
  projects: Project[];
  /** kept for backwards compat — currently unused (sort is fixed to updatedAt desc) */
  sort?: SortKey;
  setSort?: (s: SortKey) => void;
  onSelectProject: (p: Project) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activeWorkType, setActiveWorkType] = useState<WorkType | "all">("all");

  const workTypeCounts = useMemo(() => {
    const result: Record<WorkType | "all", number> = { all: projects.length, client: 0, own: 0, "ai-concept": 0 };
    projects.forEach((project) => { result[resolveWorkType(project)] += 1; });
    return result;
  }, [projects]);

  const workTypeFiltered = useMemo(
    () => activeWorkType === "all" ? projects : projects.filter((project) => resolveWorkType(project) === activeWorkType),
    [projects, activeWorkType]
  );

  const counts = useMemo(() => {
    const m: Record<Category, number> = { all: workTypeFiltered.length, website: 0, external: 0, internal: 0, analytics: 0, onboarding: 0, ai_agent: 0 };
    workTypeFiltered.forEach(p => { m[p.category] = (m[p.category] || 0) + 1; });
    return m;
  }, [workTypeFiltered]);

  const sortedAll = useMemo(
    () => [...workTypeFiltered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [workTypeFiltered]
  );

  const filtered = useMemo(
    () => activeCategory === "all" ? sortedAll : sortedAll.filter(p => p.category === activeCategory),
    [sortedAll, activeCategory]
  );

  const featured = useMemo(
    () => filtered.filter(p => p.featured).slice(0, 8),
    [filtered]
  );

  // If filtering by category and there are no featured, fall back to first 6 of filtered
  const featuredOrFallback = featured.length > 0 ? featured : filtered.slice(0, Math.min(6, filtered.length));
  const featuredIds = new Set(featuredOrFallback.map(p => p.id));
  const rest = filtered.filter(p => !featuredIds.has(p.id));

  return (
    <section
      id="works"
      style={{
        background: PAPER,
        borderTop: `1px solid ${BORDER_SOFT}`,
        borderBottom: `1px solid ${BORDER_SOFT}`,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(80px, 10vw, 120px) clamp(20px, 5vw, 56px)" }}>
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 22, color: ACCENT.vermillion, lineHeight: 1, fontWeight: 400 }}>
            v.3
          </span>
          <span style={{ width: 28, height: 1, background: ACCENT.vermillion }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: ACCENT.vermillion,
              textTransform: "uppercase",
            }}
          >
            Section · Selected Works
          </span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap", marginBottom: 24 }}>
          <motion.h2
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontFamily: INSTRUMENT,
              fontSize: "clamp(56px, 9vw, 144px)",
              fontWeight: 400,
              lineHeight: 0.92,
              color: INK,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Selected <em style={{ fontStyle: "italic" }}>Works.</em>
          </motion.h2>

          <p
            style={{
              fontFamily: FRANK,
              fontSize: 17,
              fontStyle: "italic",
              fontWeight: 300,
              color: INK_MID,
              lineHeight: 1.65,
              maxWidth: 420,
              margin: "0 0 12px",
            }}
          >
            山中秀斗が手がけたプロダクト群。<br />
            毎週更新、生きている案件だけを掲載しています。
          </p>
        </div>

        {/* Top hairline */}
        <div style={{ height: 1, background: BORDER, marginBottom: 36 }} />

        {/* Work type — 実案件とAIコンセプトを混在させない */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {(["all", "client", "own", "ai-concept"] as const).map((type) => {
            const meta = WORK_TYPE_META[type];
            const isActive = activeWorkType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  setActiveWorkType(type);
                  setActiveCategory("all");
                }}
                aria-pressed={isActive}
                style={{
                  textAlign: "left",
                  padding: "18px 18px 16px",
                  background: isActive ? "#FFFFFF" : "transparent",
                  borderStyle: "solid",
                  borderWidth: "3px 1px 1px",
                  borderColor: `${meta.color} ${isActive ? meta.color : BORDER} ${isActive ? meta.color : BORDER}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  boxShadow: isActive ? "0 8px 24px rgba(13,13,13,0.06)" : "none",
                  transition: "background .15s ease, border-color .15s ease, box-shadow .15s ease",
                }}
              >
                <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontFamily: INSTRUMENT, fontSize: 22, color: INK }}>{meta.label}</span>
                  <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 20, color: meta.color }}>{workTypeCounts[type]}</span>
                </span>
                <span style={{ display: "block", marginTop: 8, fontFamily: SANS, fontSize: 10, lineHeight: 1.5, color: INK_LOW, letterSpacing: "0.04em" }}>
                  {meta.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.18em", color: INK_LOW, textTransform: "uppercase", marginRight: 10 }}>
            Filter
          </span>
          {ALL_CATS.map(cat => {
            const isActive = activeCategory === cat;
            const color = cat === "all" ? INK : CAT_COLOR[cat as Exclude<Category, "all">];
            const label = cat === "all" ? "All" : CAT_LABEL[cat as Exclude<Category, "all">];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: isActive ? "#FFF" : INK_MID,
                  background: isActive ? color : "transparent",
                  border: `1px solid ${isActive ? color : BORDER}`,
                  borderRadius: 100,
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all .15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {label}
                <span style={{ opacity: isActive ? 0.75 : 0.45, fontSize: 10 }}>
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured grid */}
        {featuredOrFallback.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 24,
                gap: 16,
              }}
            >
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: INK_LOW, textTransform: "uppercase" }}>
                Featured · {featuredOrFallback.length} pieces
              </span>
              <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 14, color: INK_LOW }}>
                hand-picked
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 540px), 1fr))",
                gap: 24,
                marginBottom: 96,
              }}
            >
              {featuredOrFallback.map((p, i) => (
                <FeaturedRow key={p.id} project={p} index={i} onSelect={() => onSelectProject(p)} />
              ))}
            </div>
          </>
        )}

        {/* All works index */}
        {rest.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 4,
              }}
            >
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", color: INK, textTransform: "uppercase" }}>
                All Works · {rest.length} items
              </span>
              <span style={{ fontFamily: SANS, fontSize: 10, color: INK_LOW, letterSpacing: "0.14em" }}>
                Sorted by recently updated
              </span>
            </div>

            <div style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
              {rest.map((p, i) => (
                <MiniRow key={p.id} project={p} index={i} onSelect={() => onSelectProject(p)} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div
            style={{
              padding: "120px 0",
              textAlign: "center",
              fontFamily: INSTRUMENT,
              fontStyle: "italic",
              fontSize: 32,
              color: INK_LOW,
            }}
          >
            No works in this category yet.
          </div>
        )}

        {/* Footnote */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: `1px solid ${BORDER_SOFT}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.18em", color: INK_LOW, textTransform: "uppercase" }}>
            Index · {filtered.length} of {workTypeFiltered.length} in {WORK_TYPE_META[activeWorkType].label}
          </span>
          <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 14, color: INK_LOW }}>
            Press <kbd style={{ fontFamily: SANS, fontSize: 10, padding: "2px 6px", border: `1px solid ${BORDER}`, borderRadius: 4, background: "#fff", color: INK_MID, letterSpacing: 0 }}>⌘K</kbd> to search
          </span>
        </div>
      </div>
    </section>
  );
}
