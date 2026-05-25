"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TypewriterCycle({ words, style }: { words: string[]; style?: React.CSSProperties }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setVisible(true); }, 380);
    }, 2400);
    return () => clearInterval(id);
  }, [words]);
  return (
    <span style={{ display:"inline-block", overflow:"hidden", ...style }}>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.span key={idx} style={{ display:"block" }}
            initial={{ y:"100%" }} animate={{ y:"0%" }} exit={{ y:"-100%" }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}>
            {words[idx]}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
