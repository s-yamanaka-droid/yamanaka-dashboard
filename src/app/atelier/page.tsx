"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Cat = "all" | "3d" | "layout" | "cv" | "core";

type Item = {
  id: string;
  cat: Exclude<Cat, "all">;
  href: string;
  tag: string;
  brand: string;
  desc: string;
  poster: string;
};

const IMG = "https://images.unsplash.com/";

const ITEMS: Item[] = [
  { id: "particles",  cat: "3d",     href: "/atelier/particles",  tag: "3D · Particles",   brand: "RESONA STUDIO",   poster: IMG + "photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=72", desc: "マウスに反応する粒子フィールド。音響/テック/クリエイティブ向け。" },
  { id: "fluid",      cat: "3d",     href: "/atelier/fluid",      tag: "3D · Fluid",       brand: "Liora Atelier",   poster: IMG + "photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=72", desc: "淡いパステルの流体グラデーション。コスメ/サロン/D2C向け。" },
  { id: "terrain",    cat: "3d",     href: "/atelier/terrain",    tag: "3D · Terrain",     brand: "TERRA NOSU",      poster: IMG + "photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=72", desc: "波打つワイヤーフレーム地形。建築/不動産/リゾート向け。" },
  { id: "saas",       cat: "layout", href: "/atelier/saas",       tag: "Layout · SaaS",    brand: "Flowdesk",        poster: IMG + "photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=72", desc: "機能/料金/FAQ/事例まで揃ったSaaS・アプリLP素地。" },
  { id: "portfolio",  cat: "layout", href: "/atelier/portfolio",  tag: "Layout · Studio",  brand: "STUDIO HARUKAZE", poster: IMG + "photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=72", desc: "編集的な大タイポと作品グリッド。制作会社/クリエイター向け。" },
  { id: "restaurant", cat: "layout", href: "/atelier/restaurant", tag: "Layout · Food",    brand: "日和テーブル",     poster: IMG + "photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=72", desc: "メニュー/予約/ギャラリー/アクセス。飲食/ホテル向け。" },
  { id: "leadform",   cat: "cv",     href: "/atelier/leadform",   tag: "CV · Lead",        brand: "トコハ住建",       poster: IMG + "photo-1632759145351-1d592919f522?auto=format&fit=crop&w=900&q=72", desc: "フォーム/LINE/電話/社会的証明。リフォーム/士業/高単価向け。" },
  { id: "salon",      cat: "core",   href: "https://salon-solna.vercel.app/",    tag: "Core · Lite",    brand: "hair salon SOLNA", poster: IMG + "photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=72", desc: "実店舗の軽量サイト（local-clean）。予約導線重視・最速。" },
  { id: "aura",       cat: "core",   href: "https://aura-beta-snowy.vercel.app/", tag: "Core · Premium", brand: "AURA fragrance",   poster: IMG + "photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=72", desc: "WebGL 3D + スクロール演出のブランド体験（premium-motion）。" },
];

const FILTERS: { key: Cat; label: string }[] = [
  { key: "all",    label: "すべて" },
  { key: "3d",     label: "3D / WebGL" },
  { key: "layout", label: "レイアウト" },
  { key: "cv",     label: "コンバージョン" },
  { key: "core",   label: "コア2種" },
];

export default function AtelierPage() {
  const [f, setF] = useState<Cat>("all");
  const items = useMemo(() => ITEMS.filter(i => f === "all" || i.cat === f), [f]);

  const counts = useMemo(() => ({
    all:    ITEMS.length,
    "3d":    ITEMS.filter(i => i.cat === "3d").length,
    layout: ITEMS.filter(i => i.cat === "layout").length,
    cv:     ITEMS.filter(i => i.cat === "cv").length,
    core:   ITEMS.filter(i => i.cat === "core").length,
  }), []);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="mx-auto" style={{ maxWidth: 1240, padding: "clamp(40px,6vw,80px) clamp(20px,5vw,56px)" }}>
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-[12px] tracking-[.18em] uppercase" style={{ color: "var(--text-2)" }}>
            <Link href="/" style={{ color: "var(--text-2)" }} className="hover:opacity-80 transition">Lakkan</Link>
            <span style={{ color: "var(--text-3)" }}>/</span>
            <span>Atelier</span>
          </div>
          <h1 className="mt-3" style={{ fontFamily: "var(--font-frank)", fontWeight: 500, fontSize: "clamp(40px,7vw,84px)", lineHeight: 1.04, letterSpacing: ".005em" }}>
            WebGL &amp; Layout <em style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "var(--terra)" }}>Patterns</em>
          </h1>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.9]" style={{ color: "var(--text-2)" }}>
            Lakkan が積み上げているサイトの素地ライブラリ。WebGL 3D・高品質LP/HPレイアウト・コンバージョン素地を、ライトテーマ・1ファイル完結・SEO/構造化データ完備で揃えています。配色とコピーを差し替えれば数分で“その会社版”になります。
          </p>

          {/* stats */}
          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { n: ITEMS.length, l: "Patterns" },
              { n: counts["3d"], l: "3D / WebGL" },
              { n: counts.layout, l: "Layout" },
              { n: counts.cv, l: "Conversion" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "var(--font-frank)", fontSize: 36, fontWeight: 500, lineHeight: 1 }}>{s.n}</div>
                <div className="mt-1 text-[11px] tracking-[.18em] uppercase" style={{ color: "var(--text-3)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Filters */}
        <nav className="sticky top-0 z-10 -mx-2 px-2 py-3 flex flex-wrap gap-2 backdrop-blur-sm"
             style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}>
          {FILTERS.map(b => {
            const on = f === b.key;
            return (
              <button
                key={b.key}
                onClick={() => setF(b.key)}
                className="px-4 py-2 rounded-full text-[13px] transition"
                style={{
                  background: on ? "var(--foreground)" : "var(--surface)",
                  color: on ? "var(--background)" : "var(--text-2)",
                  border: `1px solid ${on ? "var(--foreground)" : "var(--border)"}`,
                }}
              >
                {b.label}
              </button>
            );
          })}
        </nav>

        {/* Grid */}
        <ul className="mt-6 grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {items.map(it => (
            <li key={it.id}>
              <Link
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel={it.href.startsWith("http") ? "noopener" : undefined}
                className="group block overflow-hidden rounded-2xl transition"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "var(--secondary)", borderBottom: "1px solid var(--border)" }}>
                  <span
                    className="absolute left-3 top-3 z-[2] text-[11px] tracking-[.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur"
                    style={{ background: "color-mix(in oklab, var(--foreground) 82%, transparent)", color: "var(--background)" }}
                  >
                    {it.tag}
                  </span>
                  {/* poster — lazy, fast */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.poster}
                    alt={`${it.brand} のイメージ`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-5 pt-4 pb-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[15px] font-semibold tracking-tight">{it.id}</div>
                    <div className="text-[12px]" style={{ color: "var(--terra)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>{it.brand}</div>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: "var(--text-2)" }}>{it.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium transition group-hover:gap-2.5" style={{ color: "var(--foreground)" }}>
                    フルで見る
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* foot */}
        <footer className="mt-20 pt-8 flex flex-wrap items-center justify-between gap-3 text-[12px]" style={{ borderTop: "1px solid var(--border)", color: "var(--text-3)" }}>
          <span style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 16, color: "var(--text-2)" }}>Lakkan · Atelier</span>
          <span>© 2026 楽観 / Lakkan ｜ WebGL &amp; Layout Patterns</span>
        </footer>
      </div>
    </main>
  );
}
