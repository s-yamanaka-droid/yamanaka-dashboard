"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const videoSource = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";
const links = [["luna", "Luna"], ["recruitment", "人材紹介"], ["news", "News"], ["crm", "CRM構築"], ["fde", "FDE"]];

// Adapted from the PrismaHero component supplied by the user.
export function PrismaHero() {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!video.current) return;
    if (reduced) video.current.pause();
    else video.current.play().catch(() => {});
  }, [reduced]);
  return <section className="prisma-hero" aria-label="Lakkan">
    <div className="prisma-frame">
      <video ref={video} loop muted playsInline preload="metadata" poster="/prisma-poster.jpg" className="prisma-video" src={videoSource} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true" />
      <div className="prisma-grain" aria-hidden="true" />
      <div className="prisma-shade" aria-hidden="true" />
      <header className="site-header prisma-nav"><nav aria-label="メインナビゲーション">{links.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></header>
      <button className="prisma-playback" aria-label={playing ? "背景動画を一時停止" : "背景動画を再生"} onClick={() => { if (playing) video.current?.pause(); else video.current?.play().catch(() => {}); }}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
      <div className="prisma-hero-content">
        <h1><motion.span initial={false} animate={{ y: 0, opacity: 1 }} className={reduced ? "" : "prisma-pullup"}>Lakkan<span className="prisma-asterisk" aria-hidden="true">*</span></motion.span></h1>
        <motion.div className={`prisma-hero-aside ${reduced ? "" : "prisma-pullup prisma-delay"}`} initial={false}>
          <p><span>人とテクノロジーで、</span><span>事業の可能性をひらく。</span><br /><span>楽観と、計画と。Lakkanです。</span></p>
          <Link href="/contact" className="prisma-pill">話してみる<span><ArrowRight size={18} aria-hidden="true" /></span></Link>
        </motion.div>
      </div>
    </div>
  </section>;
}
