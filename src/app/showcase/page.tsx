"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { COMPANIES, TOTAL_ITEMS, ACTIVE_ITEMS, FEATURED_ITEMS, CATEGORY_META, type Company, type ShowcaseItem, type ShowcaseCategory } from "@/data/showcase";

const ACCENT = "#06B6D4";
const INK = "#0F1419";
const BG = "#FAFAF8";
const SURFACE = "#FFFFFF";
const BORDER = "#E8E6DF";
const MUTED = "#6B6F76";
const SUBTLE = "#9CA0A8";

export default function ShowcasePage() {
  const [openCompany, setOpenCompany] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ShowcaseCategory | "all">("all");
  const [previewMode, setPreviewMode] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  // Animated number counter
  useEffect(() => {
    const duration = 1100;
    const target = ACTIVE_ITEMS;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedCount(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Stats
  const categoryStats = useMemo(() => {
    const s: Record<string, number> = {};
    COMPANIES.forEach(c => c.items.forEach(i => { s[i.category] = (s[i.category] || 0) + 1; }));
    return s;
  }, []);

  const matchQuery = (i: ShowcaseItem) => {
    if (!q) return true;
    return `${i.name} ${i.tagline} ${i.desc} ${i.id}`.toLowerCase().includes(q.toLowerCase());
  };
  const matchCategory = (i: ShowcaseItem) => categoryFilter === "all" || i.category === categoryFilter;
  const totalVisible = useMemo(
    () => COMPANIES.reduce((sum, c) => sum + c.items.filter(i => matchQuery(i) && matchCategory(i)).length, 0),
    [q, categoryFilter]
  );

  return (
    <main style={{ background: BG, color: INK }}>
      <style jsx global>{`
        :root { --accent: ${ACCENT}; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes shimmer { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
        .fade-up { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .grid-bg {
          background-image:
            linear-gradient(${BORDER}55 1px, transparent 1px),
            linear-gradient(90deg, ${BORDER}55 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
        }
        body { font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle at 85% 15%, ${ACCENT}10 0%, transparent 50%), radial-gradient(circle at 15% 90%, #F1090315 0%, transparent 50%)`
        }} />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-20 relative">
          <div className="inline-flex items-center gap-2 mb-10 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-[0.12em] backdrop-blur-sm"
               style={{ background: `${SURFACE}cc`, color: ACCENT, border: `1px solid ${ACCENT}25` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, animation: "shimmer 2.5s infinite" }} />
            <span>SHOWCASE · 山中秀斗 / Shuto Yamanaka</span>
          </div>

          <h1 className="font-bold tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(44px, 7vw, 96px)", letterSpacing: "-0.03em" }}>
            AIで作って、<br />
            いま動いてる<br />
            <span className="inline-flex items-baseline">
              <span className="tabular-nums" style={{ color: ACCENT }}>{animatedCount}</span>
              <span className="text-[0.6em] ml-2" style={{ color: INK }}>個。</span>
            </span>
          </h1>

          <p className="mt-8 text-[16px] md:text-[19px] leading-[1.8] max-w-[640px]" style={{ color: MUTED }}>
            6社・採用LPから経営ダッシュボードまで。
            <br />
            <span style={{ color: INK }}>「AIで何ができるか」が、見れば全部わかる。</span>
          </p>

          {/* Stats inline */}
          <div className="mt-14 flex flex-wrap gap-8 md:gap-12">
            {[
              { label: "Active", value: ACTIVE_ITEMS },
              { label: "Companies", value: COMPANIES.length },
              { label: "Categories", value: Object.keys(categoryStats).length },
              { label: "Featured", value: FEATURED_ITEMS.length },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[44px] md:text-[56px] font-bold leading-none tabular-nums" style={{ letterSpacing: "-0.03em" }}>
                  {s.value}
                </div>
                <div className="mt-2 text-[10.5px] font-mono tracking-[0.18em] uppercase" style={{ color: SUBTLE }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      <section style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-24">
          <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 text-[11px] font-mono tracking-[0.16em] uppercase" style={{ color: ACCENT }}>
                <span className="w-6 h-px" style={{ background: ACCENT }} />
                Featured
              </div>
              <h2 className="font-bold tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                商談で<span style={{ color: ACCENT }}>真っ先に</span>見せる<br className="md:hidden" />
                <span className="tabular-nums">{FEATURED_ITEMS.length}</span> 個
              </h2>
            </div>
            <p className="text-[14px] max-w-[420px]" style={{ color: MUTED }}>
              このグリッドだけ見れば「うちは何でも作れる」が伝わる。クリックで実物が新タブで開く。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_ITEMS.map((item, i) => (
              <FeaturedCard key={item.id} item={item} delay={i * 50} previewMode={previewMode} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STICKY FILTER ─── */}
      <section className="sticky top-0 z-40 backdrop-blur-xl" style={{ background: `${BG}f5`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[11px] font-mono tracking-[0.14em] uppercase" style={{ color: SUBTLE }}>
                <span className="tabular-nums text-[14px]" style={{ color: INK }}>{totalVisible}</span> / {ACTIVE_ITEMS}
              </span>
            </div>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="プロダクト名・説明で検索"
              className="flex-1 px-4 py-2.5 rounded-full text-[14px] outline-none transition-colors"
              style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
              onFocus={(e) => (e.target.style.borderColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderColor = BORDER)}
            />
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 rounded-full text-[11px] font-mono tracking-[0.12em] transition-all flex-shrink-0"
              style={{
                background: previewMode ? INK : SURFACE,
                color: previewMode ? "#fff" : MUTED,
                border: `1px solid ${previewMode ? INK : BORDER}`,
              }}
            >
              {previewMode ? "PREVIEW · ON" : "PREVIEW · OFF"}
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pt-3 -mx-1 px-1">
            <CategoryChip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} label="すべて" count={ACTIVE_ITEMS} />
            {(Object.keys(CATEGORY_META) as ShowcaseCategory[]).map(cat => {
              const count = categoryStats[cat] || 0;
              if (count === 0) return null;
              return <CategoryChip key={cat} active={categoryFilter === cat} onClick={() => setCategoryFilter(cat)} label={CATEGORY_META[cat].label} count={count} />;
            })}
          </div>
        </div>
      </section>

      {/* ─── COMPANIES ─── */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 space-y-4">
          {COMPANIES.map((c, i) => (
            <CompanyAccordion
              key={c.id}
              company={c}
              index={i}
              isOpen={openCompany === c.id}
              onToggle={() => setOpenCompany(openCompany === c.id ? null : c.id)}
              matchQuery={matchQuery}
              matchCategory={matchCategory}
              previewMode={previewMode}
            />
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-12">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <div>
              <div className="text-[28px] font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Showcase
              </div>
              <div className="mt-2 text-[12px] font-mono" style={{ color: MUTED }}>
                山中秀斗 / Shuto Yamanaka · Allen
              </div>
            </div>
            <div className="flex gap-6 text-[12px] font-mono">
              <Link href="/" className="hover:underline transition-colors" style={{ color: INK }}>Lakkan ↗</Link>
              <a href="https://vigil-vert-gamma.vercel.app" target="_blank" rel="noopener" className="hover:underline" style={{ color: INK }}>Vigil ↗</a>
              <a href="https://vigil-playbook.vercel.app" target="_blank" rel="noopener" className="hover:underline" style={{ color: INK }}>Playbook ↗</a>
              <a href="https://nowonair.vercel.app/" target="_blank" rel="noopener" className="hover:underline" style={{ color: INK }}>Now on AIr ↗</a>
            </div>
          </div>
          <div className="pt-6 border-t flex items-center justify-between flex-wrap gap-3 text-[10.5px] font-mono" style={{ borderColor: BORDER, color: SUBTLE }}>
            <span>© 2026 Lakkan Inc. · Designed & Coded with AI</span>
            <span>SHOWCASE · {ACTIVE_ITEMS} ACTIVE PRODUCTS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── COMPONENTS ─── */

function CategoryChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[12px] font-mono whitespace-nowrap transition-all"
      style={{
        background: active ? INK : "transparent",
        color: active ? "#fff" : MUTED,
        border: `1px solid ${active ? INK : BORDER}`,
      }}
    >
      {label} <span className="opacity-50 ml-0.5 tabular-nums">{count}</span>
    </button>
  );
}

function FeaturedCard({
  item,
  delay,
  previewMode,
}: { item: ShowcaseItem & { company: string; accent: string }; delay: number; previewMode: boolean }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="fade-up group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 3px rgba(15,20,25,0.04)",
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = item.accent;
        e.currentTarget.style.boxShadow = `0 16px 36px ${item.accent}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,20,25,0.04)";
      }}
    >
      {/* Visual top — gradient or iframe preview */}
      <div className="relative aspect-[16/10] overflow-hidden" style={{
        background: `linear-gradient(135deg, ${item.accent}18 0%, ${item.accent}05 60%, transparent 100%)`
      }}>
        {previewMode && (
          <iframe
            src={item.url}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
          />
        )}
        {/* Big initial letter */}
        {!previewMode && (
          <div
            className="absolute top-4 right-4 text-[80px] font-bold leading-none opacity-20"
            style={{ color: item.accent, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.05em" }}
          >
            {item.name.charAt(0)}
          </div>
        )}
        {/* Bottom-left labels */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none">
          <div className="text-[10px] font-mono tracking-[0.14em] uppercase mb-1.5" style={{ color: item.accent }}>
            {item.company} · {CATEGORY_META[item.category].label}
          </div>
          <h3 className="text-[22px] md:text-[24px] font-bold leading-tight tracking-tight" style={{ color: INK, letterSpacing: "-0.02em" }}>
            {item.name}
          </h3>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {item.gated && (
            <span className="text-[9px] font-mono tracking-[0.12em] px-2 py-0.5 rounded-full uppercase backdrop-blur-sm"
                  style={{ background: "#FBF7E8", color: "#8B7000", border: "1px solid #E8D9B0" }}>
              GATE
            </span>
          )}
        </div>
        {/* Open hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-mono tracking-[0.14em] px-3 py-1.5 rounded-full"
               style={{ background: INK, color: "#fff" }}>
            OPEN ↗
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 border-t" style={{ borderColor: BORDER }}>
        <p className="text-[13px] leading-relaxed mb-2" style={{ color: MUTED }}>
          {item.tagline}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10.5px] font-mono truncate" style={{ color: SUBTLE }}>
            {item.url.replace(/^https?:\/\//, "")}
          </span>
          {item.metric && (
            <span className="text-[10px] font-mono tracking-[0.08em] flex-shrink-0" style={{ color: item.accent }}>
              {item.metric}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function CompanyAccordion({
  company,
  index,
  isOpen,
  onToggle,
  matchQuery,
  matchCategory,
  previewMode,
}: {
  company: Company;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  matchQuery: (i: ShowcaseItem) => boolean;
  matchCategory: (i: ShowcaseItem) => boolean;
  previewMode: boolean;
}) {
  const filtered = company.items.filter(i => matchQuery(i) && matchCategory(i));

  const byCategory = useMemo(() => {
    const groups: Record<string, ShowcaseItem[]> = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  if (filtered.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all fade-up"
      style={{
        background: SURFACE,
        border: `1px solid ${isOpen ? company.accent : BORDER}`,
        boxShadow: isOpen ? `0 8px 28px ${company.accent}18` : "0 1px 2px rgba(15,20,25,0.03)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 md:px-8 py-6 flex items-center justify-between gap-6 transition-colors"
        style={{ background: isOpen ? `${company.accent}05` : SURFACE }}
      >
        <div className="flex items-center gap-5 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-[20px]"
            style={{ background: `${company.accent}15`, color: company.accent, letterSpacing: "-0.02em" }}
          >
            {company.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                {company.name}
              </h3>
              <span className="text-[10px] font-mono tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `${company.accent}12`, color: company.accent, border: `1px solid ${company.accent}25` }}>
                {company.role}
              </span>
            </div>
            <p className="text-[13px] truncate" style={{ color: MUTED }}>
              {company.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="text-right">
            <div className="text-[22px] font-bold tabular-nums leading-none" style={{ letterSpacing: "-0.02em" }}>
              {filtered.length}
            </div>
            <div className="mt-1 text-[10px] font-mono tracking-[0.12em] uppercase" style={{ color: SUBTLE }}>
              Products
            </div>
          </div>
          <span
            className="text-[14px] transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", color: company.accent }}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${company.accent}15` }}>
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat} className="px-6 md:px-8 py-7 border-b last:border-b-0" style={{ borderColor: BORDER }}>
              <div className="flex items-baseline gap-3 mb-5">
                <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: company.accent }} />
                <h4 className="text-[12px] font-mono tracking-[0.16em] uppercase font-semibold">
                  {CATEGORY_META[cat as ShowcaseCategory].label}
                </h4>
                <span className="text-[11px]" style={{ color: SUBTLE }}>
                  {CATEGORY_META[cat as ShowcaseCategory].desc}
                </span>
                <span className="text-[11px] font-mono ml-auto tabular-nums" style={{ color: MUTED }}>
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(item => (
                  <ItemCard key={item.id} item={item} accent={company.accent} previewMode={previewMode} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, accent, previewMode }: { item: ShowcaseItem; accent: string; previewMode: boolean }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: BG,
        border: `1px solid ${BORDER}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.background = SURFACE;
        e.currentTarget.style.boxShadow = `0 12px 28px ${accent}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.background = BG;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {previewMode && (
        <div className="relative aspect-[16/9] overflow-hidden border-b" style={{ borderColor: BORDER }}>
          <iframe
            src={item.url}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="absolute inset-0 pointer-events-none"
            style={{ transform: "scale(0.4)", transformOrigin: "top left", width: "250%", height: "250%" }}
          />
        </div>
      )}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h5 className="text-[14.5px] font-semibold tracking-tight truncate" style={{ letterSpacing: "-0.01em" }}>
            {item.name}
          </h5>
          <div className="flex items-center gap-1 flex-shrink-0">
            {item.gated && (
              <span className="text-[9px] font-mono tracking-[0.1em] px-1.5 py-0.5 rounded uppercase"
                    style={{ background: "#FBF7E8", color: "#8B7000", border: "1px solid #E8D9B0" }}>
                GATE
              </span>
            )}
            {item.featured && (
              <span className="text-[9px] font-mono tracking-[0.1em] px-1.5 py-0.5 rounded uppercase"
                    style={{ background: `${accent}15`, color: accent }}>
                FEAT
              </span>
            )}
          </div>
        </div>
        <p className="text-[12px] leading-snug mb-3" style={{ color: MUTED }}>
          {item.tagline}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono truncate" style={{ color: SUBTLE }}>
            {item.url.replace(/^https?:\/\//, "")}
          </span>
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: accent }}>
            OPEN ↗
          </span>
        </div>
      </div>
    </a>
  );
}
