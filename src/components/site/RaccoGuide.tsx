"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const remarks = ["それ、毎回やる？", "ラクする方法、考えよ。", "まずひとつ、試そ。"];

export function RaccoGuide({ compact = false, eager = false }: { compact?: boolean; eager?: boolean }) {
  const [remark, setRemark] = useState(0);
  return <div className={`racco-guide${compact ? " is-compact" : ""}`}>
    <button className="racco-guide-portrait" type="button" aria-label="Raccoのひとことを聞く" onClick={() => setRemark(i => (i + 1) % remarks.length)}>
      <Image src="/brand-book/racco-self-avatar.png" alt="太縁メガネにグレーのパーカーのRacco" width={1254} height={1254} unoptimized preload={eager} />
    </button>
    <span className="racco-guide-speech" aria-live="polite" aria-atomic="true">{remarks[remark]}</span>
    <Link href="/racco" className="racco-guide-link">Raccoに会う <ArrowRight size={17} aria-hidden="true" /></Link>
  </div>;
}
