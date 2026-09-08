"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import MusicHero, { type Track } from "@/components/ui/scroll-locked-video-hero";
import styles from "./VideoHero.module.css";

const tracks: Track[] = [
  { id: "agents", title: "AIエージェント開発", artist: "構想を、動く仕組みへ。", colorA: "#74b9f1", colorB: "#0b407d", href: "/services" },
  { id: "workflow", title: "業務再設計", artist: "AIと働く、新しい日常。", colorA: "#f39b72", colorB: "#7a3418", href: "/services" },
  { id: "luna", title: "Luna AI", artist: "あなたの仕事に、AIの力を。", colorA: "#7ddccc", colorB: "#0e4a4c", href: "#luna" },
  { id: "works", title: "私たちがつくったもの", artist: "アイデアから、実装へ。", colorA: "#ffbd70", colorB: "#7a4a10", href: "/works" },
  { id: "about", title: "Lakkanについて", artist: "楽観と、計画と。", colorA: "#a3b9ff", colorB: "#25376c", href: "/about" },
  { id: "contact", title: "次の一歩を、一緒に。", artist: "まずは、話してみませんか。", colorA: "#f59f97", colorB: "#71312d", href: "/contact" },
];

export function VideoHero({ onOpenCmd }: { onOpenCmd: () => void }) {
  return (
    <div id="video-hero" className={styles.hero}>
      <nav className={styles.nav} aria-label="メインナビゲーション">
        <Link className={styles.brand} href="/">Lakkan<span>.</span></Link>
        <div className={styles.links}>
          <Link href="/services">Services</Link>
          <Link href="/works">Works</Link>
          <Link href="/about">About</Link>
          <Link href="/contact" className={styles.contact}>Contact <ArrowUpRight size={14} /></Link>
          <button onClick={onOpenCmd} aria-label="サイト内検索"><Search size={18} /></button>
        </div>
      </nav>
      <h1 className={styles.srOnly}>株式会社Lakkan — 楽観と、計画と。</h1>
      <MusicHero title="楽観と、計画と。" videoSrc="/media/lakkan-running-hero.mp4" backgroundSrc="/media/lakkan-running-bg.jpg" tracks={tracks} signature={false} sound={false} className={`lakkan-video-hero ${styles.player}`} />
      <div className={styles.footer}>
        <p>AIとともに、構想から運用まで。<span>MAKE YOUR NEXT MOVE.</span></p>
        <a href="#capabilities">私たちにできること <ArrowDown size={16} /></a>
      </div>
    </div>
  );
}
