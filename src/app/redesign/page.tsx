"use client";

import { useEffect, useRef } from "react";
import s from "./page.module.css";
import { initLiquid } from "./liquid";

// 沿革は About.tsx の TIMELINE が正本（改変・追加禁止）。ここはその写し。
const TIMELINE = [
  { year: "2023", text: "合同会社Sinple 設立 → 売却", note: "最初の起業と、最初の出口。" },
  { year: "2024", text: "株式会社Solve 設立", note: "二度目の創業。課題解決に特化した事業を動かす。" },
  { year: "2025.09", text: "トレプロ株式会社 執行役員 就任（東証グロース上場）", note: "上場グループの経営に参画。組織とスピードを同時に動かす。" },
  { year: "2026.02", text: "トレプロ株式会社 COO 就任", note: "経営の座へ。スピードと構造を両立する立場に。" },
  { year: "2026.03", text: "株式会社Lakkan 始動", note: "楽観と、計画と。自分の言葉で走りはじめる。" },
  { year: "2026.04", text: "SKYLINK CTO 就任 / KANOA AI 外部相談役 就任", note: "技術選定と、外からの第三者視点。同時に。" },
  { year: "2026.05", text: "株式会社Lakkan 法人登記完了（5/11）", note: "ペンを取った瞬間、楽観が法人になった。" },
  { year: "2026.06", text: "LunaTech 法人ローンチ予定（6/16） — COO 就任", note: "AIプロダクト 5本立て。プランナー / ベース / AIラボ / ソラリス / かぐや・みこと。" },
];

