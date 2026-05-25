"use client";

import { useEffect, useState } from "react";

export function CountUp({ target, start }: { target: number; start: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = Date.now(), dur = 1400;
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target]);
  return <>{n}</>;
}
