"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring, useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, List, GitBranch, Command, LayoutGrid } from "lucide-react";
import HeroCanvas from "@/components/HeroCanvas";
import { ProjectModal } from "@/components/ProjectModal";
import { CommandSearch } from "@/components/CommandSearch";
import projectsData from "@/data/projects.json";
import { Category, Project } from "@/types";

const projects = projectsData as Project[];
type SortKey = "updatedAt" | "createdAt" | "name";
type ViewMode = "list" | "timeline" | "cards";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

const CAT_LABEL: Record<Exclude<Category, "all">, string> = {
  website: "Website", external: "External", internal: "Internal",
  analytics: "Analytics", onboarding: "Onboarding", ai_agent: "AI Agent",
};
const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  website: "#1C3BCC", external: "#3A8C5C", internal: "#7C3AED",
  analytics: "#E8694A", onboarding: "#B07D00", ai_agent: "#D4317A",
};
const STATUS = {
  live:     { label: "Live",     color: "#3A8C5C", dot: "#3A8C5C" },
  dev:      { label: "In Dev",   color: "#B07D00", dot: "#F4541A" },
  archived: { label: "Archived", color: "#B0ADA6", dot: "#D0CCC4" },
};
const ALL_CATS: Category[] = ["all", "website", "external", "internal", "analytics", "onboarding", "ai_agent"];
const EASE = [0.22, 1, 0.36, 1] as const;
const NEW_MS = 7 * 24 * 60 * 60 * 1000;
const isNew = (d: string) => Date.now() - new Date(d).getTime() < NEW_MS;

/* ─── CURSOR ───────────────────────────────────────────── */
function CursorFollower() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const m    = useRef({ x: -200, y: -200 });
  const r    = useRef({ x: -200, y: -200 });
  const col  = useRef("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      m.current = { x: e.clientX, y: e.clientY };
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    };
    const color = (e: Event) => { col.current = (e as CustomEvent<string>).detail; };
    window.addEventListener("mousemove", move);
    window.addEventListener("cursor-color", color);
    let raf: number;
    const tick = () => {
      r.current.x += (m.current.x - r.current.x) * 0.09;
      r.current.y += (m.current.y - r.current.y) * 0.09;
      if (ring.current) {
        ring.current.style.transform = `translate(${r.current.x - 22}px,${r.current.y - 22}px)`;
        ring.current.style.borderColor = col.current || "rgba(13,13,13,0.32)";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("cursor-color", color);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,width:8,height:8,background:"#0D0D0D",borderRadius:"50%",pointerEvents:"none",zIndex:9999,willChange:"transform" }}/>
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:44,height:44,border:"1.5px solid rgba(13,13,13,0.32)",borderRadius:"50%",pointerEvents:"none",zIndex:9998,willChange:"transform",transition:"border-color 0.3s" }}/>
    </>
  );
}

