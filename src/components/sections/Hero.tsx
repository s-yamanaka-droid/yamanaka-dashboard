"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Command } from "lucide-react";
import HeroCanvas from "@/components/HeroCanvas";
import HeroLetters from "@/components/HeroLetters";
import { CountUp } from "@/components/primitives/CountUp";
import { LiveBadge } from "@/components/primitives/LiveBadge";
import { LiveFeed } from "@/components/primitives/LiveFeed";
import { CodeMantra } from "@/components/primitives/CodeMantra";
import { Sparkline } from "@/components/primitives/Sparkline";
import { MagneticHeading } from "@/components/primitives/MagneticHeading";
import { CodeRain } from "@/components/primitives/CodeRain";
import { ACCENT, FRANK, INSTRUMENT, SANS, SortKey } from "@/lib/design-tokens";

export function Hero({
  totalProjects, live, cc, newCount,
  onOpenCmd,
}: {
  totalProjects: number; live: number; cc: number; newCount: number; todayCount: number;
  onOpenCmd: () => void;
  onSetSort: (s: SortKey) => void;
}) {
  const [statsStarted, setStatsStarted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start","end end"] });
  const heroX = useTransform(heroP, [0,1], ["0%","-66.67%"]);
  useMotionValueEvent(heroP, "change", v => { if (v > 0.6 && !statsStarted) setStatsStarted(true); });

  const ink = "#0D0D0D";

  // F7: Generative gradient — orange ↔ vermillion ↔ purple-orange, 60s cycle
  const bg = `radial-gradient(120% 90% at 30% 20%, #F4541A 0%, #E14A1F 35%, #B8362E 65%, #C2452A 100%)`;

  return (
    <>
      <div ref={heroRef} style={{ height:"300vh" }}>
        <div
          style={{
            position:"sticky",
            top:0,
            height:"100vh",
            overflow:"hidden",
            background: bg,
            // F7: subtle hue rotation cycle
            animation: "lakkan-hero-bg 60s linear infinite",
          }}
        >
          {/* F8 — code rain at the back */}
          <CodeRain />

          {/* WebGL particle field (existing) */}
          <HeroCanvas />

          {/* F1 — 3D Lakkan letters layer (desktop only) */}
          <HeroLetters />

          {/* F2 — Live badge (top right, fixed within hero) */}
          <LiveBadge skills={32} />

          <motion.div style={{ display:"flex", width:"300vw", height:"100%", translateX:heroX, position:"relative", zIndex:2 }}>

            {/* ─── Panel 1 ─── */}
            <div id="hero-panel-1" style={{
              width:"100vw", height:"100vh", flexShrink:0,
              display:"flex", flexDirection:"column",
              padding:"28px 56px", position:"relative",
            }}>
              {/* Nav */}
              <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ display:"flex", alignItems:"baseline", gap:10, fontFamily:FRANK, fontSize:18, fontWeight:700, color:ink, letterSpacing:"0.04em" }}>
                  Lakkan<span style={{ color: ACCENT.vermillion, fontWeight: 900 }}>.</span>
                  <span style={{ fontFamily:SANS, fontSize:10, fontWeight:500, opacity:0.55, letterSpacing:"0.18em", textTransform:"uppercase" }}>
                    operates × 6
                  </span>
                </span>
                <div style={{ display:"flex", gap:24, alignItems:"center" }}>
                  {[["Story","#story"],["Works","#works"],["Service","#service"],["Vigil AI","#vigil"],["About","/about"]].map(([l,h]) => (
                    <a key={l} href={h} className="hero-nav-link"
                      style={{ fontFamily:SANS, fontSize:13, fontWeight:500, color:ink, textDecoration:"none", opacity:0.75 }}>
                      {l}
                    </a>
                  ))}
                  <a href="/products" className="hero-nav-link"
                    style={{ fontFamily:SANS, fontSize:12, fontWeight:700, color:"#fff", textDecoration:"none",
                      background: ink, border:`1px solid ${ink}`,
                      borderRadius:4, padding:"6px 14px",
                      letterSpacing:"0.1em", textTransform:"uppercase" }}>
                    🔒 Products
                  </a>
                  <a href="#join" className="hero-nav-link"
                    style={{ fontFamily:SANS, fontSize:13, fontWeight:700, color:ink, textDecoration:"none",
                      background:"rgba(13,13,13,0.1)", border:"1px solid rgba(13,13,13,0.18)",
                      borderRadius:6, padding:"5px 14px", opacity:0.85 }}>
                    Contact
                  </a>
                  <button onClick={onOpenCmd}
                    style={{ display:"flex", alignItems:"center", gap:5, fontFamily:SANS, fontSize:11, fontWeight:500, color:ink,
                      background:"rgba(13,13,13,0.12)", border:"1px solid rgba(13,13,13,0.18)", borderRadius:6,
                      padding:"5px 10px", cursor:"pointer", opacity:0.8 }}>
                    <Command size={11}/><span>K</span>
                  </button>
                </div>
              </nav>

              <div style={{ height:1, background:ink, opacity:0.2, margin:"20px 0" }}/>

              {/* Center */}
              <div style={{
                flex:1,
                display:"grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: "6vw",
                alignItems: "center",
              }}
              data-mobile-stack="hero-main"
              >
                {/* LEFT — F6 magnetic heading */}
                <div>
                  <motion.h1
                    initial={{ opacity:0, y: 28 }}
                    animate={{ opacity:1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.85, ease: [0.22,1,0.36,1] }}
                    style={{
                      fontFamily: INSTRUMENT,
                      fontSize: "clamp(72px, 12vw, 200px)",
                      fontWeight: 400,
                      lineHeight: 0.92,
                      letterSpacing: "-0.025em",
                      color: ink,
                      margin: 0,
                    }}
                  >
                    <MagneticHeading
                      segments={[
                        { kind: "text", text: "楽観と、" },
                        { kind: "br" },
                        { kind: "text", text: "計画と", italic: true },
                        // F-accent: only the period in vermillion
                        { kind: "text", text: "。", italic: true, color: ACCENT.vermillion },
                      ]}
                    />
                  </motion.h1>
                  <motion.p
                    initial={{ opacity:0, y: 12 }}
                    animate={{ opacity:1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    style={{
                      fontFamily: FRANK,
                      fontSize: "clamp(14px, 1.4vw, 17px)",
                      fontWeight: 300,
                      color: ink,
                      opacity: 0.6,
                      letterSpacing: "0.06em",
                      marginTop: 28,
                      marginBottom: 0,
                      maxWidth: "32ch",
                      lineHeight: 1.7,
                    }}
                  >
                    山中秀斗 — 6 社マルチハット経営。
                    <br/>
                    <strong style={{ fontWeight: 500 }}>Lakkan</strong> / <strong style={{ fontWeight: 500 }}>LunaTech</strong> / <strong style={{ fontWeight: 500 }}>SKYLINK</strong> / KANOA / トレプロ / Solve。
                    <br/>
                    AIで再設計された、楽観の実験体。
                  </motion.p>

                  {/* 6社 役割ミニチップ */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, duration: 0.6 }}
                    style={{
                      display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, maxWidth: 540,
                    }}
                  >
                    {[
                      { co: "Lakkan",   role: "代表" },
                      { co: "トレプロ", role: "COO" },
                      { co: "LunaTech", role: "COO" },
                      { co: "SKYLINK",  role: "CTO" },
                      { co: "KANOA",    role: "AI相談役" },
                      { co: "Solve",    role: "代表" },
                    ].map(c => (
                      <span key={c.co} style={{
                        fontFamily: SANS, fontSize: 10, letterSpacing: "0.12em",
                        padding: "5px 11px",
                        background: "rgba(13,13,13,0.06)",
                        border: "1px solid rgba(13,13,13,0.14)",
                        borderRadius: 99,
                        color: ink, textTransform: "uppercase",
                      }}>
                        <span style={{ opacity: 0.5, marginRight: 6 }}>{c.role}</span>
                        <strong style={{ fontWeight: 700 }}>{c.co}</strong>
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* RIGHT — F3 Live feed (replaces stat strip) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{ display: "flex", flexDirection: "column", justifySelf: "end", width: "100%" }}
                >
                  <LiveFeed />
                </motion.div>
              </div>

              <div style={{ height:1, background:ink, opacity:0.2, margin:"0 0 14px" }}/>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: 4,
              }}>
                <span style={{ fontFamily:FRANK, fontSize:12, color:ink, opacity:0.55, letterSpacing:"0.04em" }}>
                  Yamanaka Shuto · 6 companies · 55 products · Built with Claude Code + Gemma + Gemini
                </span>
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:0.55 }} transition={{ delay:1, duration:0.8 }}
                  style={{ display:"flex", alignItems:"center", gap:10, fontFamily:SANS, fontSize:11, fontWeight:600, letterSpacing:"0.2em", color:ink, textTransform:"uppercase" }}>
                  Scroll
                  <motion.div animate={{ scaleY:[1,0.5,1] }} transition={{ duration:1.6, repeat:Infinity, ease:"easeInOut" }}
                    style={{ width:1.5, height:24, background:ink, transformOrigin:"top" }}/>
                </motion.div>
              </div>
            </div>

            {/* ─── Panel 2 — F4 CodeMantra ─── */}
            <div id="hero-panel-2" style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", position:"relative" }}>
              <div style={{ position:"absolute", top:"22%", left:56, right:56, height:1, background:ink, opacity:0.18 }}/>
              <div style={{ position:"absolute", bottom:"22%", left:56, right:56, height:1, background:ink, opacity:0.18 }}/>
              <div style={{
                fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em",
                color: ink, opacity: 0.55, textTransform: "uppercase",
                marginBottom: 28, display:"flex", alignItems:"center", gap:12,
              }}>
                <span style={{ width:24, height:1, background:ACCENT.vermillion }} />
                Mantra · v.0.2 · live edit
              </div>

              <CodeMantra />

              <div style={{ marginTop: 36, display:"flex", alignItems:"center", gap:20 }}>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(16px,1.6vw,22px)", fontWeight:300, color:ink, opacity:0.7 }}>
                  矛盾を抱えて、走れ<span style={{ color: ACCENT.vermillion }}>。</span>
                </span>
                <div style={{ flex:1, height:1, background:ink, opacity:0.18 }}/>
                <span style={{ fontFamily:FRANK, fontSize:"clamp(16px,1.6vw,22px)", fontWeight:300, color:ink, opacity:0.7 }}>
                  ({new Date().getFullYear()})
                </span>
              </div>
            </div>

            {/* ─── Panel 3 — F5 Numbers + sparklines ─── */}
            <div id="hero-panel-3" style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px" }}>
              <div style={{
                fontFamily: SANS, fontSize: 11, letterSpacing: "0.22em",
                color: ink, opacity: 0.55, textTransform: "uppercase",
                marginBottom: 28, display:"flex", alignItems:"center", gap:12,
              }}>
                <span style={{ width:24, height:1, background:ACCENT.vermillion }} />
                The Index · v.0.2 · last 30 days
              </div>
              <div style={{ height:1, background:ink, opacity:0.18, marginBottom:48 }}/>
              <div data-mobile-stack="hero-stats" style={{ display:"flex", gap:"6vw", alignItems:"flex-end", flexWrap:"wrap" }}>
                {[
                  { value:totalProjects, label:"PRODUCTS",    seed: 7 },
                  { value:live,          label:"LIVE",        seed: 13 },
                  { value:cc,            label:"CLAUDE CODE", seed: 21 },
                  { value:newCount,      label:"NEW / 7 DAYS",seed: 31 },
                ].map(({ value, label, seed }) => (
                  <div key={label} style={{ display:"flex", flexDirection:"column" }}>
                    <div style={{ fontFamily:INSTRUMENT, fontStyle:"italic", fontSize:"clamp(52px,8vw,120px)", fontWeight:400, lineHeight:1, color:ink, letterSpacing:"-0.025em" }}>
                      <CountUp target={value} start={statsStarted}/>
                    </div>
                    <div style={{ marginTop: 10, marginBottom: 6 }}>
                      <Sparkline target={Math.max(1, value)} seed={seed} />
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:9, letterSpacing:"0.2em", color:ink, opacity:0.5 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ height:1, background:ink, opacity:0.18, margin:"48px 0 24px" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:FRANK, fontSize:13, color:ink, opacity:0.38 }}>(LAKKAN@operates_6)</span>
                <motion.a href="#works" whileHover={{ x:4 }}
                  style={{ display:"flex", alignItems:"center", gap:8, fontFamily:INSTRUMENT, fontStyle:"italic", fontSize:24, fontWeight:400, color:ink, textDecoration:"none", opacity:0.8 }}>
                  ↓ works
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes lakkan-hero-bg {
          0%   { filter: hue-rotate(0deg) saturate(1); }
          25%  { filter: hue-rotate(-12deg) saturate(1.05); }
          50%  { filter: hue-rotate(8deg) saturate(0.95); }
          75%  { filter: hue-rotate(-6deg) saturate(1.05); }
          100% { filter: hue-rotate(0deg) saturate(1); }
        }
      `}</style>
    </>
  );
}
