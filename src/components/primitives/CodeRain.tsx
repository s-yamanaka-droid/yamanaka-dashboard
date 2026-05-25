"use client";

const SOURCE = `// Lakkan / Hero.tsx — Flex Mode v0.1
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import { CountUp } from "@/components/primitives/CountUp";
import { LiveBadge } from "@/components/primitives/LiveBadge";
import { LiveFeed } from "@/components/primitives/LiveFeed";
import { CodeMantra } from "@/components/primitives/CodeMantra";
import { Sparkline } from "@/components/primitives/Sparkline";
import { MagneticHeading } from "@/components/primitives/MagneticHeading";
import { ACCENT, FRANK, INSTRUMENT, SANS } from "@/lib/design-tokens";

export function Hero({ totalProjects, live, cc, newCount, onOpenCmd }) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef });
  const heroX = useTransform(heroP, [0, 1], ["0%", "-66.67%"]);
  const hue   = useTransform(heroP, [0, 1], [0, 360]);

  return (
    <section ref={heroRef} style={{ height: "300vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh" }}>
        <CodeRain />
        <HeroCanvas />
        <motion.div style={{ display: "flex", width: "300vw", translateX: heroX }}>
          {/* … panels … */}
        </motion.div>
      </div>
    </section>
  );
}`;

export function CodeRain() {
  const lines = SOURCE.split("\n");
  // Duplicate to enable seamless loop
  const loop = [...lines, ...lines];

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "32px 56px",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          lineHeight: 1.7,
          color: "#0D0D0D",
          opacity: 0.045,
          whiteSpace: "pre",
          animation: "lakkan-coderain 60s linear infinite",
          willChange: "transform",
        }}
      >
        {loop.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <style>{`@keyframes lakkan-coderain { from { transform: translateY(0) } to { transform: translateY(-50%) } }`}</style>
    </div>
  );
}