/* ─── SCROLL PROGRESS ──────────────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return <motion.div style={{ position:"fixed",top:0,left:0,right:0,height:2,background:"#0D0D0D",transformOrigin:"0%",scaleX,zIndex:9997 }}/>;
}

/* ─── SPLIT TEXT ───────────────────────────────────────── */
function SplitText({ text, style, delay = 0 }: { text: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <span style={{ display:"block", overflow:"hidden", ...style }}>
      {text.split("").map((ch, i) => (
        <motion.span key={i} style={{ display:"inline-block" }}
          initial={{ y:"110%" }} animate={{ y:"0%" }}
          transition={{ delay: delay + i * 0.022, duration:0.65, ease:EASE }}>
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── COUNT UP ─────────────────────────────────────────── */
function CountUp({ target, start }: { target: number; start: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = Date.now(), dur = 1400;
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target]);
  return <>{n}</>;
}

/* ─── TYPEWRITER CYCLE ─────────────────────────────────── */
function TypewriterCycle({ words, style }: { words: string[]; style?: React.CSSProperties }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setVisible(true); }, 380);
    }, 2400);
    return () => clearInterval(id);
  }, [words]);
  return (
    <span style={{ display:"inline-block", overflow:"hidden", ...style }}>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.span key={idx} style={{ display:"block" }}
            initial={{ y:"100%" }} animate={{ y:"0%" }} exit={{ y:"-100%" }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}>
            {words[idx]}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─── COLORED MARQUEE ──────────────────────────────────── */
interface MarqueeItem { text: string; color?: string; dot?: string; }

function Marquee2({
  items, bg = "#0D0D0D", speed = "normal", reverse = false,
}: {
  items: MarqueeItem[]; bg?: string; speed?: "fast"|"normal"|"slow"; reverse?: boolean;
}) {
  const quad = [...items, ...items, ...items, ...items];
  const cls = reverse ? "marquee-track-rev"
    : speed === "fast" ? "marquee-track-fast"
    : speed === "slow" ? "marquee-track-slow"
    : "marquee-track";
  const defaultColor = bg === "#0D0D0D" ? "#F4541A" : "#0D0D0D";
  return (
    <div style={{ overflow:"hidden", background:bg, padding:"12px 0" }}>
      <div className={cls}>
        {quad.map((item, i) => (
          <span key={i} style={{
            fontFamily:FRANK, fontSize:13, fontWeight:300,
            color: item.color || defaultColor,
            paddingRight:48, whiteSpace:"nowrap", letterSpacing:"0.06em",
            display:"inline-flex", alignItems:"center", gap:6,
          }}>
            {item.dot && (
              <span style={{ width:5, height:5, borderRadius:"50%", background:item.dot, display:"inline-block", flexShrink:0 }}/>
            )}
            {item.text}
            <span style={{ opacity:0.25, paddingLeft:48 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO FLOATING BUBBLE ─────────────────────────────── */
function HeroBubble({
  label, sub, accent, x, y, delay, floatDur, onClick,
}: {
  label: string; sub: string; accent: string;
  x: string; y: string; delay: number; floatDur: number;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      style={{ position:"absolute", left:x, top:y, zIndex:2 }}
      animate={{ y: [0, -10, 2, -6, 0] }}
      transition={{ duration:floatDur, repeat:Infinity, ease:"easeInOut", delay }}
    >
      <motion.button
        onMouseEnter={() => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: accent })); }}
        onMouseLeave={() => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); }}
        onClick={onClick}
        animate={{ scale: hov ? 1.06 : 1 }}
        transition={{ duration:0.2 }}
        style={{
          background: hov ? accent : "rgba(13,13,13,0.72)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          border:`1px solid ${hov ? accent : "rgba(255,255,255,0.12)"}`,
          borderRadius:12, padding:"12px 18px",
          cursor:"pointer", textAlign:"left",
          boxShadow: hov ? `0 8px 24px ${accent}55` : "0 4px 16px rgba(0,0,0,0.3)",
          transition:"background 0.2s, border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div style={{ fontFamily:FRANK, fontSize:"clamp(18px,2.5vw,28px)", fontWeight:400, color:"#F7F4EE", lineHeight:1 }}>{label}</div>
        <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.14em", color: hov ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.4)", marginTop:4 }}>{sub}</div>
      </motion.button>
    </motion.div>
  );
}

/* ─── FEATURED CARD ────────────────────────────────────── */
function FeaturedCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  const catColor = CAT_COLOR[project.category as Exclude<Category,"all">];
  const catLabel = CAT_LABEL[project.category as Exclude<Category,"all">];
  const st = STATUS[project.status];
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onMouseEnter={() => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: catColor })); }}
      onMouseLeave={() => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); }}
      onClick={onSelect}
      style={{
        background:"#FFFFFF",
        border:`1px solid ${hov ? catColor : "#E8E3D8"}`,
        borderRadius:16, padding:"28px 28px 24px",
        cursor:"pointer", position:"relative", overflow:"hidden",
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${catColor}` : "0 2px 8px rgba(0,0,0,0.05)",
        transition:"border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:catColor }}/>
      {/* Faint large letter watermark */}
      <div style={{
        position:"absolute", right:16, bottom:-8,
        fontFamily:FRANK, fontSize:80, fontWeight:900, lineHeight:1,
        color:catColor, opacity:0.05, pointerEvents:"none", userSelect:"none",
      }}>{catLabel[0]}</div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:catColor, background:`${catColor}15`, padding:"3px 9px", borderRadius:100 }}>
          {catLabel.toUpperCase()}
        </span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {isNew(project.updatedAt) && (
            <span style={{ fontFamily:SANS, fontSize:9, fontWeight:700, color:"#F4541A", background:"#F4541A18", padding:"2px 7px", borderRadius:100 }}>NEW</span>
          )}
          <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:SANS, fontSize:10, color:st.color }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>
            {st.label}
          </span>
        </div>
      </div>

      <h3 style={{ fontFamily:FRANK, fontSize:"clamp(22px,3vw,36px)", fontWeight:400, lineHeight:1.05, letterSpacing:"-0.01em", color:"#0D0D0D", margin:"0 0 10px" }}>
        {project.name}
      </h3>
      {project.client && (
        <p style={{ fontFamily:SANS, fontSize:11, color:"#B0ADA6", margin:"0 0 12px" }}>for {project.client}</p>
      )}
      <p style={{
        fontFamily:SANS, fontSize:12, color:"#6B6860", lineHeight:1.55, margin:"0 0 20px",
        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
      }}>{project.description}</p>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:5 }}>
          {project.tags.slice(0,2).map(t => (
            <span key={t} style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", border:"1px solid #E8E3D8", borderRadius:4, padding:"1px 6px" }}>{t}</span>
          ))}
        </div>
        <ArrowUpRight size={15} color={catColor} style={{ opacity: hov ? 1 : 0.35, transition:"opacity 0.15s" }}/>
      </div>
    </motion.div>
  );
}

/* ─── STACK MAP ─────────────────────────────────────────── */
function StackMap({ projects, onTagClick }: { projects: Project[]; onTagClick: (t: string) => void }) {
  const counts: Record<string,number> = {};
  projects.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t]||0)+1; }));
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:7, alignItems:"center" }}>
      {sorted.map(([tag, count]) => {
        const scale = count / max;
        return (
          <motion.button
            key={tag}
            whileHover={{ scale:1.05 }}
            onClick={() => onTagClick(tag)}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-color", { detail: "#0D0D0D" }))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" }))}
            style={{
              fontFamily:SANS,
              fontSize: 9 + scale * 5,
              fontWeight: count >= 3 ? 700 : 400,
              color:"#0D0D0D",
              background: `rgba(13,13,13,${0.04 + scale * 0.07})`,
              border:"1px solid rgba(13,13,13,0.1)",
              borderRadius:8, padding:`${4 + scale * 2}px ${8 + scale * 4}px`,
              cursor:"pointer",
            }}
          >
            {tag}
            <span style={{ opacity:0.35, marginLeft:4, fontSize:"0.85em" }}>×{count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── MINI BAR CHART ────────────────────────────────────── */
function MiniBarChart({ counts, total }: { counts: Record<Exclude<Category,"all">,number>; total: number }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {(Object.entries(CAT_LABEL) as [Exclude<Category,"all">, string][]).map(([cat, label]) => (
        <div key={cat} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", width:72, textAlign:"right", flexShrink:0 }}>{label}</span>
          <div style={{ width:140, height:3, background:"#E8E3D8", borderRadius:2, overflow:"hidden" }}>
            <motion.div
              initial={{ width:0 }}
              whileInView={{ width:`${(counts[cat]/total)*100}%` }}
              viewport={{ once:true }}
              transition={{ duration:0.9, delay:0.15, ease:[0.22,1,0.36,1] }}
              style={{ height:"100%", background:CAT_COLOR[cat], borderRadius:2 }}
            />
          </div>
          <span style={{ fontFamily:SANS, fontSize:10, color:"#6B6860" }}>{counts[cat]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── WORKS LEGEND ──────────────────────────────────────── */
function WorksLegend() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, padding:"10px 0 14px", flexWrap:"wrap", borderBottom:"1px solid rgba(13,13,13,0.05)" }}>
      <span style={{ fontFamily:SANS, fontSize:8, letterSpacing:"0.16em", color:"#C0BDB5", marginRight:4 }}>COLOR = TYPE:</span>
      {(Object.entries(CAT_LABEL) as [Exclude<Category,"all">,string][]).map(([cat, label]) => (
        <span key={cat} style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:3, height:12, background:CAT_COLOR[cat], borderRadius:1 }}/>
          <span style={{ fontFamily:SANS, fontSize:9, color:"#B0ADA6" }}>{label}</span>
        </span>
      ))}
      <span style={{ width:1, height:12, background:"#E0DBD2", margin:"0 4px" }}/>
      {[["#3A8C5C","Live"],["#F4541A","In Dev"],["#D0CCC4","Archived"]].map(([c,l]) => (
        <span key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:c, display:"inline-block" }}/>
          <span style={{ fontFamily:SANS, fontSize:9, color:"#B0ADA6" }}>{l}</span>
        </span>
      ))}
      <span style={{ fontFamily:SANS, fontSize:9, color:"#F4541A", background:"#F4541A15", padding:"1px 7px", borderRadius:100 }}>NEW</span>
      <span style={{ fontFamily:SANS, fontSize:9, color:"#B0ADA6" }}>= updated within 7 days</span>
    </div>
  );
}

/* ─── WORK ITEM ─────────────────────────────────────────── */
function WorkItem({ project, index, onSelect }: { project: Project; index: number; onSelect: () => void }) {
  const [hov, setHov] = useState(false);
  const catColor = CAT_COLOR[project.category as Exclude<Category,"all">] || "#0D0D0D";
  const catLabel = CAT_LABEL[project.category as Exclude<Category,"all">] || project.category;
  const st = STATUS[project.status];
  const _isNew = isNew(project.updatedAt);

  const enter = () => { setHov(true); window.dispatchEvent(new CustomEvent("cursor-color", { detail: catColor })); };
  const leave = () => { setHov(false); window.dispatchEvent(new CustomEvent("cursor-color", { detail: "" })); };

  return (
    <div>
      <div style={{ height:1, background:"#0D0D0D", opacity:0.07 }}/>
      <div role="button" tabIndex={0}
        onMouseEnter={enter} onMouseLeave={leave}
        onClick={onSelect} onKeyDown={e => e.key==="Enter" && onSelect()}
        style={{
          display:"grid", gridTemplateColumns:"52px 4px 1fr auto",
          alignItems:"center", gap:24, padding:"20px 0",
          background: hov ? "rgba(13,13,13,0.025)" : "transparent",
          transition:"background 0.15s", borderRadius:4, cursor:"pointer",
        }}
      >
        <span style={{ fontFamily:FRANK, fontSize:13, fontWeight:300, color:"#C0BDB5", textAlign:"right" }}>
          ({String(index + 1).padStart(2,"0")})
        </span>
        <div style={{ width:4, height: hov ? 56 : 48, background:catColor, borderRadius:2, transition:"height 0.2s" }}/>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4, flexWrap:"wrap" }}>
            <span style={{
              fontFamily:SANS, fontSize:"clamp(16px,2.2vw,30px)", fontWeight:700,
              color: hov ? catColor : "#0D0D0D",
              lineHeight:1.1, letterSpacing:"-0.02em", transition:"color 0.15s",
            }}>{project.name}</span>
            {project.client && <span style={{ fontFamily:SANS, fontSize:12, color:"#B0ADA6" }}>for {project.client}</span>}
            {_isNew && (
              <span style={{ fontFamily:SANS, fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"#F7F4EE", background:"#F4541A", padding:"2px 7px", borderRadius:100 }}>NEW</span>
            )}
          </div>

          {/* Hover: description */}
          <AnimatePresence>
            {hov && (
              <motion.p
                initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                transition={{ duration:0.2, ease:"easeOut" }}
                style={{ fontFamily:SANS, fontSize:12, color:"#6B6860", lineHeight:1.5, margin:"0 0 5px", overflow:"hidden",
                  display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", maxWidth:540 }}
              >{project.description}</motion.p>
            )}
          </AnimatePresence>

          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, color:catColor, letterSpacing:"0.09em" }}>{catLabel.toUpperCase()}</span>
            <span style={{ display:"flex", alignItems:"center", gap:5, fontFamily:SANS, fontSize:10, color:st.color }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>
              {st.label}
            </span>
            <span style={{ fontFamily:SANS, fontSize:10, color:"#C0BDB5" }}>
              {new Date(project.updatedAt).toLocaleDateString("ja-JP", { year:"2-digit", month:"short", day:"numeric" })}
            </span>
            {project.tags.slice(0,2).map(tag => (
              <span key={tag} style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", border:"1px solid #E0DBD2", borderRadius:3, padding:"1px 6px" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", alignItems:"center", color:catColor, opacity: hov ? 0.9 : 0.25, transition:"opacity 0.15s" }}>
              <ArrowUpRight size={14}/>
            </a>
          )}
          <span style={{ fontFamily:FRANK, fontSize:13, fontWeight:300, color:catColor, opacity: hov ? 0.85 : 0.25, transition:"opacity 0.15s" }}>
            {project.url ? "View" : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── TIMELINE VIEW ─────────────────────────────────────── */
function TimelineView({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  type Group = { key: string; label: string; list: Project[] };
  const groups: Group[] = [];
  for (const p of [...projects].sort((a,b) => new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())) {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label = d.toLocaleDateString("ja-JP", { year:"numeric", month:"long" });
    let g = groups.find(g => g.key===key);
    if (!g) { g = { key, label, list:[] }; groups.push(g); }
    g.list.push(p);
  }
  return (
    <div style={{ padding:"32px 56px 80px" }}>
      {groups.map((g, gi) => (
        <motion.div key={g.key}
          initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.1 }}
          transition={{ delay:gi*0.05, duration:0.45, ease:"easeOut" }}
          style={{ display:"flex", gap:0, marginBottom:0 }}
        >
          <div style={{ width:110, flexShrink:0, paddingTop:16, position:"relative" }}>
            <span style={{ fontFamily:SANS, fontSize:9, color:"#B0ADA6", letterSpacing:"0.06em" }}>{g.label}</span>
            <div style={{ position:"absolute", left:102, top:0, bottom:0, width:1, background:"#E0DBD2" }}/>
            <div style={{ position:"absolute", left:98, top:20, width:9, height:9, borderRadius:"50%", background:"#F4541A", border:"2px solid #F7F4EE" }}/>
          </div>
          <div style={{ flex:1, paddingLeft:28, paddingBottom:36 }}>
            {g.list.map(p => {
              const cc = CAT_COLOR[p.category as Exclude<Category,"all">];
              const st = STATUS[p.status];
              return (
                <motion.button key={p.id} onClick={() => onSelect(p)} whileHover={{ x:5 }}
                  onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:cc}))}
                  onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:""}))}
                  style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(13,13,13,0.03)", borderRadius:8, padding:"12px 16px", border:"none", cursor:"pointer", textAlign:"left", width:"100%", marginBottom:6 }}
                >
                  <div style={{ width:3, height:28, background:cc, borderRadius:2, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:SANS, fontSize:13, fontWeight:700, color:"#0D0D0D" }}>{p.name}</span>
                      {isNew(p.updatedAt) && <span style={{ fontFamily:SANS, fontSize:8, fontWeight:700, color:"#F4541A", background:"#F4541A18", padding:"1px 6px", borderRadius:100 }}>NEW</span>}
                    </div>
                    <div style={{ display:"flex", gap:8, fontFamily:SANS, fontSize:10 }}>
                      <span style={{ color:cc, fontWeight:600 }}>{CAT_LABEL[p.category as Exclude<Category,"all">]}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:3, color:st.color }}>
                        <span style={{ width:4, height:4, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>{st.label}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={13} color={cc} style={{ opacity:0.35, flexShrink:0 }}/>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── PORTAL CARD ───────────────────────────────────────── */
function PortalCard({ p, i }: { p: { label:string; sub:string; desc:string; url:string; accent:string }; i:number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a href={p.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.3 }}
      transition={{ delay:i*0.12, duration:0.65, ease:EASE }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"block", padding:"56px 56px 48px", borderLeft: i>0 ? "1px solid rgba(255,255,255,0.08)" : "none", borderTop:"1px solid rgba(255,255,255,0.08)", textDecoration:"none", background: hov ? "rgba(255,255,255,0.04)" : "transparent", transition:"background 0.2s" }}
    >
      <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.18em", color:"rgba(255,255,255,0.28)", marginBottom:16 }}>{p.sub}</div>
      <div style={{ fontFamily:FRANK, fontSize:"clamp(48px,7vw,96px)", fontWeight:400, color:p.accent, lineHeight:0.9, marginBottom:20, letterSpacing:"-0.02em", opacity: hov ? 0.85 : 1, transition:"opacity 0.15s" }}>{p.label}</div>
      <p style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.6, margin:"0 0 24px" }}>{p.desc}</p>
      <div style={{ display:"flex", alignItems:"center", gap:4, fontFamily:FRANK, fontSize:14, color:p.accent, opacity: hov ? 1 : 0.45, transition:"opacity 0.2s" }}>
        Open <ArrowUpRight size={14}/>
      </div>
    </motion.a>
  );
}

/* ─── CARDS VIEW ───────────────────────────────────────── */
function CardsView({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  return (
    <div style={{ padding:"32px 56px 80px" }}>
      <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.14em", color:"#B0ADA6", marginBottom:20 }}>
        ALL {projects.length} PRODUCTS — click for details
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {projects.map((p, i) => {
          const cc = CAT_COLOR[p.category as Exclude<Category,"all">];
          const cl = CAT_LABEL[p.category as Exclude<Category,"all">];
          const st = STATUS[p.status];
          return (
            <motion.button key={p.id} onClick={() => onSelect(p)}
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.05 }}
              transition={{ delay:Math.min(i*0.02,0.3), duration:0.4, ease:"easeOut" }}
              whileHover={{ y:-3 }}
              onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:cc}))}
              onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:""}))}
              style={{
                background:"#FFFFFF", border:`1px solid #E8E3D8`,
                borderRadius:12, padding:"20px", cursor:"pointer", textAlign:"left",
                position:"relative", overflow:"hidden",
                boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                transition:"border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:cc, borderRadius:"12px 12px 0 0" }}/>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontFamily:SANS, fontSize:9, fontWeight:700, letterSpacing:"0.12em", color:cc, background:cc+"1A", padding:"3px 8px", borderRadius:100 }}>
                  {cl.toUpperCase()}
                </span>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:SANS, fontSize:10, color:st.color }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>
                  {st.label}
                </span>
              </div>
              <div style={{ fontFamily:SANS, fontSize:15, fontWeight:700, color:"#0D0D0D", lineHeight:1.2, marginBottom:8, letterSpacing:"-0.01em" }}>
                {p.name}
              </div>
              {p.client && (
                <div style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", marginBottom:6 }}>for {p.client}</div>
              )}
              <p style={{
                fontFamily:SANS, fontSize:11, color:"#6B6860", lineHeight:1.55, margin:"0 0 12px",
                display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
              }}>
                {p.description}
              </p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {p.tags.slice(0,3).map(tag => (
                  <span key={tag} style={{ fontFamily:SANS, fontSize:9, color:cc, border:`1px solid ${cc}40`, borderRadius:4, padding:"2px 7px" }}>
                    {tag}
                  </span>
                ))}
                {isNew(p.updatedAt) && (
                  <span style={{ fontFamily:SANS, fontSize:9, fontWeight:700, color:"#F7F4EE", background:"#F4541A", padding:"2px 7px", borderRadius:4 }}>NEW</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── HOME ──────────────────────────────────────────────── */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updatedAt");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [statsStarted, setStatsStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  /* Cmd+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Hero scroll */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start","end end"] });
  const heroX = useTransform(heroP, [0,1], ["0%","-66.67%"]);
  useMotionValueEvent(heroP, "change", v => { if (v > 0.6 && !statsStarted) setStatsStarted(true); });

  /* Counts */
  const counts = useMemo(() => {
    const m: Record<Category,number> = { all:projects.length, website:0, external:0, internal:0, analytics:0, onboarding:0, ai_agent:0 };
    projects.forEach(p => { m[p.category] = (m[p.category]||0)+1; });
    return m;
  }, []);

  /* All unique tags */
  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, []);

  /* Tag frequency for marquee row 2 */
  const tagCounts = useMemo(() => {
    const c: Record<string,number> = {};
    projects.forEach(p => p.tags.forEach(t => { c[t] = (c[t]||0)+1; }));
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,16);
  }, []);

  /* Filtered */
  const filtered = useMemo(() => {
    let r = projects;
    if (activeCategory !== "all") r = r.filter(p => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t=>t.toLowerCase().includes(q)) || (p.client&&p.client.toLowerCase().includes(q)));
    }
    if (activeTags.length > 0) r = r.filter(p => activeTags.some(t => p.tags.includes(t)));
    return [...r].sort((a,b) => {
      if (sort==="name") return a.name.localeCompare(b.name,"ja");
      return new Date(b[sort]||"").getTime()-new Date(a[sort]||"").getTime();
    });
  }, [activeCategory, query, sort, activeTags]);

  const toggleTag = useCallback((t: string) => {
    setActiveTags(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);
  }, []);

  const featured = useMemo(() => projects.filter(p => p.featured), []);
  const live    = projects.filter(p => p.status==="live").length;
  const cc      = projects.filter(p => p.builtWith==="claude_code").length;
  const newCount= projects.filter(p => isNew(p.updatedAt)).length;

  /* Marquee row 1: project names with category colors */
  const marqueeRow1: MarqueeItem[] = projects.map(p => ({
    text: p.name.toUpperCase(),
    color: CAT_COLOR[p.category as Exclude<Category,"all">],
    dot:   CAT_COLOR[p.category as Exclude<Category,"all">],
  }));

  /* Marquee row 2: tags × counts */
  const marqueeRow2: MarqueeItem[] = [
    ...tagCounts.map(([t,n]) => ({ text:`${t.toUpperCase()} ×${n}` })),
    { text:`${projects.length} PRODUCTS` },
    { text:`${live} LIVE` },
    { text:`${cc} CLAUDE CODE BUILT` },
    { text:`${newCount} UPDATED THIS WEEK` },
  ];

  const PORTALS = [
    { label:"Trepro", sub:"CORPORATE SITE",      desc:"株式会社トレプロ",              url:"https://tre-pro.co.jp",               accent:"#F4541A" },
    { label:"KANOA",  sub:"HR × AI PLATFORM",    desc:"プロダクトサイト",              url:"#",                                   accent:"#A8F5D8" },
    { label:"Vigil",  sub:"AGENT HQ · INTERNAL", desc:"眠らない右腕 — AI Harness",    url:"https://shoot-agent-v45.vercel.app", accent:"#FF4F00" },
    { label:"Braive", sub:"EDTECH × AI",          desc:"教育プラットフォーム",         url:"#",                                   accent:"#F5A8C8" },
  ];

  const MARQUEE_TOP: MarqueeItem[] = [
    { text:"YAMANAKA SHUTO" },{ text:"PRODUCT BUILDER" },{ text:"CLAUDE CODE NATIVE" },
    { text:"TREPRO CEO" },{ text:"(2022–2026)" },{ text:"AI BUILDER" },{ text:`${projects.length} PRODUCTS` },
  ];

  return (
    <div>
      <CursorFollower />
      <ScrollProgressBar />

      {/* ══ AGENT HQ TOPBAR ══════════════════════════════ */}
      <motion.a
        href="https://shoot-agent-v45.vercel.app"
        target="_blank" rel="noopener noreferrer"
        initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, duration:0.5 }}
        onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:"#FF4F00"}))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-color",{detail:""}))}
        style={{
          position:"fixed", top:0, left:0, right:0, zIndex:9995,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"#0A0A0A", padding:"8px 28px",
          textDecoration:"none", height:36,
          borderBottom:"1px solid rgba(255,79,0,0.25)",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <motion.span
            animate={{ opacity:[1,0.3,1] }}
            transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
            style={{ width:6, height:6, borderRadius:"50%", background:"#FF4F00", display:"inline-block", flexShrink:0 }}
          />
          <span style={{ fontFamily:SANS, fontSize:10, fontWeight:700, letterSpacing:"0.18em", color:"#FF4F00" }}>
            VIGIL — AGENT HQ
          </span>
          <span style={{ fontFamily:SANS, fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em" }}>
            眠らない右腕 · AI Orchestration Harness
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontFamily:SANS, fontSize:10, color:"rgba(255,255,255,0.45)", letterSpacing:"0.1em" }}>
          <span>OPEN</span>
          <ArrowUpRight size={11} color="#FF4F00"/>
        </div>
      </motion.a>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <div style={{ height:36 }}/>{/* topbar offset */}
      <div ref={heroRef} style={{ height:"300vh" }}>
        <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden", background:"#F4541A" }}>
          <HeroCanvas />
          <motion.div style={{ display:"flex", width:"300vw", height:"100%", translateX:heroX, position:"relative", zIndex:1 }}>

            {/* Panel 1: Intro + Floating Bubbles */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", padding:"28px 56px", position:"relative" }}>
              {/* Nav */}
              <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:SANS, fontSize:15, fontWeight:700, color:"#0D0D0D", letterSpacing:"0.05em" }}>YAMANAKA SHUTO</span>
                <div style={{ display:"flex", gap:28, alignItems:"center" }}>
                  {[["Works","#works"],["Portals","#portals"]].map(([l,h]) => (
                    <a key={l} href={h} style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:"#0D0D0D", textDecoration:"none", opacity:0.75 }}>{l}</a>
                  ))}
                  <a href="/evolution" style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:"#0D0D0D", textDecoration:"none", opacity:0.75 }}>Evolution</a>
                  <a href="https://tre-pro.co.jp" target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:"#0D0D0D", textDecoration:"none", display:"flex", alignItems:"center", gap:3, opacity:0.75 }}>
                    Trepro <ArrowUpRight size={11}/>
                  </a>
                  <button onClick={() => setCmdOpen(true)}
                    style={{ display:"flex", alignItems:"center", gap:5, fontFamily:SANS, fontSize:11, fontWeight:500, color:"#0D0D0D",
                      background:"rgba(13,13,13,0.12)", border:"1px solid rgba(13,13,13,0.18)", borderRadius:6,
                      padding:"5px 10px", cursor:"pointer", opacity:0.8 }}>
                    <Command size={11}/><span>K</span>
                  </button>
                </div>
              </nav>
              <div style={{ height:1, background:"#0D0D0D", opacity:0.2, margin:"20px 0" }}/>

              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[["AI","Builder"],["Claude Code","Native"],["Trepro","CEO"],["Product","Maker"],["since","2022"]].map(([a,b],i) => (
                    <motion.div key={a} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.3+i*0.08, duration:0.5 }}
                      style={{ fontFamily:SANS, fontSize:14, color:"#0D0D0D", opacity:0.65 }}>
                      +({a})-{b}
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity:0 }} animate={{ opacity:0.85 }} transition={{ delay:1, duration:0.8 }}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                  <span style={{ fontFamily:SANS, fontSize:11, fontWeight:600, letterSpacing:"0.22em", color:"#0D0D0D", writingMode:"vertical-rl" }}>(Scroll) — Down</span>
                  <motion.div animate={{ scaleY:[1,0.6,1] }} transition={{ duration:1.8, repeat:Infinity, ease:"easeInOut" }}
                    style={{ width:2, height:64, background:"#0D0D0D", transformOrigin:"top" }}/>
                </motion.div>
              </div>

              <div style={{ height:1, background:"#0D0D0D", opacity:0.2, margin:"0 0 16px" }}/>
              <div style={{ fontFamily:FRANK, fontSize:13, color:"#0D0D0D", opacity:0.38, paddingBottom:12 }}>2022 — {new Date().getFullYear()}</div>

              {/* ── Floating Bubbles ── */}
              <HeroBubble label={`${projects.length}`} sub="TOTAL WORKS" accent="#1C3BCC" x="54%" y="18%" delay={0} floatDur={5.5}
                onClick={() => document.getElementById("works")?.scrollIntoView({ behavior:"smooth" })} />
              <HeroBubble label={`${live}`} sub="LIVE NOW ●" accent="#3A8C5C" x="68%" y="38%" delay={0.8} floatDur={7}
                onClick={() => { document.getElementById("works")?.scrollIntoView({ behavior:"smooth" }); }} />
              <HeroBubble label={`×${cc}`} sub="CLAUDE CODE BUILT" accent="#7C3AED" x="52%" y="60%" delay={1.6} floatDur={6.2}
                onClick={() => document.getElementById("works")?.scrollIntoView({ behavior:"smooth" })} />
              <HeroBubble label={`+${newCount}`} sub="NEW THIS WEEK" accent="#F4541A" x="70%" y="68%" delay={0.4} floatDur={8}
                onClick={() => { setSort("updatedAt"); document.getElementById("works")?.scrollIntoView({ behavior:"smooth" }); }} />
            </div>

            {/* Panel 2: Giant Heading + Typewriter */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", position:"relative" }}>
              <div style={{ position:"absolute", top:"28%", left:56, right:56, height:1, background:"#0D0D0D", opacity:0.18 }}/>
              <div style={{ position:"absolute", bottom:"26%", left:56, right:56, height:1, background:"#0D0D0D", opacity:0.18 }}/>
              <div>
                <SplitText text="product+" delay={0} style={{ fontFamily:FRANK, fontSize:"clamp(72px,13vw,220px)", fontWeight:400, lineHeight:0.88, color:"transparent", WebkitTextStroke:"2px #0D0D0D", letterSpacing:"-0.02em", opacity:0.45 }}/>
                <SplitText text="builder"  delay={0.18} style={{ fontFamily:FRANK, fontSize:"clamp(72px,13vw,220px)", fontWeight:400, lineHeight:0.88, color:"#0D0D0D", letterSpacing:"-0.02em" }}/>
              </div>
              <div style={{ position:"absolute", bottom:"18%", left:56, right:56, display:"flex", alignItems:"center", gap:20 }}>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(20px,2.8vw,42px)", fontWeight:300, color:"#0D0D0D" }}>
                  (<TypewriterCycle words={["AI Builder","Claude Native","Product Maker","Trepro CEO","Since 2022"]} />)
                </span>
                <div style={{ flex:1, height:1, background:"#0D0D0D", opacity:0.18 }}/>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(20px,2.8vw,42px)", fontWeight:300, color:"#0D0D0D" }}>({new Date().getFullYear()})</span>
              </div>
            </div>

            {/* Panel 3: Stats */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px" }}>
              <div style={{ height:1, background:"#0D0D0D", opacity:0.18, marginBottom:48 }}/>
              <div style={{ display:"flex", gap:"6vw", alignItems:"flex-end", flexWrap:"wrap" }}>
                {[
                  { value:projects.length, label:"PRODUCTS" },
                  { value:live,            label:"LIVE" },
                  { value:cc,              label:"CLAUDE CODE" },
                  { value:newCount,        label:"NEW / 7 DAYS" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily:FRANK, fontSize:"clamp(52px,8vw,120px)", fontWeight:400, lineHeight:1, color:"#0D0D0D" }}>
                      <CountUp target={value} start={statsStarted}/>
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.2em", color:"#0D0D0D", opacity:0.4, marginTop:6 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ height:1, background:"#0D0D0D", opacity:0.18, margin:"48px 0 24px" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:FRANK, fontSize:13, color:"#0D0D0D", opacity:0.38 }}>(welcom@since_2022)</span>
                <motion.a href="#works" whileHover={{ x:4 }}
                  style={{ display:"flex", alignItems:"center", gap:8, fontFamily:FRANK, fontSize:20, fontWeight:300, color:"#0D0D0D", textDecoration:"none", opacity:0.7 }}>
                  ↓ works
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ MARQUEE DOUBLE ROW ═══════════════════════════ */}
      <Marquee2 items={MARQUEE_TOP} bg="#0D0D0D" speed="normal" />
      <Marquee2 items={marqueeRow1} bg="#0D0D0D" speed="slow" />

      {/* ══ WORKS ════════════════════════════════════════ */}
      <section id="works" style={{ background:"#F7F4EE" }}>
        <div style={{ padding:"72px 56px 0" }}>
          <div style={{ height:1, background:"#0D0D0D", opacity:0.1, marginBottom:48 }}/>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
            <motion.h2 initial={{ y:24 }} whileInView={{ y:0 }} viewport={{ once:true, amount:0.5 }}
              transition={{ duration:0.7, ease:EASE }}
              style={{ fontFamily:FRANK, fontSize:"clamp(80px,13vw,200px)", fontWeight:400, lineHeight:0.85, color:"#0D0D0D", letterSpacing:"-0.02em", margin:0 }}>
              works
            </motion.h2>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.3, duration:0.6 }} style={{ paddingBottom:12 }}>
              <MiniBarChart counts={counts as Record<Exclude<Category,"all">,number>} total={projects.length} />
            </motion.div>
          </div>
          <div style={{ height:1, background:"#0D0D0D", opacity:0.1, marginTop:40 }}/>
        </div>

        {/* Stack Map */}
        <div style={{ padding:"28px 56px 0" }}>
          <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.14em", color:"#B0ADA6", marginBottom:12 }}>TECH STACK — click to filter</div>
          <StackMap projects={projects} onTagClick={t => { toggleTag(t); document.getElementById("works-list")?.scrollIntoView({ behavior:"smooth", block:"start" }); }} />
        </div>

        {/* Category filter tabs + controls */}
        <div style={{ padding:"20px 56px 0", display:"flex", alignItems:"center", gap:0, overflowX:"auto", borderBottom:"1px solid rgba(13,13,13,0.07)", marginTop:20 }}>
          {ALL_CATS.map((cat, i) => {
            const isActive = activeCategory === cat;
            const color = cat==="all" ? "#0D0D0D" : CAT_COLOR[cat as Exclude<Category,"all">];
            const label = cat==="all" ? "All" : CAT_LABEL[cat as Exclude<Category,"all">];
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily:FRANK, fontSize:"clamp(13px,1.6vw,19px)",
                fontWeight: isActive ? 500 : 300,
                color: isActive ? color : "#C0BDB5",
                background:"none", border:"none",
                borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                cursor:"pointer", padding:"8px 13px",
                marginRight: i<ALL_CATS.length-1 ? 2 : 0,
                transition:"color 0.15s, border-color 0.15s",
                whiteSpace:"nowrap", letterSpacing:"-0.01em",
              }}>
                ({label}·{counts[cat]})
              </button>
            );
          })}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14, flexShrink:0, paddingLeft:20 }}>
            <input type="text" placeholder="search..." value={query} onChange={e => setQuery(e.target.value)}
              style={{ fontFamily:FRANK, fontSize:15, fontWeight:300, background:"none", border:"none", borderBottom:"1px solid rgba(13,13,13,0.18)", outline:"none", color:"#0D0D0D", padding:"4px 0", width:110 }} />
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
              style={{ fontFamily:SANS, fontSize:11, background:"none", border:"1px solid rgba(13,13,13,0.14)", borderRadius:6, outline:"none", color:"#6B6860", padding:"4px 8px" }}>
              <option value="updatedAt">Updated</option>
              <option value="createdAt">Created</option>
              <option value="name">Name</option>
            </select>
            <div style={{ display:"flex", gap:3, border:"1px solid rgba(13,13,13,0.12)", borderRadius:7, overflow:"hidden" }}>
              {([["list",<List size={12}/>],["timeline",<GitBranch size={12}/>],["cards",<LayoutGrid size={12}/>]] as [ViewMode, React.ReactNode][]).map(([mode,icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  style={{ width:30, height:26, display:"flex", alignItems:"center", justifyContent:"center", background: viewMode===mode ? "#0D0D0D" : "transparent", color: viewMode===mode ? "#F7F4EE" : "#B0ADA6", border:"none", cursor:"pointer", transition:"background 0.15s" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active tag pills */}
        {activeTags.length > 0 && (
          <div style={{ padding:"10px 56px 0", display:"flex", gap:6, flexWrap:"wrap" }}>
            {activeTags.map(t => (
              <button key={t} onClick={() => toggleTag(t)}
                style={{ fontFamily:SANS, fontSize:10, fontWeight:700, color:"#F7F4EE", background:"#0D0D0D", border:"none", borderRadius:100, padding:"3px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                {t} <X size={10}/>
              </button>
            ))}
            <button onClick={() => setActiveTags([])}
              style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", background:"none", border:"1px solid #E0DBD2", borderRadius:100, padding:"3px 10px", cursor:"pointer" }}>
              clear all
            </button>
          </div>
        )}

        {/* Works content */}
        <div id="works-list">
          {filtered.length === 0 ? (
            <div style={{ padding:"80px 0", textAlign:"center", fontFamily:FRANK, fontSize:32, fontWeight:300, color:"#C0BDB5" }}>No products found.</div>
          ) : viewMode === "list" ? (
            <div style={{ padding:"0 56px 80px" }}>
              {/* Legend */}
              <WorksLegend />

              {/* Featured row — only when browsing "all" with no filters */}
              {activeCategory === "all" && !query && activeTags.length === 0 && featured.length > 0 && (
                <div style={{ marginTop:24, marginBottom:32 }}>
                  <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.14em", color:"#B0ADA6", marginBottom:14 }}>★ FEATURED</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
                    {featured.map(p => (
                      <FeaturedCard key={p.id} project={p} onSelect={() => setSelectedProject(p)} />
                    ))}
                  </div>
                  <div style={{ height:1, background:"#0D0D0D", opacity:0.07, marginTop:28 }}/>
                  <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.12em", color:"#C0BDB5", marginTop:16 }}>ALL PRODUCTS</div>
                </div>
              )}

              {filtered.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, amount:0.05 }}
                  transition={{ delay:Math.min(i*0.025,0.25), duration:0.45, ease:"easeOut" }}>
                  <WorkItem project={p} index={i} onSelect={() => setSelectedProject(p)} />
                </motion.div>
              ))}
              <div style={{ height:1, background:"#0D0D0D", opacity:0.07 }}/>
              <p style={{ textAlign:"center", marginTop:20, fontFamily:FRANK, fontSize:13, fontWeight:300, color:"#B0ADA6" }}>
                {filtered.length} / {projects.length} products
              </p>
            </div>
          ) : viewMode === "timeline" ? (
            <TimelineView projects={filtered} onSelect={setSelectedProject} />
          ) : (
            <CardsView projects={filtered} onSelect={setSelectedProject} />
          )}
        </div>
      </section>

      {/* ══ MARQUEE DOUBLE ROW 2 ═════════════════════════ */}
      <Marquee2 items={marqueeRow2} bg="#0D0D0D" speed="slow" />
      <Marquee2 items={marqueeRow1} bg="#F4541A" speed="normal" reverse />

      {/* ══ PORTALS ══════════════════════════════════════ */}
      <section id="portals" style={{ background:"#0E1F5E" }}>
        <div style={{ padding:"72px 56px 0" }}>
          <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginBottom:48 }}/>
          <motion.h2 initial={{ y:24, opacity:0 }} whileInView={{ y:0, opacity:1 }}
            viewport={{ once:true, amount:0.5 }} transition={{ duration:0.7, ease:EASE }}
            style={{ fontFamily:FRANK, fontSize:"clamp(80px,13vw,200px)", fontWeight:400, lineHeight:0.85, color:"#F4541A", letterSpacing:"-0.02em", margin:0 }}>
            portals
          </motion.h2>
          <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginTop:48 }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))" }}>
          {PORTALS.map((p,i) => <PortalCard key={p.label} p={p} i={i}/>)}
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════ */}
      <footer id="contact" style={{ background:"#F4541A", padding:"28px 56px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(13,13,13,0.1)" }}>
        <span style={{ fontFamily:FRANK, fontSize:15, color:"#0D0D0D" }}>YAMANAKA SHUTO — {new Date().getFullYear()}</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => setCmdOpen(true)}
            style={{ fontFamily:SANS, fontSize:11, color:"rgba(13,13,13,0.5)", background:"rgba(13,13,13,0.08)", border:"none", borderRadius:6, padding:"5px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            <Command size={10}/> K
          </button>
          <span style={{ fontFamily:SANS, fontSize:10, color:"#0D0D0D", opacity:0.4, letterSpacing:"0.12em" }}>BUILT WITH CLAUDE CODE</span>
        </div>
      </footer>

      {/* ══ MODALS ═══════════════════════════════════════ */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      {cmdOpen && (
        <CommandSearch
          projects={projects}
          onSelect={p => { setSelectedProject(p); setCmdOpen(false); }}
          onClose={() => setCmdOpen(false)}
        />
      )}
    </div>
  );
}

/* small X icon inline */
function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
