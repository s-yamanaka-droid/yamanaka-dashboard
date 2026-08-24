"use client";

import { FRANK, MarqueeItem } from "@/lib/design-tokens";

export function Marquee2({
  items, bg = "#132126", speed = "normal", reverse = false,
}: {
  items: MarqueeItem[]; bg?: string; speed?: "fast"|"normal"|"slow"; reverse?: boolean;
}) {
  // Two copies are enough for a seamless -50% loop and keep the DOM compact.
  const loop = [...items, ...items];
  const cls = reverse ? "marquee-track-rev"
    : speed === "fast" ? "marquee-track-fast"
    : speed === "slow" ? "marquee-track-slow"
    : "marquee-track";
  const textColor = bg === "#132126" ? "#EEF0EC" : "#FFFFFF";
  return (
    <div style={{ overflow:"hidden", background:bg, padding:"12px 0" }}>
      <div className={cls}>
        {loop.map((item, i) => (
          <span key={i} style={{
            fontFamily:FRANK, fontSize:13, fontWeight:300,
            color: textColor,
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
