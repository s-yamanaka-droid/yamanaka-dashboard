"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category, Project } from "@/types";
import { ACCENT, FRANK, SANS, CAT_COLOR, CAT_LABEL, STATUS, isNew } from "@/lib/design-tokens";

export function FeaturedCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
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
        border:`1px solid ${hov ? catColor : "#C7CFCA"}`,
        borderRadius:16, padding:"28px 28px 24px",
        cursor:"pointer", position:"relative", overflow:"hidden",
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${catColor}` : "0 2px 8px rgba(0,0,0,0.05)",
        transition:"border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:catColor }}/>
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
            <span style={{ fontFamily:SANS, fontSize:9, fontWeight:700, color:ACCENT.vermillion, background:`${ACCENT.vermillion}18`, padding:"2px 7px", borderRadius:100 }}>NEW</span>
          )}
          <span style={{ display:"flex", alignItems:"center", gap:4, fontFamily:SANS, fontSize:10, color:st.color }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:st.dot, display:"inline-block" }}/>
            {st.label}
          </span>
        </div>
      </div>

      <h3 style={{ fontFamily:FRANK, fontSize:"clamp(22px,3vw,36px)", fontWeight:400, lineHeight:1.05, letterSpacing:"-0.01em", color:"#132126", margin:"0 0 10px" }}>
        {project.name}
      </h3>
      {project.client && (
        <p style={{ fontFamily:SANS, fontSize:11, color:"#6E7A7C", margin:"0 0 12px" }}>for {project.client}</p>
      )}
      <p style={{
        fontFamily:SANS, fontSize:12, color:"#45545A", lineHeight:1.55, margin:"0 0 20px",
        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
      }}>{project.description}</p>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:5 }}>
          {project.tags.slice(0,2).map(t => (
            <span key={t} style={{ fontFamily:SANS, fontSize:10, color:"#6E7A7C", border:"1px solid #C7CFCA", borderRadius:4, padding:"1px 6px" }}>{t}</span>
          ))}
        </div>
        <ArrowUpRight size={15} color={catColor} style={{ opacity: hov ? 1 : 0.35, transition:"opacity 0.15s" }}/>
      </div>
    </motion.div>
  );
}
