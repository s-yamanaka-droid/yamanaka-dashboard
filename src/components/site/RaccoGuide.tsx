"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const poses = {
  thinking: { alt: "あごに手を添え、考えごとをするRacco", remarks: [["それ、", "毎回やる？"], ["ラクする", "方法、", "考えよ。"], ["まず、", "ひとつ。", "試そ。"]] },
  pointing: { alt: "手を伸ばして案内するRacco", remarks: [["どこから、", "ほどく？"], ["その先も、", "つなご。"], ["まず、", "ひとつ。", "試そ。"]] },
  welcoming: { alt: "片手を上げ、やさしく迎えるRacco", remarks: [["まずは、", "話そ。"], ["一緒に、", "考えよ。"], ["少しずつ、", "いこ。"]] },
};

export function RaccoGuide({ compact = false, eager = false, pose = "thinking" }: { compact?: boolean; eager?: boolean; pose?: keyof typeof poses }) {
  const [remark, setRemark] = useState(0);
  const { alt, remarks } = poses[pose];
  return <div className={`racco-guide is-${pose}${compact ? " is-compact" : ""}`}>
    <button className="racco-guide-portrait" type="button" aria-label="Raccoのひとことを聞く" onClick={() => setRemark(i => (i + 1) % remarks.length)}>
      <Image src={`/brand-book/racco-scenes/${pose}.png`} alt={alt} fill sizes={compact ? "(max-width: 760px) 220px, 310px" : "(max-width: 760px) 300px, (max-width: 1000px) 340px, 450px"} preload={eager} />
    </button>
    <span className="racco-guide-speech" aria-live="polite" aria-atomic="true">{remarks[remark].map(part => <span key={part}>{part}</span>)}</span>
    <Link href="/racco" className="racco-guide-link">Raccoに会う <ArrowRight size={17} aria-hidden="true" /></Link>
  </div>;
}
