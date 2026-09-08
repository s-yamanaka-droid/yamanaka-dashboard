"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE } from "@/lib/design-tokens";

export function LineReveal({
  lines,
  delay = 0.18,
}: {
  lines: ReactNode[];
  delay?: number;
}) {
  return (
    <span aria-hidden="true">
      {lines.map((line, index) => (
        <span key={index} className="line-reveal-mask">
          <motion.span
            className="line-reveal-line"
            initial={{ opacity: 0, y: "108%", filter: "blur(12px)" }}
            animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
            transition={{
              delay: delay + index * 0.1,
              duration: 0.9,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
