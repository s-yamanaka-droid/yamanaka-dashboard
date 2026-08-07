"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search, X, Command } from "lucide-react";
import { Project, Category } from "@/types";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  website: "#2C5268", external: "#315A4E", internal: "#5B5871",
  analytics: "#A14C3B", onboarding: "#806126", ai_agent: "#7C445E",
};
const CAT_LABEL: Record<Exclude<Category, "all">, string> = {
  website: "Website", external: "External", internal: "Internal",
  analytics: "Analytics", onboarding: "Onboarding", ai_agent: "AI Agent",
};
const STATUS = {
  live:     { label: "Live",  dot: "#315A4E" },
  dev:      { label: "Dev",   dot: "#A14C3B" },
  archived: { label: "Arch",  dot: "#A8B4AE" },
};

export function CommandSearch({
  projects,
  onSelect,
  onClose,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? projects.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          (p.client && p.client.toLowerCase().includes(q)) ||
          CAT_LABEL[p.category].toLowerCase().includes(q)
        )
      : [...projects].sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    return list.slice(0, 8);
  }, [query, projects]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); return; }
      if (e.key === "Enter" && results[cursor]) { onSelect(results[cursor]); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, cursor, onSelect, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(19,33,38,0.72)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          zIndex: 11000,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: "15vh",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "min(620px, 92vw)",
            background: "#F8F9F6",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(19,33,38,0.28), 0 0 0 1px rgba(19,33,38,0.06)",
          }}
        >
          {/* Search input */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid rgba(19,33,38,0.08)",
          }}>
            <Search size={16} color="#6E7A7C"/>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search public works, tags, clients..."
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              style={{
                flex: 1, fontFamily: FRANK, fontSize: 17, fontWeight: 300,
                border: "none", background: "none", outline: "none",
                color: "#132126",
              }}
            />
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
            >
              <X size={14} color="#6E7A7C"/>
            </button>
          </div>

          {/* Results */}
          <div style={{ maxHeight: "52vh", overflowY: "auto" }}>
            {results.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", fontFamily: FRANK, fontSize: 18, fontWeight: 300, color: "#C0BDB5" }}>
                No results for “{query}”
              </div>
            ) : (
              <>
                <div style={{ padding: "8px 20px 4px", fontFamily: SANS, fontSize: 9, letterSpacing: "0.14em", color: "#6E7A7C" }}>
                  {query ? `${results.length} RESULTS` : "RECENTLY UPDATED"}
                </div>
                {results.map((p, i) => {
                  const catColor = CAT_COLOR[p.category];
                  const isActive = i === cursor;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelect(p)}
                      onMouseEnter={() => setCursor(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "11px 20px",
                        background: isActive ? "rgba(19,33,38,0.04)" : "transparent",
                        cursor: "pointer",
                        transition: "background 0.1s",
                        borderLeft: isActive ? `3px solid ${catColor}` : "3px solid transparent",
                      }}
                    >
                      {/* Category color dot */}
                      <div style={{ width: 3, height: 36, background: catColor, borderRadius: 2, flexShrink: 0 }}/>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: "#132126" }}>
                            {p.name}
                          </span>
                          {p.client && (
                            <span style={{ fontFamily: SANS, fontSize: 11, color: "#6E7A7C" }}>for {p.client}</span>
                          )}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 11, color: "#6E7A7C", display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ color: catColor, fontWeight: 600, fontSize: 10 }}>
                            {CAT_LABEL[p.category]}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: STATUS[p.status].dot, display: "inline-block" }}/>
                            {STATUS[p.status].label}
                          </span>
                          <span>{p.tags.slice(0, 2).join(" · ")}</span>
                        </div>
                      </div>

                      {/* Open link */}
                      {p.url && (
                        <a
                          href={p.url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ color: catColor, opacity: 0.5, display: "flex", flexShrink: 0 }}
                        >
                          <ArrowUpRight size={14}/>
                        </a>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <span style={{ fontFamily: SANS, fontSize: 10, color: "#6E7A7C", flexShrink: 0, background: "rgba(19,33,38,0.06)", padding: "3px 7px", borderRadius: 4 }}>
                          ↵
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "10px 20px",
            borderTop: "1px solid rgba(19,33,38,0.07)",
            background: "rgba(19,33,38,0.02)",
          }}>
            {[["↑↓", "navigate"], ["↵", "open detail"], ["Esc", "close"]].map(([key, label]) => (
              <span key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 10, color: "#6E7A7C" }}>
                <kbd style={{ fontFamily: SANS, fontSize: 9, background: "rgba(19,33,38,0.07)", padding: "2px 5px", borderRadius: 3 }}>
                  {key}
                </kbd>
                {label}
              </span>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
              <Command size={10} color="#C0BDB5"/>
              <span style={{ fontFamily: SANS, fontSize: 10, color: "#C0BDB5" }}>K</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