export default function Redesign() {
  const gl1 = useRef<HTMLCanvasElement>(null);
  const gl2 = useRef<HTMLCanvasElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disposers: Array<() => void> = [];

    // 液体シェーダー（hero=湧き上がり開幕 / end=即時）
    if (gl1.current) disposers.push(initLiquid(gl1.current, 0.0, reduce ? 0 : 1800));
    if (gl2.current) disposers.push(initLiquid(gl2.current, 12.7, 0));

    // スクロール進捗バー
    const onScroll = () => {
      const h = document.documentElement;
      if (progRef.current) progRef.current.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver リビール
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(s.inview); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>("." + s.reveal).forEach((el) => io.observe(el));
    const heroRevealTimer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("." + s.hero + " ." + s.reveal).forEach((e) => e.classList.add(s.inview));
    }, reduce ? 0 : 780);

    // ネイティブスクロール（慣性スクロールは使わない＝操作はユーザーが直接）。GSAP演出のみ。
    let cleanupGsap: (() => void) | null = null;
    if (!reduce) {
      (async () => {
        const [gsapMod, stMod] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        const gsap = gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.to("." + s.heroIn, { yPercent: -16, opacity: 0, ease: "none", scrollTrigger: { trigger: "." + s.hero, start: "top top", end: "bottom top", scrub: true } });
          gsap.to("." + s.gl, { yPercent: 10, ease: "none", scrollTrigger: { trigger: "." + s.hero, start: "top top", end: "bottom top", scrub: true } });
          gsap.fromTo("." + s.hrow, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: "#history", start: "top 80%" } });
          gsap.fromTo("." + s.wrow, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.13, scrollTrigger: { trigger: "#work", start: "top 72%" } });
          gsap.to("." + s.manifesto + " p", { yPercent: -8, ease: "none", scrollTrigger: { trigger: "." + s.manifesto, start: "top bottom", end: "bottom top", scrub: true } });
        });
        cleanupGsap = () => { ctx.revert(); };
      })();
    } else {
      document.querySelectorAll<HTMLElement>("." + s.wrow + ", ." + s.hrow).forEach((e) => (e.style.opacity = "1"));
    }

    return () => {
      disposers.forEach((d) => d());
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      clearTimeout(heroRevealTimer);
      cleanupGsap?.();
      lenis?.destroy();
    };
  }, []);

  return (
    <div className={s.page}>
      <div className={s.prog} ref={progRef} />

      <header className={s.nav}>
        <div className={s.inner}>
          <div className={s.logo}>Lakkan</div>
          <span className={s.navsp} />
          <a className={s.m} href="#work">Works</a>
          <a className={s.m} href="#svc">Services</a>
          <a className={s.m} href="#end">Contact</a>
        </div>
      </header>

      <section className={s.hero}>
        <canvas className={s.gl} ref={gl1} />
        <div className={s.veil} />
        <div className={s.heroIn}>
          <div className={s.wrap}>
            <div className={`${s.ey} ${s.lbl} ${s.reveal}`}>Lakkan Inc. &nbsp;—&nbsp; AI Company &nbsp;/&nbsp; Tokyo, 2026</div>
            <h1 className={`${s.reveal} ${s.d1}`}>事業を、<br /><span className={s.thin}>AIで</span>再設計する。</h1>
            <p className={`${s.sub} ${s.reveal} ${s.d2}`}>ツールを足すだけでは、会社は変わらない。<br />変わるのは、設計そのものを変えた時だけ。</p>
          </div>
        </div>
        <div className={s.foot}>
          <a className={`${s.cta} ${s.reveal} ${s.d3}`} href="#end">相談する</a>
          <span className={`${s.scrollcue} ${s.reveal} ${s.d3}`}>Scroll</span>
        </div>
      </section>

      <section className={s.manifesto}>
        <div className={s.wrap}>
          <p className={s.reveal}>ツールではなく、<span className={s.o}>設計</span>を。<br />私たちは、自社で毎日それを<br />証明している。</p>
          <div className={`${s.small} ${s.reveal} ${s.d1}`}>1人 × AI で、6社を回す。その仕組みを、あなたの会社へ。</div>
        </div>
      </section>

      <section className={s.blk} id="history" style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.reveal}`}><h2>歩み</h2><span className={s.lbl}>History — 楽観と、計画と</span></div>
          {TIMELINE.map((t) => (
            <div className={s.hrow} key={t.year}>
              <span className={s.hy}>{t.year}</span>
              <span className={s.ht}>{t.text}</span>
              <span className={s.hn}>{t.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={s.blk} id="work">
        <div className={s.wrap}>
          <div className={`${s.head} ${s.reveal}`}><h2>実績</h2><span className={s.lbl}>Selected Works — 55+</span></div>
          <div className={s.wrow}><a className={s.work} href="#"><span className={s.no}>01</span><div className={s.ti}>採用DXプラットフォーム</div><span className={s.ta}>HR &nbsp;/&nbsp; Product</span></a></div>
          <div className={s.wrow}><a className={s.work} href="#"><span className={s.no}>02</span><div className={s.ti}>経営ダッシュボード</div><span className={s.ta}>SaaS &nbsp;/&nbsp; Data</span></a></div>
          <div className={s.wrow}><a className={s.work} href="#"><span className={s.no}>03</span><div className={s.ti}>AIエージェント基盤</div><span className={s.ta}>Agent &nbsp;/&nbsp; Infra</span></a></div>
          <div className={s.wrow}><a className={s.work} href="#"><span className={s.no}>04</span><div className={s.ti}>競合インテリジェンス</div><span className={s.ta}>Research &nbsp;/&nbsp; Automation</span></a></div>
        </div>
      </section>

      <section className={s.blk} id="svc" style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.reveal}`}><h2>頼めること</h2><span className={s.lbl}>Services</span></div>
          <div className={`${s.svc} ${s.reveal} ${s.d1}`}>
            <div className={s.c}><div className={s.no}>01</div><h3>AI事業再設計</h3><p>業務とフローをAI前提で組み直す。属人化を、再現性のある仕組みへ。</p><div className={s.out}>1人で回る体制</div></div>
            <div className={s.c}><div className={s.no}>02</div><h3>受託開発</h3><p>LP・アプリ・社内ツールをバイブコーディングで。数週間を、数日に。</p><div className={s.out}>速度と原価</div></div>
            <div className={s.c}><div className={s.no}>03</div><h3>採用DX・自動化</h3><p>採用・議事録・分析・発信をエージェント化。人がやめるべき作業を渡す。</p><div className={s.out}>時間が戻る</div></div>
          </div>
        </div>
      </section>

      <section className={s.proof}>
        <div className={s.wrap}>
          <div className={`${s.lbl} ${s.reveal}`}>Why Lakkan</div>
          <p className={`${s.lead} ${s.reveal} ${s.d1}`}>提案書は、誰でも書ける。<br />私たちは、自社で毎日<br />動かしている。</p>
          <div className={`${s.grid} ${s.reveal} ${s.d2}`}>
            <div><div className={s.n}>55<span className={s.o}>+</span></div><div className={s.l}>構築したプロダクト</div></div>
            <div><div className={s.n}>6<span className={s.o}>社</span></div><div className={s.l}>1人＋AIで運営</div></div>
            <div><div className={s.n}>毎日</div><div className={s.l}>AIがshipする</div></div>
            <div><div className={s.n}>&apos;26</div><div className={s.l}>設立年（3月）</div></div>
          </div>
        </div>
      </section>

      <section className={s.end} id="end">
        <canvas className={s.gl2} ref={gl2} />
        <div className={s.endIn}>
          <h2>会社を、<br />AIで再設計する。</h2>
          <a className={s.cta2} href="/contact">無料で相談する</a>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.fgrid}`}>
          <div><div className={s.logo}>Lakkan</div><div>株式会社Lakkan — LUCK × 楽観<br />東京都渋谷区神宮前6-23-4</div></div>
          <div style={{ textAlign: "right" }}><b>s-yamanaka@tre-pro.co.jp</b><br />Vigil AI / トレプロ / LunaTech / SKYLINK / KANOA / Solve</div>
        </div>
      </footer>
    </div>
  );
}
