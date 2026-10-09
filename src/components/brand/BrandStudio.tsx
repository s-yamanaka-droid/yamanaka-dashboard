"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, Copy, Download, Glasses, Menu, Pause, Play, X } from "lucide-react";
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { channels, lakkanPrinciples, repairPrompt, starterPrompt, voiceRules, workCycle } from "@/data/brand-book";
import BrandLibrary from "./BrandLibrary";
import { useBrandReducedMotion } from "./useBrandReducedMotion";
import "./brand-studio.css";

const chapters = [
  ["world", "世界観", "The world"],
  ["concept", "コンセプト", "The idea"],
  ["voice", "ことばと人格", "Tone of voice"],
  ["experiment", "試して、直す", "The practice"],
  ["sns", "SNSの設計", "Social stories"],
  ["visual", "ビジュアルとグッズ", "Visual identity"],
  ["kit", "使うための素材", "Brand kit"],
] as const;
const assets = [
  { title: "いつものRacco", subtitle: "世界観 / キービジュアル", src: "/brand-book/racco-world.png", size: "1672 × 941", alt: "灰色のパーカーを着た半目のラッコがソファでくつろぐブランド画像" },
  { title: "仕込み中のRacco", subtitle: "メガネ / キービジュアル", src: "/brand-book/racco-glasses.png", size: "1672 × 941", alt: "薄い丸メガネをかけてソファでくつろぐRacco" },
  { title: "日常に、Raccoを。", subtitle: "アパレル / 生成モック", src: "/brand-book/racco-apparel.png", size: "1536 × 1024", alt: "Raccoの刺繍と背面プリントを入れた灰色パーカーの生成モック" },
  { title: "机の上も、ゆるく。", subtitle: "デスクアイテム / 生成モック", src: "/brand-book/racco-desk.png", size: "1536 × 1024", alt: "Raccoのマグカップ、ステッカー、アクリルキーホルダーの生成モック" },
  { title: "プロフィールの顔", subtitle: "SNS / 正方形", src: "/brand-book/racco-profile.png", size: "1254 × 1254", alt: "SNSプロフィール用Raccoの顔" },
];

function Wordmark({ brand = "racco", large = false }: { brand?: "racco" | "lakkan"; large?: boolean }) {
  return <span className={`bs-wordmark ${large ? "bs-wordmark-large" : ""} ${brand === "lakkan" ? "is-lakkan" : ""}`} aria-label={brand === "racco" ? "Racco" : "Lakkan"}>
    <span aria-hidden="true">{brand === "racco" ? "Racco" : "Lakkan"}<svg className="bs-cursor" viewBox="0 0 28 32" fill="none"><path d="M4 2v25l6-6 5 10 5-3-5-9h9L4 2Z" fill="currentColor"/></svg></span>
  </span>;
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body?: string }) {
  return <div className="bs-section-title"><span className="bs-eyebrow">{eyebrow}</span><h2>{title}</h2>{body && <p>{body}</p>}</div>;
}

export default function BrandStudio({ brand }: { brand: "racco" | "lakkan" }) {
  return <BrandLibrary brand={brand}/>;
}

