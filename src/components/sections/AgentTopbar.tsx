"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SANS } from "@/lib/design-tokens";

export function AgentTopbar() {
  return (
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
  );
}
