"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";

/* ===================== Data ===================== */

type Cat = "all" | "3d" | "layout" | "cv" | "core";

type Item = {
  id: string;
  cat: Exclude<Cat, "all">;
  href: string;
  tag: string;
  brand: string;
  desc: string;
  poster: string;
  /** カテゴリ別カラー（リムライト＋カラーバー） */
  hue: string;
};

const IMG = "https://images.unsplash.com/";

// アクセントは1色（terra）に統一。カテゴリ別の色分けは廃止。
const INK = "var(--foreground)";
const CAT_COLOR: Record<Exclude<Cat, "all">, { c: string; soft: string; label: string }> = {
  "3d":    { c: INK, soft: "var(--secondary)", label: "3D / WebGL" },
  layout:  { c: INK, soft: "var(--secondary)", label: "Layout" },
  cv:      { c: INK, soft: "var(--secondary)", label: "Conversion" },
  core:    { c: INK, soft: "var(--secondary)", label: "Core" },
};

const ITEMS: Item[] = [
  { id: "particles",  cat: "3d",     href: "/atelier/particles",  tag: "3D · Particles",   brand: "RESONA STUDIO",   poster: IMG + "photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=72", desc: "マウスに反応する粒子フィールド。音響/テック/クリエイティブ向け。", hue: CAT_COLOR["3d"].c },
  { id: "fluid",      cat: "3d",     href: "/atelier/fluid",      tag: "3D · Fluid",       brand: "Liora Atelier",   poster: IMG + "photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=72", desc: "淡いパステルの流体グラデーション。コスメ/サロン/D2C向け。", hue: CAT_COLOR["3d"].c },
  { id: "terrain",    cat: "3d",     href: "/atelier/terrain",    tag: "3D · Terrain",     brand: "TERRA NOSU",      poster: IMG + "photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=72", desc: "波打つワイヤーフレーム地形。建築/不動産/リゾート向け。", hue: CAT_COLOR["3d"].c },
  { id: "saas",       cat: "layout", href: "/atelier/saas",       tag: "Layout · SaaS",    brand: "Flowdesk",        poster: IMG + "photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=72", desc: "機能/料金/FAQ/事例まで揃ったSaaS・アプリLP素地。", hue: CAT_COLOR.layout.c },
  { id: "portfolio",  cat: "layout", href: "/atelier/portfolio",  tag: "Layout · Studio",  brand: "STUDIO HARUKAZE", poster: IMG + "photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=72", desc: "編集的な大タイポと作品グリッド。制作会社/クリエイター向け。", hue: CAT_COLOR.layout.c },
  { id: "restaurant", cat: "layout", href: "/atelier/restaurant", tag: "Layout · Food",    brand: "日和テーブル",     poster: IMG + "photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=72", desc: "メニュー/予約/ギャラリー/アクセス。飲食/ホテル向け。", hue: CAT_COLOR.layout.c },
  { id: "leadform",   cat: "cv",     href: "/atelier/leadform",   tag: "CV · Lead",        brand: "トコハ住建",       poster: IMG + "photo-1632759145351-1d592919f522?auto=format&fit=crop&w=900&q=72", desc: "フォーム/LINE/電話/社会的証明。リフォーム/士業/高単価向け。", hue: CAT_COLOR.cv.c },
  { id: "salon",      cat: "core",   href: "https://salon-solna.vercel.app/",      tag: "Core · Lite",    brand: "hair salon SOLNA", poster: IMG + "photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=72", desc: "実店舗の軽量サイト（local-clean）。予約導線重視・最速。", hue: CAT_COLOR.core.c },
  { id: "aura",       cat: "core",   href: "https://aura-beta-snowy.vercel.app/",  tag: "Core · Premium", brand: "AURA fragrance",   poster: IMG + "photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=72", desc: "WebGL 3D + スクロール演出のブランド体験（premium-motion）。", hue: CAT_COLOR.core.c },
];

const FILTERS: { key: Cat; label: string }[] = [
  { key: "all",    label: "すべて" },
  { key: "3d",     label: "3D / WebGL" },
  { key: "layout", label: "レイアウト" },
  { key: "cv",     label: "コンバージョン" },
  { key: "core",   label: "コア" },
];

const STEPS = [
  { n: "01", t: "選ぶ",     d: "業種と目的から、最適な素地（3D/レイアウト/CV）を選定。すべて品質ゲート通過済み。" },
  { n: "02", t: "色替え",   d: "config 1ファイルで配色・コピー・OG/構造化データまで差し替え。10分で“その会社版”に。" },
  { n: "03", t: "出す",     d: "Vercel 即デプロイ。SEO/JSON-LD/モバイル対応すべて完備。先出しサンプルとして営業に。" },
];