// Full original guide: prose and local work-card tools remain available, separate from the visual library.
export function BrandGuide({ brand }: { brand: "racco" | "lakkan" }) {
  const reducedMotion = useBrandReducedMotion();
  const [paused, setPaused] = useState(false);
  const [glasses, setGlasses] = useState(false);
  const [active, setActive] = useState("world");
  const [channel, setChannel] = useState(channels[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<(typeof assets)[number] | null>(null);
  const [job, setJob] = useState({ task: "", purpose: "", condition: "" });
  const [jobStatus, setJobStatus] = useState("");
  const [jobPrompt, setJobPrompt] = useState("");
  const menu = useRef<HTMLDialogElement>(null);
  const media = useRef<HTMLDialogElement>(null);
  const copyDialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = channels.find(item => item.id === channel) ?? channels[0];
  const motionOff = paused || Boolean(reducedMotion);

  useEffect(() => {
    function syncHash() {
      const hash = window.location.hash.slice(1);
      const selected = channels.find(item => hash === `sns-${item.id}`);
      if (selected) {
        setChannel(selected.id);
        document.getElementById("sns")?.scrollIntoView({ behavior: "instant" });
      }
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-18% 0px -58% 0px" });
    chapters.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("racco-work-card");
        if (saved) {
          const data = JSON.parse(saved);
          if (typeof data.task === "string" && typeof data.purpose === "string" && typeof data.condition === "string") setJob(data);
        }
      } catch { setJobStatus("保存したカードを読めませんでした。新しいカードをここで作れます。"); }
    }, 0);
    return () => { window.clearTimeout(timer); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => { if (menuOpen) menu.current?.showModal(); else menu.current?.close(); }, [menuOpen]);
  useEffect(() => { if (lightbox) media.current?.showModal(); else media.current?.close(); }, [lightbox]);
  useEffect(() => { if (copyFallback !== null) copyDialog.current?.showModal(); else copyDialog.current?.close(); }, [copyFallback]);

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  }
  async function copy(text: string, label: string) {
    try { await navigator.clipboard.writeText(text); notify(`${label}をコピーしました`); }
    catch { setCopyFallback(text); }
  }
  function selectChannel(id: typeof channel) {
    setChannel(id);
    window.history.replaceState(null, "", `#sns-${id}`);
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight") next = (index + 1) % channels.length;
    if (event.key === "ArrowLeft") next = (index - 1 + channels.length) % channels.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = channels.length - 1;
    if (next !== undefined) { event.preventDefault(); selectChannel(channels[next].id); document.getElementById(`channel-${channels[next].id}`)?.focus(); }
  }
  function makeCard(event: FormEvent) {
    event.preventDefault();
    if (![job.task, job.purpose, job.condition].every(value => value.trim())) { setJobStatus("仕事・用途・完成の条件を入れてください。入力はそのまま残っています。"); return; }
    setJobPrompt(`いつもの仕事を、次から少しラクにしたいです。\n任せたい仕事：${job.task}\n誰が何に使うか：${job.purpose}\n完成の条件：${job.condition}\n\n${starterPrompt.split("\n\n").slice(-1).join("\n\n")}`);
    try { localStorage.setItem("racco-work-card", JSON.stringify(job)); setJobStatus("このブラウザにカードを保存しました。外部へは送信していません。"); }
    catch { setJobStatus("このブラウザでは保存できません。下のカードをコピーしてメモへ残してください。入力は保持しています。"); }
  }
  function nav() {
    return <><div className="bs-sidebar-heading">ブランドブック</div><nav aria-label="ブランドブックの章">
      {chapters.map(([id, label, en]) => <div key={id}><a href={`#${id}`} className={active === id ? "is-active" : ""} aria-current={active === id ? "location" : undefined} onClick={() => setMenuOpen(false)}><span>{label}<small>{en}</small></span><ChevronRight size={14}/></a>
        {id === "sns" && <div className="bs-subnav">{channels.map(item => <a key={item.id} href={`#sns-${item.id}`} onClick={() => { setChannel(item.id); setMenuOpen(false); }} aria-current={active === "sns" && item.id === channel ? "location" : undefined}>{item.name}</a>)}</div>}
      </div>)}
    </nav></>;
  }

  return <div className="brand-studio" data-motion={motionOff ? "off" : "on"} data-brand={brand}>
    <aside className="bs-sidebar"><Link href="/racco" className="bs-logo-link"><Wordmark /></Link><p className="bs-sidebar-tagline">サボるためのAI生存術</p>{nav()}<div className="bs-sidebar-foot"><Link href="/brand-book"><BookOpen size={16}/>資料版を開く<ArrowUpRight size={14}/></Link><Link href="/concept">Lakkanの考え方<ArrowUpRight size={14}/></Link><p>考え方を、使うところまで。</p></div></aside>
    <div className="bs-main">
      <header className="bs-topbar"><div className="bs-breadcrumb"><span>{brand === "racco" ? "Racco" : "Lakkan"}</span><span>/</span><span>Brand book</span></div><div className="bs-top-actions"><button type="button" className="bs-motion-button" onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={Boolean(reducedMotion)} aria-label={motionOff ? "動きを再開" : "動きを停止"}>{motionOff ? <Play size={14}/> : <Pause size={14}/>}<span>{reducedMotion ? "動き控えめ" : paused ? "動きを再開" : "動きを停止"}</span></button><Link href="/brand-book" className="bs-book-link"><BookOpen size={16}/><span>資料版</span></Link><button type="button" ref={menuButton} className="bs-mobile-menu" aria-label="目次を開く" aria-expanded={menuOpen} aria-controls="brand-menu" onClick={() => setMenuOpen(true)}><Menu size={22}/></button></div></header>
      <main id="main">
        {brand === "lakkan" && <div className="bs-lakkan-intro"><Wordmark brand="lakkan" large/><span className="bs-eyebrow">考え方を、使える形へ。</span><h1>人と仕事の課題を、<br/>整理から実装まで。</h1><p>つくるだけで終わらない。<br/>その人らしい考え方を、ことば・見た目・日々の使い方までつなぐ。</p><div className="bs-lakkan-principles">{lakkanPrinciples.map(item => <div key={item.title}><h2>{item.title}</h2><p>{item.body}</p></div>)}</div><div className="bs-lakkan-links"><a className="bs-text-link" href="#world">Raccoで、その考え方を見る<ArrowDown size={16}/></a><Link className="bs-text-link" href="/">動く工房へ<ArrowUpRight size={16}/></Link></div></div>}
        <section id="world" className="bs-hero">
          <AnimatePresence initial={false} mode="sync"><motion.div className="bs-hero-photo" key={glasses ? "glasses" : "normal"} initial={{ opacity: motionOff ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionOff ? 0 : .5 }}><Image src={glasses ? assets[1].src : assets[0].src} alt={glasses ? assets[1].alt : assets[0].alt} fill sizes="(max-width: 800px) 100vw, 82vw" priority/></motion.div></AnimatePresence>
          <div className="bs-hero-content"><span className="bs-eyebrow">Racco / Brand story</span><Wordmark large/>{brand === "racco" ? <h1>ラクするためなら、<br/>手間を惜しまない。</h1> : <h2>ラクするためなら、<br/>手間を惜しまない。</h2>}<p>ちょっと先に仕込んで、<br/>あとでゆっくり。<br/>そんな毎日を、つくっています。</p><a className="bs-text-link" href="#concept">Raccoの考え方<ArrowDown size={16}/></a></div>
          <div className="bs-hero-bottom"><span>頑張り続けるのは、だるい。<br/>でも、雑な仕事はしたくない。</span><button type="button" className="bs-variant" onClick={() => setGlasses(!glasses)} aria-pressed={glasses}><Glasses size={17}/>{glasses ? "いつものRaccoへ" : "メガネで仕込み中"}<ArrowRight size={15}/></button></div>
        </section>

        <section id="concept" className="bs-section bs-concept"><SectionTitle eyebrow="The idea" title="サボるために、先に仕込む。" body="AIすごいのは分かった。で、今日どこで使う？"/><div className="bs-manifesto"><p>新しい道具を、全部追わなくてもいい。<br/>いつもの面倒を、ひとつ渡す。<br/>欲しかったものと違ったら、直す。</p><p>その仕込みも、空振りも。<br/>次の誰かが、ちょっとラクになる材料に。</p><strong>使えた型だけ、持ち帰る。</strong></div><div className="bs-promise-row"><div><span>見た目の約束</span><h3>気負わず、だるい。</h3></div><div><span>中身の約束</span><h3>試したことを、隠さない。</h3></div></div></section>

        <section id="voice" className="bs-section"><SectionTitle eyebrow="Tone of voice" title="先生じゃなくて、味方。" body="一つ先に試して、戻ってくる。うまくいった日も、空振りの日も。"/><div className="bs-voice-quote"><span>Raccoの声</span><p>「これ、毎回やるのだるい。<br/>ここだけ渡してみた。」</p></div><div className="bs-voice-rules">{voiceRules.map(item => <details key={item.good} className="bs-voice-rule"><summary><Check size={16}/><span>{item.good}</span><ChevronDown size={18}/></summary><div><p className="bs-avoid">言わない：{item.bad}</p><p>{item.reason}</p></div></details>)}</div></section>

        <section id="experiment" className="bs-section"><SectionTitle eyebrow="The practice" title="違ったら、直す。" body="万能な一文を探すより、自分の仕事を一つずつ。"/><ol className="bs-cycle">{workCycle.map((item, i) => <li key={item.label}><span>{String(i + 1).padStart(2, "0")}</span><h3>{item.label}</h3><p>{item.detail}</p></li>)}</ol><div className="bs-real-example"><span className="bs-eyebrow">実際に直した、ひとこと</span><h3>「レアっぽく」を、そのまま渡さない。</h3><div className="bs-before-after"><div><span>はじめの指示</span><p>レアっぽくして。</p></div><ArrowRight size={22}/><div><span>直した一文</span><p>描画は太い線の2D。<br/>表面はホログラム。</p></div></div><p className="bs-caption">Racco画像の制作時に、描画スタイルと表面を分けて伝えた修正例。仕事全般の効果や、別入力での再現を保証するものではありません。</p><button className="bs-text-link" type="button" onClick={() => copy(repairPrompt, "直し方のプロンプト")}>直し方を持ち帰る<Copy size={16}/></button></div><div className="bs-job-card"><div><span className="bs-eyebrow">Your small start</span><h3>いつもの面倒を、ひとつ渡す。</h3><p>最初は、この3つだけ。<br/>書いた内容は、このブラウザ内にだけ残ります。</p><p className="bs-caption">秘密・個人情報・顧客情報は入れないでください。AIへの送信はしません。</p></div><form onSubmit={makeCard} noValidate><label>任せたい仕事<input value={job.task} onChange={e => setJob({ ...job, task: e.target.value })} placeholder="例：打ち合わせメモを整理する" required maxLength={200}/></label><label>誰が、何に使う？<input value={job.purpose} onChange={e => setJob({ ...job, purpose: e.target.value })} placeholder="例：自分が次のアクションを確認する" required maxLength={200}/></label><label>完成の条件<input value={job.condition} onChange={e => setJob({ ...job, condition: e.target.value })} placeholder="例：決定と未決定が混ざらない" required maxLength={300}/></label><button className="bs-button" type="submit">仕事カードを作る<ArrowRight size={16}/></button><p className="bs-form-status" role="status">{jobStatus}</p>{jobPrompt && <div className="bs-card-result"><p>{jobPrompt}</p><button type="button" className="bs-text-link" onClick={() => copy(jobPrompt, "仕事カード")}>カードをコピー<Copy size={15}/></button></div>}</form></div></section>

        <section id="sns" className="bs-section"><SectionTitle eyebrow="Social stories" title={<><span className="bs-phrase">同じ実験を、</span><wbr/><span className="bs-phrase">それぞれの届け方で。</span></>} body="別々の投稿を量産するより、一つの経験を、ちょうどいい形に。"/>
          {/* Selection/slide model reconstructed from kokonutUI Smooth Tab (MIT). See THIRD-PARTY-NOTICES.md. */}
          <div className="bs-channel-tabs" role="tablist" aria-label="SNS媒体">{channels.map((item, i) => <button id={`channel-${item.id}`} key={item.id} type="button" role="tab" aria-selected={item.id === channel} aria-controls="channel-panel" tabIndex={item.id === channel ? 0 : -1} onClick={() => selectChannel(item.id)} onKeyDown={e => tabKey(e, i)}>{item.id === channel && <motion.span className="bs-tab-highlight" layoutId="channel-highlight" transition={{ duration: motionOff ? 0 : .25, ease: [.32, .72, 0, 1] }}/>}<span>{item.name}</span></button>)}</div>
          <div className="bs-channel-panel" role="tabpanel" id="channel-panel" aria-labelledby={`channel-${current.id}`} tabIndex={0}><div className="bs-channel-info"><span className="bs-eyebrow">{current.name} / {current.role}</span><h3>{current.subtitle}</h3><p>{current.format}</p><div className="bs-channel-path"><span>{current.cta}</span><ArrowRight size={18}/></div><button type="button" className="bs-text-link" onClick={() => copy(current.sample, "投稿例")}>投稿例をコピー<Copy size={16}/></button></div><motion.div className="bs-social-preview" key={current.id} initial={{ opacity: motionOff ? 1 : 0, y: motionOff ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}><div className="bs-social-user"><Image src="/brand-book/racco-profile.png" width={48} height={48} alt="Raccoのプロフィール画像"/><div><strong>Racco</strong><small>サボるためのAI生存術</small></div><span className="bs-draft-label">文面案</span></div><p className="bs-social-profile">{current.profile}</p>{current.id === "instagram" && <Image className="bs-social-image" src="/brand-book/racco-apparel.png" width={1536} height={1024} alt="Instagramでの見せ方の例。パーカーの生成モック"/>}<div className="bs-social-post">{current.sample}</div><div className="bs-preview-footer"><span>未投稿 / プレビュー</span><button type="button" aria-label="プロフィールをコピー" onClick={() => copy(current.profile, "プロフィール")}><Copy size={16}/></button></div></motion.div></div>
          <p className="bs-caption">媒体の役割は編集設計です。ここからSNSへの自動投稿・アカウント変更は行いません。</p>
        </section>

        <section id="visual" className="bs-section"><SectionTitle eyebrow="Visual identity" title="日常に、Raccoを。" body="世界観は写真で。気分は、使うものに。"/><div className="bs-merch-grid">{assets.slice(2, 4).map(item => <figure key={item.src}><button type="button" className="bs-image-button" onClick={() => setLightbox(item)} aria-label={`${item.title}を拡大`}><Image src={item.src} width={1536} height={1024} alt={item.alt} sizes="(max-width: 800px) 100vw, 40vw"/><span><ArrowUpRight size={20}/></span></button><figcaption><strong>{item.title}</strong><span>{item.subtitle}</span></figcaption></figure>)}</div><div className="bs-visual-rules"><p><strong>変えない、顔。</strong><br/>茶色の毛、半目、灰色のパーカー。<br/>メガネは「仕込み中」の表情。別人格にはしない。</p><p><strong>AIは、さりげなく。</strong><br/>小さな銀色のバッジとコーラルのカーソル。<br/>ネオンや回路で、世界を埋めない。</p></div><p className="bs-caption">画像は生成モックです。商品の在庫・製造・販売はありません。刺繍・印刷の入稿原稿と製造品質は別途確認が必要です。</p></section>

        <section id="kit" className="bs-section bs-kit"><SectionTitle eyebrow="Brand kit" title="迷わず、同じRaccoに。" body="コピーも、画像も、作る人が使いやすい形で。"/><div className="bs-tokens"><div className="bs-type-sample"><Wordmark/><h3>サボるためのAI生存術</h3><p>日本語は、Noto Sans JPで統一。<br/>英字ロゴだけ、Space Grotesk。</p><span>本文 400 / 補助 500 / 見出し 700 / 主題 900</span></div><div className="bs-colors">{[["Coral", "#F36755"], ["Ink", "#292925"], ["Paper", "#F6F6F5"]].map(([label, hex]) => <button key={hex} type="button" onClick={() => copy(hex, "カラーコード")} aria-label={`${label} ${hex}をコピー`}><span style={{ background: hex }}/><strong>{label}</strong><small>{hex}<Copy size={12}/></small></button>)}</div></div><div className="bs-download-list">{assets.map(item => <div key={item.src}><button type="button" onClick={() => setLightbox(item)}><Image src={item.src} width={88} height={60} alt={item.alt}/><span><strong>{item.title}</strong><small>{item.subtitle} / {item.size} / PNG</small></span></button><a href={item.src} download><Download size={17}/><span>画像を保存</span></a></div>)}</div><div className="bs-book-banner"><div><BookOpen size={24}/><h3><span className="bs-phrase">見せるときは、</span><wbr/><span className="bs-phrase">ブランドブックで。</span></h3><p>同じ内容を、資料としても。章を切り替えず、まとめて読めます。</p></div><Link href="/brand-book" className="bs-button">資料版を開く<ArrowUpRight size={16}/></Link><a href="/brand-book/brand-book.md" download className="bs-text-link">原稿を保存<Download size={15}/></a></div></section>
      </main>
      <footer className="bs-footer"><Wordmark/><p>ラクするためなら、手間を惜しまない。</p><div><Link href="/concept"><ArrowLeft size={15}/>Lakkanへ戻る</Link><Link href="/brand-book">ブランドブック<ArrowUpRight size={15}/></Link><span>Racco / Brand concept</span></div></footer>
    </div>
    <dialog ref={menu} id="brand-menu" className="bs-menu-dialog" onClose={() => { setMenuOpen(false); menuButton.current?.focus(); }}><div className="bs-dialog-header"><Wordmark/><button type="button" aria-label="目次を閉じる" onClick={() => setMenuOpen(false)}><X size={22}/></button></div>{nav()}<Link href="/brand-book" className="bs-text-link">資料版を開く<ArrowUpRight size={16}/></Link></dialog>
    <dialog ref={media} className="bs-media-dialog" onClose={() => setLightbox(null)}><div className="bs-dialog-header"><strong>{lightbox?.title}</strong><button type="button" aria-label="画像を閉じる" onClick={() => setLightbox(null)}><X size={22}/></button></div>{lightbox && <><Image src={lightbox.src} width={1672} height={1024} alt={lightbox.alt} sizes="90vw"/><div className="bs-media-foot"><p>{lightbox.subtitle} / {lightbox.size}<br/>生成画像。商品化・入稿の完成データではありません。</p><a className="bs-button" href={lightbox.src} download><Download size={16}/>画像を保存</a></div></>}</dialog>
    <dialog ref={copyDialog} className="bs-copy-dialog" onClose={() => setCopyFallback(null)}><div className="bs-dialog-header"><strong>コピー用のテキスト</strong><button type="button" aria-label="コピー用テキストを閉じる" onClick={() => setCopyFallback(null)}><X size={22}/></button></div><p>このブラウザでは自動コピーできませんでした。下の文章を選択してコピーできます。</p><textarea readOnly value={copyFallback ?? ""} aria-label="手動コピー用テキスト" onFocus={e => e.target.select()}/><button type="button" className="bs-button" onClick={() => copyDialog.current?.querySelector("textarea")?.select()}>テキストを選択</button></dialog>
    <div className={`bs-toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast && <Check size={16}/>}<span>{toast}</span></div>
  </div>;
}
