"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/design-tokens";

export function SplitText({ text, style, delay = 0 }: { text: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <span style={{ display:"block", overflow:"hidden", ...style }}>
      {text.split("").map((ch, i) => (
        <motion.span key={i} style={{ display:"inline-block" }}
          initial={{ y:"110%" }} animate={{ y:"0%" }}
          transition={{ delay: delay + i * 0.022, duration:0.65, ease:EASE }}>
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