const INDUSTRIES = [
  "美容室・サロン", "整体・接骨院", "歯科・クリニック", "カフェ・飲食", "パーソナルジム",
  "建築・不動産", "リフォーム・工務店", "コスメ・D2C", "SaaS・アプリ", "制作会社・スタジオ",
  "ハイジュエリー", "士業", "ウェルネス",
];

/* ===================== Page ===================== */

export default function AtelierPage() {
  const reduced = useReducedMotion();
  const [f, setF] = useState<Cat>("all");

  const items = useMemo(() => ITEMS.filter(i => f === "all" || i.cat === f), [f]);

  const counts = useMemo(() => ({
    all:    ITEMS.length,
    "3d":   ITEMS.filter(i => i.cat === "3d").length,
    layout: ITEMS.filter(i => i.cat === "layout").length,
    cv:     ITEMS.filter(i => i.cat === "cv").length,
    core:   ITEMS.filter(i => i.cat === "core").length,
  }), []);

  /* スクロール連動のヒーローパララックス */
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const blobY  = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 80]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <main style={{ background: "var(--background)", color: "var(--foreground)", overflowX: "hidden", fontFamily: 'var(--font-display), var(--font-sans-jp), "Noto Sans JP", system-ui, sans-serif', fontFeatureSettings: '"palt" 1' }}>
      {/* ========== HERO ========== */}
      <motion.section
        ref={heroRef}
        style={{ position: "relative", padding: "clamp(48px,8vw,120px) clamp(20px,5vw,56px) clamp(64px,10vw,140px)" }}
      >
        {/* ambient gradient blobs (no WebGL, light) */}
        {!reduced && (
          <>
            <motion.div
              aria-hidden
              style={{
                y: blobY, position: "absolute", inset: "-10% -15% auto auto",
                width: "min(60vw, 720px)", aspectRatio: "1/1", borderRadius: "50%",
                background: "radial-gradient(circle at 40% 40%, rgba(13,13,13,0.10), transparent 60%)",
                filter: "blur(48px)", opacity: .9, pointerEvents: "none",
              }}
            />
            <motion.div
              aria-hidden
              style={{
                y: blob2Y, position: "absolute", inset: "20% auto auto -10%",
                width: "min(52vw, 600px)", aspectRatio: "1/1", borderRadius: "50%",
                background: "radial-gradient(circle at 60% 60%, rgba(13,13,13,0.08), transparent 60%)",
                filter: "blur(60px)", opacity: .85, pointerEvents: "none",
              }}
            />
          </>
        )}

        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-2)" }}
          >
            <Link href="/" style={{ color: "var(--text-2)", textDecoration: "none" }}>Lakkan</Link>
            <span style={{ color: "var(--text-3)" }}>/</span>
            <span>Atelier</span>
          </motion.div>

          {/* タイトル：行ごとに reveal。1フォント1色で組版だけで強弱 */}
          <h1 style={{ marginTop: 16, fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontWeight: 500, fontSize: "clamp(48px,9vw,120px)", lineHeight: 0.96, letterSpacing: ".005em", color: "var(--foreground)" }}>
            <RevealLine delay={0.05}><span>WebGL &amp;</span></RevealLine>
            <RevealLine delay={0.15}><span>Layout Patterns</span></RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            style={{ maxWidth: "58ch", marginTop: 28, fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.9, color: "var(--text-2)" }}
          >
            Atelier は、Lakkan のサイト制作工房。<br />
            検証済みの素地から、その会社版を最短で組み上げます。
          </motion.p>

          <motion.div style={{ opacity: heroFade }}>
            {/* スタッツ */}
            <div style={{ marginTop: 48, display: "flex", flexWrap: "wrap", gap: "32px 56px" }}>
              {[
                { n: ITEMS.length, l: "Patterns", c: "var(--foreground)" },
                { n: counts["3d"], l: "3D / WebGL", c: "var(--foreground)" },
                { n: counts.layout, l: "Layout", c: "var(--foreground)" },
                { n: counts.cv, l: "Conversion", c: "var(--foreground)" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 + i * 0.07 }}
                >
                  <div style={{ fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontSize: "clamp(40px,5vw,64px)", fontWeight: 500, lineHeight: 1, color: s.c }}>{s.n}</div>
                  <div style={{ marginTop: 8, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text-3)" }}>{s.l}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              style={{ marginTop: 48, display: "flex", flexWrap: "wrap", gap: 12 }}
            >
              <a href="#grid"
                 style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 999, background: "var(--foreground)", color: "var(--background)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                ライブラリを見る
                <ArrowRight />
              </a>
              <Link href="/contact?topic=atelier-site"
                    style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", borderRadius: 999, background: "transparent", color: "var(--foreground)", fontSize: 14, fontWeight: 500, textDecoration: "none", border: "1px solid var(--border)" }}>
                Atelier で作る
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== TICKER ========== */}
      <Marquee />

      {/* ========== FILTERS + GRID ========== */}
      <section id="grid" style={{ padding: "clamp(60px,8vw,100px) clamp(20px,5vw,56px) clamp(80px,10vw,140px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead eyebrow="The Library" title="9 素地、すぐ出せる状態で。" />

          {/* Filters */}
          <nav
            style={{
              position: "sticky", top: 0, zIndex: 20, marginTop: 28,
              padding: "14px 0", display: "flex", flexWrap: "wrap", gap: 8,
              background: "color-mix(in oklab, var(--background) 88%, transparent)",
              backdropFilter: "blur(8px)",
            }}
          >
            {FILTERS.map(b => {
              const on = f === b.key;
              const n = (b.key === "all" ? counts.all : counts[b.key]);
              return (
                <button
                  key={b.key}
                  onClick={() => setF(b.key)}
                  style={{
                    padding: "9px 16px 9px 18px", borderRadius: 999,
                    background: on ? "var(--foreground)" : "var(--surface)",
                    color: on ? "var(--background)" : "var(--text-2)",
                    border: `1px solid ${on ? "var(--foreground)" : "var(--border)"}`,
                    fontSize: 13, letterSpacing: ".01em",
                    display: "inline-flex", alignItems: "center", gap: 8,
                    cursor: "pointer", transition: "all .25s ease",
                  }}
                >
                  {b.label}
                  <span style={{
                    minWidth: 22, padding: "2px 7px", borderRadius: 999, fontSize: 11,
                    background: on ? "color-mix(in oklab, var(--background) 18%, transparent)" : "var(--secondary)",
                    color: on ? "var(--background)" : "var(--text-3)",
                  }}>{n}</span>
                </button>
              );
            })}
          </nav>

          {/* Grid */}
          <motion.ul
            layout
            style={{
              marginTop: 28, listStyle: "none", padding: 0,
              display: "grid", gap: 24,
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((it, i) => (
                <PatternCard key={it.id} it={it} delay={i * 0.03} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section style={{ padding: "clamp(80px,10vw,140px) clamp(20px,5vw,56px)", background: "var(--secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead eyebrow="How it works" title="選ぶ、色を替える、出す。" />
          <div style={{ marginTop: 56, display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                style={{ padding: "32px 28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18 }}
              >
                <div style={{ fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontSize: 14, letterSpacing: ".18em", color: "var(--text-3)" }}>{s.n}</div>
                <div style={{ marginTop: 14, fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em" }}>{s.t}</div>
                <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.9, color: "var(--text-2)" }}>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOR WHO ========== */}
      <section style={{ padding: "clamp(80px,10vw,140px) clamp(20px,5vw,56px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionHead eyebrow="For whom" title="どんな業種でも、芯から。" />
          <p style={{ marginTop: 12, maxWidth: "52ch", fontSize: 15, lineHeight: 1.9, color: "var(--text-2)" }}>
            個別の業種に最適化されたカラー・3D・レイアウトのバリエーションを準備済み。
            合うものが無くても、素地ベースで30分以内に作り起こせます。
          </p>
          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {INDUSTRIES.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.025 }}
                style={{
                  padding: "8px 16px", borderRadius: 999, background: "var(--surface)",
                  border: "1px solid var(--border)", fontSize: 13, color: "var(--text-1)",
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section style={{ padding: "clamp(80px,10vw,140px) clamp(20px,5vw,56px)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text-3)" }}>Begin</p>
          <h2 style={{ marginTop: 18, fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontWeight: 500, fontSize: "clamp(36px,6vw,72px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            あなたのブランドに、<br />
            “すぐ出せる”を一つ。
          </h2>
          <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.9, color: "var(--text-2)", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
            素地を選び、配色とコピーを差し替え、そのまま納品。Lakkan の Atelier が、最初の一手を最短にします。
          </p>
          <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/contact?topic=atelier-site"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 999, background: "var(--foreground)", color: "var(--background)", fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
              Atelier に依頼する <ArrowRight />
            </Link>
            <a href="#grid"
               style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 999, color: "var(--foreground)", fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1px solid var(--border)" }}>
              ライブラリを見る
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOT ========== */}
      <footer style={{ padding: "36px clamp(20px,5vw,56px)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontSize: 12, color: "var(--text-3)" }}>
          <span style={{ fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontSize: 15, letterSpacing: ".06em", color: "var(--text-2)" }}>Lakkan · Atelier</span>
          <span>© 2026 楽観 / Lakkan ｜ WebGL &amp; Layout Patterns</span>
        </div>
      </footer>
    </main>
  );
}

/* ===================== Sub-components ===================== */

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span style={{ display: "block", overflow: "hidden", lineHeight: 0.98 }}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--text-3)" }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginTop: 12, fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontWeight: 500, fontSize: "clamp(30px,4.5vw,52px)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

function PatternCard({ it, delay }: { it: Item; delay: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <Link
        href={it.href}
        target={it.href.startsWith("http") ? "_blank" : undefined}
        rel={it.href.startsWith("http") ? "noopener" : undefined}
        className="group"
        style={{
          display: "block", overflow: "hidden", borderRadius: 20,
          background: "var(--surface)", border: "1px solid var(--border)",
          textDecoration: "none", color: "inherit",
          transition: "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s, border-color .45s",
        }}
      >
        <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
          {/* 上端ライン：ホバーで全幅に */}
          <span
            aria-hidden
            style={{
              position: "absolute", top: 0, left: 0, height: 2, width: 48, zIndex: 2,
              background: "var(--foreground)", transformOrigin: "0 0",
              transition: "width .5s cubic-bezier(.22,1,.36,1)",
            }}
            className="cat-bar"
          />
          {/* タグ */}
          <span
            style={{
              position: "absolute", top: 14, left: 14, zIndex: 3,
              padding: "5px 11px", borderRadius: 999, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
              background: "color-mix(in oklab, var(--foreground) 82%, transparent)", color: "var(--background)",
              backdropFilter: "blur(6px)",
            }}
          >
            {it.tag}
          </span>
          {/* poster */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.poster}
            alt={`${it.brand} のイメージ`}
            loading="lazy"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              transition: "transform .9s cubic-bezier(.22,1,.36,1), filter .6s",
              filter: "saturate(0.95)",
            }}
            className="poster"
          />
          {/* 下方フェード：ホバーで濃く（単色） */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "linear-gradient(180deg, transparent 50%, rgba(13,13,13,0.18))",
              opacity: 0, transition: "opacity .5s ease",
            }}
            className="cat-glow"
          />
        </div>
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 }}>
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: "-0.005em" }}>{it.id}</div>
            <div style={{ fontSize: 12, letterSpacing: ".06em", color: "var(--text-3)" }}>{it.brand}</div>
          </div>
          <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.75, color: "var(--text-2)" }}>{it.desc}</p>
          <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
            フルで見る
            <span className="card-arrow" style={{ display: "inline-flex", transition: "transform .35s ease" }}>
              <ArrowRight />
            </span>
          </div>
        </div>
      </Link>

      <style jsx>{`
        :global(.group:hover) {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px -28px rgba(13, 13, 13, 0.25);
          border-color: var(--border-hover);
        }
        :global(.group:hover .cat-bar) { width: 100%; }
        :global(.group:hover .poster)  { transform: scale(1.06); filter: saturate(1.05); }
        :global(.group:hover .cat-glow){ opacity: 1; }
        :global(.group:hover .card-arrow){ transform: translateX(4px); }
      `}</style>
    </motion.li>
  );
}

function Marquee() {
  const words = ["Lakkan", "Atelier", "WebGL", "Layout", "Conversion", "2026", "ライトの上で動かす"];
  return (
    <div
      style={{
        position: "relative", overflow: "hidden",
        borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        padding: "22px 0",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          display: "flex", gap: 56, whiteSpace: "nowrap",
          fontFamily: 'var(--font-frank), var(--font-mincho), "Shippori Mincho", "Noto Serif JP", serif', fontSize: "clamp(28px,4vw,52px)", fontWeight: 500,
          letterSpacing: "-0.01em",
          animation: "atelier-marquee 32s linear infinite",
        }}
      >
        {[0, 1].map(loop => (
          <div key={loop} style={{ display: "flex", gap: 56, flexShrink: 0 }}>
            {words.map((w, i) => (
              <span key={`${loop}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 56 }}>
                <span style={{ color: i % 2 ? "var(--text-3)" : "var(--foreground)" }}>{w}</span>
                <Dot />
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes atelier-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes atelier-marquee { from { transform: translateX(0); } to { transform: translateX(0); } }
        }
      `}</style>
    </div>
  );
}

function Dot() {
  return (
    <svg width="6" height="6" viewBox="0 0 10 10" aria-hidden>
      <circle cx="5" cy="5" r="3" fill="var(--text-3)" />
    </svg>
  );
}
