"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import HeroCanvas from "@/components/HeroCanvas";
import projectsData from "@/data/projects.json";
import { Category, Project } from "@/types";

const projects = projectsData as Project[];
type SortKey = "updatedAt" | "createdAt" | "name";

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
const ALL_CATS: Category[] = ["all","website","external","internal","analytics","onboarding","ai_agent"];
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────── CURSOR FOLLOWER ─────────────────────── */
function CursorFollower() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse   = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    };
    window.addEventListener("mousemove", onMove);
    let raf: number;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.09;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.09;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x - 22}px,${ring.current.y - 22}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position:"fixed",top:0,left:0,width:8,height:8,
        background:"#0D0D0D",borderRadius:"50%",
        pointerEvents:"none",zIndex:9999,willChange:"transform",
      }}/>
      <div ref={ringRef} style={{
        position:"fixed",top:0,left:0,width:44,height:44,
        border:"1.5px solid rgba(13,13,13,0.4)",borderRadius:"50%",
        pointerEvents:"none",zIndex:9998,willChange:"transform",
      }}/>
    </>
  );
}

/* ─────────────────── SCROLL PROGRESS BAR ─────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return (
    <motion.div style={{
      position:"fixed",top:0,left:0,right:0,height:2,
      background:"#0D0D0D",transformOrigin:"0%",scaleX,zIndex:9997,
    }}/>
  );
}

/* ─────────────────── SPLIT TEXT (char-by-char) ────────────── */
function SplitText({ text, style, delay = 0 }: {
  text: string; style?: React.CSSProperties; delay?: number;
}) {
  return (
    <span style={{ display:"block", overflow:"hidden", ...style }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          style={{ display:"inline-block" }}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ delay: delay + i * 0.022, duration: 0.65, ease: EASE }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────── COUNT UP ────────────────────────────── */
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

/* ─────────────────── MARQUEE ────────────────────────────── */
function Marquee({ items, dark = true, slow = false }: {
  items: string[]; dark?: boolean; slow?: boolean;
}) {
  const quad = [...items, ...items, ...items, ...items];
  return (
    <div style={{
      overflow:"hidden",
      background: dark ? "#0D0D0D" : "#F4541A",
      padding:"13px 0",
    }}>
      <div className={slow ? "marquee-track-slow" : "marquee-track"}>
        {quad.map((item, i) => (
          <span key={i} style={{
            fontFamily:FRANK, fontSize:14, fontWeight:300,
            color: dark ? "#F4541A" : "#0D0D0D",
            paddingRight:56, whiteSpace:"nowrap", letterSpacing:"0.06em",
          }}>
            {item}
            <span style={{ opacity:0.3, paddingLeft:56 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── WORK ITEM ──────────────────────────── */
function WorkItem({ project, index, catColor, catLabel, st }: {
  project: Project; index: number; catColor: string; catLabel: string;
  st: { label: string; color: string; dot: string };
}) {
  const [hov, setHov] = useState(false);
  return (
    <div>
      <div style={{ height:1, background:"#0D0D0D", opacity:0.08 }}/>
      <a
        href={project.url || "#"}
        target={project.url ? "_blank" : "_self"}
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display:"grid",
          gridTemplateColumns:"52px 4px 1fr auto",
          alignItems:"center", gap:24, padding:"22px 0",
          textDecoration:"none", color:"inherit",
          background: hov ? "rgba(13,13,13,0.025)" : "transparent",
          transition:"background 0.15s", borderRadius:4,
        }}
      >
        <span style={{ fontFamily:FRANK, fontSize:13, fontWeight:300, color:"#C0BDB5", textAlign:"right" }}>
          ({String(index + 1).padStart(2, "0")})
        </span>
        <div style={{ width:4, height:52, background:catColor, borderRadius:2 }}/>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{
              fontFamily:SANS,
              fontSize:"clamp(17px, 2.2vw, 32px)",
              fontWeight:700,
              color: hov ? catColor : "#0D0D0D",
              lineHeight:1.1, letterSpacing:"-0.02em",
              transition:"color 0.15s",
            }}>
              {project.name}
            </span>
            {project.client && (
              <span style={{ fontFamily:SANS, fontSize:12, color:"#B0ADA6" }}>
                for {project.client}
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <span style={{ fontFamily:SANS, fontSize:11, fontWeight:600, color:catColor, letterSpacing:"0.08em" }}>
              {catLabel.toUpperCase()}
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:5, fontFamily:SANS, fontSize:11, color:st.color }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>
              {st.label}
            </span>
            <span style={{ fontFamily:SANS, fontSize:11, color:"#C0BDB5" }}>
              {new Date(project.updatedAt || "").toLocaleDateString("ja-JP", { year:"2-digit", month:"short", day:"numeric" })}
            </span>
            <div style={{ display:"flex", gap:5 }}>
              {project.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{ fontFamily:SANS, fontSize:10, color:"#B0ADA6", border:"1px solid #E0DBD2", borderRadius:3, padding:"1px 6px" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:4,
          fontFamily:FRANK, fontSize:14, fontWeight:300,
          color: project.url ? catColor : "#D0CCC4",
          opacity: project.url ? (hov ? 1 : 0.45) : 0.25,
          transition:"opacity 0.15s", minWidth:60,
        }}>
          {project.url ? <>View <ArrowUpRight size={13}/></> : "—"}
        </div>
      </a>
    </div>
  );
}

/* ─────────────────── PORTAL CARD ────────────────────────── */
function PortalCard({ p, i }: {
  p: { label: string; sub: string; desc: string; url: string; accent: string }; i: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={p.url} target="_blank" rel="noopener noreferrer"
      initial={{ opacity:0, y:40 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.3 }}
      transition={{ delay: i * 0.12, duration:0.65, ease:EASE }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"block", padding:"56px 56px 48px",
        borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
        borderTop:"1px solid rgba(255,255,255,0.08)",
        textDecoration:"none",
        background: hov ? "rgba(255,255,255,0.04)" : "transparent",
        transition:"background 0.2s",
      }}
    >
      <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.18em", color:"rgba(255,255,255,0.28)", marginBottom:16 }}>
        {p.sub}
      </div>
      <div style={{
        fontFamily:FRANK, fontSize:"clamp(48px,7vw,96px)", fontWeight:400,
        color:p.accent, lineHeight:0.9, marginBottom:20, letterSpacing:"-0.02em",
        opacity: hov ? 0.85 : 1, transition:"opacity 0.15s",
      }}>
        {p.label}
      </div>
      <p style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.6, margin:"0 0 24px" }}>
        {p.desc}
      </p>
      <div style={{
        display:"flex", alignItems:"center", gap:4,
        fontFamily:FRANK, fontSize:14, color:p.accent,
        opacity: hov ? 1 : 0.45, transition:"opacity 0.2s",
      }}>
        Open <ArrowUpRight size={14}/>
      </div>
    </motion.a>
  );
}

/* ─────────────────── HOME ───────────────────────────────── */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updatedAt");
  const [statsStarted, setStatsStarted] = useState(false);

  /* ── Hero horizontal scroll ── */
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end end"],
  });
  // 3 panels of 100vw → translateX: 0% → -66.67% to show all three
  const heroX = useTransform(heroProgress, [0, 1], ["0%", "-66.67%"]);

  // Start counter when stats panel pans into view
  useMotionValueEvent(heroProgress, "change", v => {
    if (v > 0.6 && !statsStarted) setStatsStarted(true);
  });

  const counts = useMemo(() => {
    const m: Record<Category, number> = { all:projects.length, website:0, external:0, internal:0, analytics:0, onboarding:0, ai_agent:0 };
    projects.forEach(p => { m[p.category] = (m[p.category] || 0) + 1; });
    return m;
  }, []);

  const filtered = useMemo(() => {
    let r = projects;
    if (activeCategory !== "all") r = r.filter(p => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (p.client && p.client.toLowerCase().includes(q))
      );
    }
    return [...r].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "ja");
      return new Date(b[sort] || "").getTime() - new Date(a[sort] || "").getTime();
    });
  }, [activeCategory, query, sort]);

  const live = projects.filter(p => p.status === "live").length;
  const cc   = projects.filter(p => p.builtWith === "claude_code").length;

  const PORTALS = [
    { label:"Trepro", sub:"CORPORATE SITE",   desc:"株式会社トレプロ",     url:"https://tre-pro.co.jp", accent:"#F4541A" },
    { label:"KANOA",  sub:"HR × AI PLATFORM", desc:"プロダクトサイト",     url:"#",                     accent:"#A8F5D8" },
    { label:"Braive", sub:"EDTECH × AI",       desc:"教育プラットフォーム", url:"#",                     accent:"#F5A8C8" },
  ];

  const MARQUEE_INFO = ["YAMANAKA SHUTO","PRODUCT BUILDER","CLAUDE CODE NATIVE","TREPRO CEO","(2022–2026)","AI BUILDER","26 PRODUCTS"];

  return (
    <div>
      <CursorFollower />
      <ScrollProgressBar />

      {/* ══════════════════════════════════════════════════
          HERO — 横スクロール (300vh sticky container)
      ══════════════════════════════════════════════════ */}
      <div ref={heroContainerRef} style={{ height:"300vh" }}>
        <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden", background:"#F4541A" }}>
          {/* Three.js 3D background */}
          <HeroCanvas />
          <motion.div style={{ display:"flex", width:"300vw", height:"100%", translateX: heroX, position:"relative", zIndex:1 }}>

            {/* ── PANEL 1: Intro / Start ── */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", padding:"28px 56px" }}>
              {/* Nav */}
              <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontFamily:FRANK, fontSize:15, color:"#0D0D0D", letterSpacing:"0.05em" }}>
                  YAMANAKA SHUTO
                </span>
                <div style={{ display:"flex", gap:36, alignItems:"center" }}>
                  {[["Works","#works"],["Portals","#portals"]].map(([label,href]) => (
                    <a key={label} href={href} style={{ fontFamily:SANS, fontSize:13, color:"#0D0D0D", textDecoration:"none", opacity:0.65 }}>
                      {label}
                    </a>
                  ))}
                  <a href="https://tre-pro.co.jp" target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily:SANS, fontSize:13, color:"#0D0D0D", textDecoration:"none", display:"flex", alignItems:"center", gap:3 }}>
                    Trepro <ArrowUpRight size={11}/>
                  </a>
                  <a href="#contact" style={{
                    fontFamily:SANS, fontSize:12, fontWeight:600,
                    color:"#F4541A", background:"#0D0D0D",
                    padding:"8px 20px", borderRadius:100, textDecoration:"none",
                  }}>
                    Contact
                  </a>
                </div>
              </nav>

              <div style={{ height:1, background:"#0D0D0D", opacity:0.2, margin:"20px 0" }}/>

              {/* Center — labels + scroll indicator */}
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[["AI","Builder"],["Claude Code","Native"],["Trepro","CEO"],["Product","Maker"],["since","2022"]].map(([cat,label], i) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity:0, x:-16 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration:0.5 }}
                      style={{ fontFamily:SANS, fontSize:14, color:"#0D0D0D", opacity:0.65 }}
                    >
                      +({cat})-{label}
                    </motion.div>
                  ))}
                </div>

                {/* Vertical scroll hint */}
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:0.45 }}
                  transition={{ delay:1, duration:0.8 }}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}
                >
                  <span style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.22em", color:"#0D0D0D", writingMode:"vertical-rl" }}>
                    (Scroll) — Down
                  </span>
                  <div style={{ width:1, height:64, background:"#0D0D0D" }}/>
                </motion.div>
              </div>

              <div style={{ height:1, background:"#0D0D0D", opacity:0.2, margin:"0 0 16px" }}/>
              <div style={{ fontFamily:FRANK, fontSize:13, color:"#0D0D0D", opacity:0.38, paddingBottom:12 }}>
                2022 — {new Date().getFullYear()}
              </div>
            </div>

            {/* ── PANEL 2: Giant Heading ── */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", position:"relative" }}>
              {/* Horizontal rules */}
              <div style={{ position:"absolute", top:"28%", left:56, right:56, height:1, background:"#0D0D0D", opacity:0.18 }}/>
              <div style={{ position:"absolute", bottom:"26%", left:56, right:56, height:1, background:"#0D0D0D", opacity:0.18 }}/>

              {/* Giant split text */}
              <div>
                <SplitText
                  text="product+"
                  delay={0}
                  style={{
                    fontFamily:FRANK,
                    fontSize:"clamp(72px,13vw,220px)",
                    fontWeight:400, lineHeight:0.88,
                    color:"transparent",
                    WebkitTextStroke:"2px #0D0D0D",
                    letterSpacing:"-0.02em",
                    opacity:0.18,
                  }}
                />
                <SplitText
                  text="builder"
                  delay={0.18}
                  style={{
                    fontFamily:FRANK,
                    fontSize:"clamp(72px,13vw,220px)",
                    fontWeight:400, lineHeight:0.88,
                    color:"#0D0D0D",
                    letterSpacing:"-0.02em",
                  }}
                />
              </div>

              {/* Year row (below bottom rule) */}
              <div style={{
                position:"absolute", bottom:"18%", left:56, right:56,
                display:"flex", alignItems:"center", gap:20,
              }}>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(22px,3vw,44px)", fontWeight:300, color:"#0D0D0D" }}>(2022)</span>
                <div style={{ flex:1, height:1, background:"#0D0D0D", opacity:0.18 }}/>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(22px,3vw,44px)", fontWeight:300, color:"#0D0D0D" }}>({new Date().getFullYear()})</span>
              </div>
            </div>

            {/* ── PANEL 3: Stats ── */}
            <div style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px" }}>
              <div style={{ height:1, background:"#0D0D0D", opacity:0.18, marginBottom:56 }}/>

              {/* Count-up stats */}
              <div style={{ display:"flex", gap:"8vw", alignItems:"flex-end", flexWrap:"wrap" }}>
                {[{ value:projects.length, label:"PRODUCTS" }, { value:live, label:"LIVE" }, { value:cc, label:"CLAUDE CODE" }].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ fontFamily:FRANK, fontSize:"clamp(64px,10vw,150px)", fontWeight:400, lineHeight:1, color:"#0D0D0D" }}>
                      <CountUp target={value} start={statsStarted}/>
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.2em", color:"#0D0D0D", opacity:0.4, marginTop:6 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height:1, background:"#0D0D0D", opacity:0.18, margin:"56px 0 24px" }}/>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:FRANK, fontSize:13, color:"#0D0D0D", opacity:0.38 }}>
                  (welcom@since_2022)
                </span>
                <motion.a
                  href="#works"
                  whileHover={{ x: 4 }}
                  style={{
                    display:"flex", alignItems:"center", gap:8,
                    fontFamily:FRANK, fontSize:20, fontWeight:300,
                    color:"#0D0D0D", textDecoration:"none", opacity:0.7,
                  }}
                >
                  ↓ works
                </motion.a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      {/* end heroContainer */}

      {/* ══════════════════════════════════════════════════
          MARQUEE 1 — dark strip
      ══════════════════════════════════════════════════ */}
      <Marquee items={MARQUEE_INFO} dark />

      {/* ══════════════════════════════════════════════════
          WORKS
      ══════════════════════════════════════════════════ */}
      <section id="works" style={{ background:"#F7F4EE" }}>
        <div style={{ padding:"72px 56px 0" }}>
          <div style={{ height:1, background:"#0D0D0D", opacity:0.1, marginBottom:48 }}/>

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
            <motion.h2
              initial={{ y:24 }}
              whileInView={{ y:0 }}
              viewport={{ once:true, amount:0.5 }}
              transition={{ duration:0.7, ease:EASE }}
              style={{ fontFamily:FRANK, fontSize:"clamp(80px,13vw,200px)", fontWeight:400, lineHeight:0.85, color:"#0D0D0D", letterSpacing:"-0.02em", margin:0 }}
            >
              works
            </motion.h2>

            <motion.div
              initial={{ opacity:0 }}
              whileInView={{ opacity:1 }}
              viewport={{ once:true }}
              transition={{ delay:0.3, duration:0.6 }}
              style={{ paddingBottom:12 }}
            >
              <div style={{ fontFamily:SANS, fontSize:10, letterSpacing:"0.14em", color:"#B0ADA6", marginBottom:8 }}>PRODUCT TYPE</div>
              {(Object.entries(CAT_LABEL) as [Exclude<Category,"all">, string][]).map(([cat, label]) => (
                <div key={cat} style={{ fontFamily:SANS, fontSize:13, color:"#6B6860", lineHeight:1.9 }}>
                  ↓({label})-{counts[cat]}
                </div>
              ))}
            </motion.div>
          </div>

          <div style={{ height:1, background:"#0D0D0D", opacity:0.1, marginTop:40 }}/>
        </div>

        {/* Filter tabs */}
        <div style={{ padding:"20px 56px", display:"flex", alignItems:"center", gap:0, overflowX:"auto", borderBottom:"1px solid rgba(13,13,13,0.07)" }}>
          {ALL_CATS.map((cat, i) => {
            const isActive = activeCategory === cat;
            const color = cat === "all" ? "#0D0D0D" : CAT_COLOR[cat as Exclude<Category,"all">];
            const label = cat === "all" ? "All" : CAT_LABEL[cat as Exclude<Category,"all">];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily:FRANK,
                  fontSize:"clamp(14px,1.7vw,20px)",
                  fontWeight: isActive ? 500 : 300,
                  color: isActive ? color : "#C0BDB5",
                  background:"none", border:"none",
                  borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                  cursor:"pointer", padding:"8px 16px",
                  marginRight: i < ALL_CATS.length - 1 ? 2 : 0,
                  transition:"color 0.15s, border-color 0.15s",
                  whiteSpace:"nowrap", letterSpacing:"-0.01em",
                }}
              >
                ({label}·{counts[cat]})
              </button>
            );
          })}

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:20, flexShrink:0, paddingLeft:20 }}>
            <input
              type="text" placeholder="search..." value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ fontFamily:FRANK, fontSize:15, fontWeight:300, background:"none", border:"none", borderBottom:"1px solid rgba(13,13,13,0.18)", outline:"none", color:"#0D0D0D", padding:"4px 0", width:130 }}
            />
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={{ fontFamily:SANS, fontSize:11, background:"none", border:"1px solid rgba(13,13,13,0.14)", borderRadius:6, outline:"none", color:"#6B6860", padding:"4px 8px" }}>
              <option value="updatedAt">Updated</option>
              <option value="createdAt">Created</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Works list */}
        <div style={{ padding:"0 56px 80px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"80px 0", textAlign:"center", fontFamily:FRANK, fontSize:32, fontWeight:300, color:"#C0BDB5" }}>
              No products found.
            </div>
          ) : (
            filtered.map((project, i) => {
              const catColor = CAT_COLOR[project.category as Exclude<Category,"all">] || "#0D0D0D";
              const catLabel = CAT_LABEL[project.category as Exclude<Category,"all">] || project.category;
              const st = STATUS[project.status];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity:0, y:14 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, amount:0.05 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration:0.5, ease:"easeOut" }}
                >
                  <WorkItem project={project} index={i} catColor={catColor} catLabel={catLabel} st={st}/>
                </motion.div>
              );
            })
          )}
          <div style={{ height:1, background:"#0D0D0D", opacity:0.08 }}/>
          <p style={{ textAlign:"center", marginTop:24, fontFamily:FRANK, fontSize:14, fontWeight:300, color:"#B0ADA6" }}>
            {filtered.length} / {projects.length} products
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE 2 — yellow strip, project names
      ══════════════════════════════════════════════════ */}
      <Marquee items={projects.map(p => p.name.toUpperCase())} dark slow />

      {/* ══════════════════════════════════════════════════
          PORTALS — deep navy
      ══════════════════════════════════════════════════ */}
      <section id="portals" style={{ background:"#0E1F5E" }}>
        <div style={{ padding:"72px 56px 0" }}>
          <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginBottom:48 }}/>
          <motion.h2
            initial={{ y:24, opacity:0 }}
            whileInView={{ y:0, opacity:1 }}
            viewport={{ once:true, amount:0.5 }}
            transition={{ duration:0.7, ease:EASE }}
            style={{ fontFamily:FRANK, fontSize:"clamp(80px,13vw,200px)", fontWeight:400, lineHeight:0.85, color:"#F4541A", letterSpacing:"-0.02em", margin:0 }}
          >
            portals
          </motion.h2>
          <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginTop:48 }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))" }}>
          {PORTALS.map((portal, i) => <PortalCard key={portal.label} p={portal} i={i}/>)}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{ background:"#F4541A", padding:"28px 56px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(13,13,13,0.1)" }}>
        <span style={{ fontFamily:FRANK, fontSize:15, color:"#0D0D0D" }}>YAMANAKA SHUTO — {new Date().getFullYear()}</span>
        <span style={{ fontFamily:SANS, fontSize:10, color:"#0D0D0D", opacity:0.4, letterSpacing:"0.12em" }}>BUILT WITH CLAUDE CODE</span>
      </footer>
    </div>
  );
}
