"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";
import { SectionShell, Em } from "@/components/primitives/SectionShell";

const PORTALS = [
  {
    label: "Luna AI",
    jaLabel: "育つAIの右腕",
    sub: "AI Kitting · Public",
    desc: "判断・言葉・失敗を手元に蓄積し、使うほど利用者専用に育つAIキッティングサービス。",
    url: "https://lunatech-migration-guide.vercel.app",
    accent: "#1F3A2E",
    meta: "by LunaTech",
  },
  {
    label: "Now On AIr",
    jaLabel: "AI Morning Dispatch",
    sub: "Editorial · Updated regularly",
    desc: "AI業界の主要ニュースを、事業判断に使える論点へ編集して届ける公開ディスパッチ。",
    url: "https://nowonair.vercel.app",
    accent: ACCENT.vermillion,
    meta: "Public",
  },
  {
    label: "AI Lab",
    jaLabel: "LunaTech AI Lab",
    sub: "Interactive Learning · Public",
    desc: "生成AIを説明ではなく操作で理解する体験型ラボ。業務別の活用イメージをブラウザで試せます。",
    url: "https://lunatech-ai-lab.vercel.app",
    accent: ACCENT.blue,
    meta: "Try online",
  },
  {
    label: "Atelier",
    jaLabel: "Lakkan Web Experiments",
    sub: "Design Patterns · Public",
    desc: "WebGL、レイアウト、導線設計を実際に触って比較できる、Lakkanの公開制作実験場。",
    url: "/atelier",
    accent: "#7C3AED",
    meta: "Explore",
  },
];

function PortalCard({ portal, index }: { portal: (typeof PORTALS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isExternal = portal.url.startsWith("http");

  return (
    <motion.a
      href={portal.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "32px 28px 28px",
        textDecoration: "none",
        color: "#0D0D0D",
        background: hovered ? "#FFFFFF" : "transparent",
        border: "1px solid rgba(13,13,13,0.1)",
        borderRadius: 4,
        transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 18px 40px rgba(13,13,13,0.08), 0 0 0 1px ${portal.accent}33` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "#3A8C5C" }}>
          PUBLIC
        </span>
        <ArrowUpRight size={14} color={hovered ? portal.accent : "#B0ADA6"} />
      </div>
      <div style={{ fontFamily: INSTRUMENT, fontSize: 40, lineHeight: 1, color: hovered ? portal.accent : "#0D0D0D", marginBottom: 6 }}>
        {portal.label}<em style={{ fontStyle: "italic", opacity: 0.4 }}>.</em>
      </div>
      <div style={{ fontFamily: FRANK, fontSize: 13, color: "#6B6860", marginBottom: 18 }}>{portal.jaLabel}</div>
      <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.16em", color: "#B0ADA6", textTransform: "uppercase", marginBottom: 16 }}>
        {portal.sub}
      </div>
      <p style={{ fontFamily: SANS, fontSize: 13, color: "#5A554D", lineHeight: 1.65, margin: "0 0 24px" }}>
        {portal.desc}
      </p>
      <div style={{ paddingTop: 16, borderTop: "1px solid rgba(13,13,13,0.08)", display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 10, color: "#B0ADA6" }}>
        <span>{portal.meta}</span>
        <span style={{ fontFamily: INSTRUMENT, fontStyle: "italic", fontSize: 13, color: hovered ? portal.accent : "#B0ADA6" }}>
          Visit →
        </span>
      </div>
    </motion.a>
  );
}

export function Portals() {
  return (
    <SectionShell id="portals" tone="creamLight" eyebrow="Public Portals" accent="blue">
      <div data-mobile-stack="portals-head" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "6vw", alignItems: "end", marginBottom: 56 }}>
        <motion.h2
          className="editorial-heading editorial-heading--display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: INSTRUMENT, fontSize: "clamp(56px, 9vw, 136px)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.03em", margin: 0 }}
        >
          <span className="heading-phrase">公開している、</span><br /><Em accent="blue"><span className="heading-phrase">仕事の入口。</span></Em>
        </motion.h2>
        <p style={{ fontFamily: SANS, fontSize: 14, color: "#5A554D", lineHeight: 1.85, margin: 0, maxWidth: 420 }}>
          実際に公開・運用しているプロダクトだけを掲載しています。開発中、社内専用、顧客限定の情報はここには出しません。
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
        {PORTALS.map((portal, index) => <PortalCard key={portal.label} portal={portal} index={index} />)}
      </div>
    </SectionShell>
  );
}
