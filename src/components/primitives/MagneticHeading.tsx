"use client";

import { useRef, useEffect } from "react";

/**
 * Splits the given text segments into characters and pulls them toward the cursor.
 * `segments` can include line breaks via {br: true} entries.
 * Disabled on touch / narrow viewports.
 */
export type MagSegment =
  | { kind: "text"; text: string; italic?: boolean; color?: string }
  | { kind: "br" };

export function MagneticHeading({
  segments,
  maxOffset = 8,
  radius = 180,
  style,
}: {
  segments: MagSegment[];
  maxOffset?: number;
  radius?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches) return;

    const root = ref.current;
    if (!root) return;

    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-mag-char]"));
    let raf = 0;
    let mx = -9999, my = -9999;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      for (const ch of chars) {
        const r = ch.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.hypot(dx, dy);
        if (d < radius) {
          const strength = 1 - d / radius;
          const k = (strength * maxOffset) / Math.max(d, 1);
          ch.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
        } else {
          ch.style.transform = "translate(0,0)";
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [maxOffset, radius]);

  let keyCounter = 0;

  return (
    <span ref={ref} style={style}>
      {segments.map((seg, i) => {
        if (seg.kind === "br") return <br key={`br-${i}`} />;
        const chars = Array.from(seg.text).map((c) => {
          keyCounter++;
          return (
            <span
              key={`c-${keyCounter}`}
              data-mag-char
              style={{
                display: "inline-block",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
                whiteSpace: "pre",
              }}
            >
              {c}
            </span>
          );
        });
        if (seg.italic || seg.color) {
          return (
            <em
              key={`s-${i}`}
              style={{
                fontStyle: seg.italic ? "italic" : "normal",
                color: seg.color,
              }}
            >
              {chars}
            </em>
          );
        }
        return <span key={`s-${i}`}>{chars}</span>;
      })}
    </span>
  );
}
