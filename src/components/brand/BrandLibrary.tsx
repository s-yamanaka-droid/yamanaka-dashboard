"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Copy, Download, Menu, Pause, Play, X } from "lucide-react";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { channels, type ChannelId } from "@/data/brand-book";
import "./brand-library.css";
import { useBrandReducedMotion } from "./useBrandReducedMotion";

const sections = [
  { id: "concept", label: "はじめに" },
  { id: "visual", label: "ギャラリー" },
  { id: "posts", label: "読みもの" },
  { id: "assets", label: "素材" },
] as const;
type Section = typeof sections[number]["id"];
type Asset = { title: string; kind: string; src: string; width: number; height: number; alt: string };
const raccoAssets: Asset[] = [
  { title: "顔とひと言", kind: "投稿の型", src: "/brand-book/racco-post-wide.png", width: 1942, height: 809, alt: "ピンクの背景に半目のRaccoと『それ、毎回やる必要ある？』の吹き出し" },
  { title: "ラクするためなら。", kind: "バナー", src: "/brand-book/racco-banner.png", width: 2172, height: 724, alt: "ラクするためなら、手間を惜しまない。白いソファのRaccoとコーラルの文字ロゴ" },
  { title: "いつものRacco", kind: "キービジュアル", src: "/brand-book/racco-library-hero.png", width: 2172, height: 724, alt: "灰パーカーのRaccoが白いソファでPCと貝のメモを持ち、くつろいでいる" },
  { title: "日常に、Raccoを。", kind: "アパレルモック", src: "/brand-book/racco-apparel.png", width: 1536, height: 1024, alt: "Raccoの刺繍とプリントを入れた灰色パーカーの生成モック" },
  { title: "机の上も、ゆるく。", kind: "デスクモック", src: "/brand-book/racco-desk.png", width: 1536, height: 1024, alt: "Raccoのマグ、ステッカー、キーホルダーの生成モック" },
  { title: "プロフィールの顔", kind: "プロフィール", src: "/brand-book/racco-profile.png", width: 1254, height: 1254, alt: "半目の茶色いラッコ、Raccoのプロフィール画像" },
  { title: "仕込み中", kind: "メガネバージョン", src: "/brand-book/racco-glasses.png", width: 1672, height: 941, alt: "丸メガネをかけてくつろぐRacco" },
];
const lakkanAsset: Asset = { title: "つくって、確かめる。", kind: "ブランドブック表紙", src: "/brand-book/lakkan-cover.png", width: 1672, height: 941, alt: "白背景にLakkanの文字と黒・銀・オレンジの小さな工房の生成カンプ" };

export default function BrandLibrary({ brand }: { brand: "racco" | "lakkan" }) {
  const [section, setSection] = useState<Section>("concept");
  const [channel, setChannel] = useState<ChannelId>("threads");
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<Asset | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const reduced = useBrandReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const copyDialog = useRef<HTMLDialogElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const focusPanelAfterNavigation = useRef(false);
  const isRacco = brand === "racco";
  const current = channels.find(item => item.id === channel) ?? channels[0];
  const assets = isRacco ? raccoAssets : [lakkanAsset];
  const motionOff = paused || Boolean(reduced);

  useEffect(() => {
    function syncHash() {
      const hash = window.location.hash.slice(1);
      const selected = sections.find(item => item.id === hash);
      const social = channels.find(item => hash === `sns-${item.id}`);
      if (selected) setSection(selected.id);
      else if (social) { setSection("posts"); setChannel(social.id); }
      else if (!hash) setSection("concept");
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => { window.removeEventListener("hashchange", syncHash); window.removeEventListener("popstate", syncHash); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);
  useEffect(() => { if (preview) dialog.current?.showModal(); else dialog.current?.close(); }, [preview]);
  useEffect(() => { if (menuOpen) menu.current?.showModal(); else menu.current?.close(); }, [menuOpen]);
  useEffect(() => { if (manualCopy !== null) copyDialog.current?.showModal(); else copyDialog.current?.close(); }, [manualCopy]);
  useEffect(() => {
    if (!focusPanelAfterNavigation.current || menuOpen) return;
    focusPanelAfterNavigation.current = false;
    panel.current?.focus();
  }, [section, channel, menuOpen]);

  function select(id: Section, moveFocus = false) {
    focusPanelAfterNavigation.current = moveFocus;
    setSection(id);
    setMenuOpen(false);
    window.history.pushState(null, "", `#${id}`);
  }
  function selectChannel(id: ChannelId) {
    setChannel(id);
    window.history.replaceState(null, "", `#sns-${id}`);
  }
  function openStory(id: ChannelId) {
    focusPanelAfterNavigation.current = true;
    setSection("posts");
    setChannel(id);
    window.history.pushState(null, "", `#sns-${id}`);
  }
  function returnHome(event: MouseEvent<HTMLAnchorElement>, samePage: boolean) {
    if (!samePage || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select("concept", menuOpen);
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number, social = false) {
    const list = social ? channels : sections;
    const next = event.key === "ArrowRight" ? (index + 1) % list.length : event.key === "ArrowLeft" ? (index - 1 + list.length) % list.length : event.key === "Home" ? 0 : event.key === "End" ? list.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    if (social) selectChannel(channels[next].id); else select(sections[next].id);
    document.getElementById(`${social ? "bl-channel" : "bl-tab"}-${list[next].id}`)?.focus();
  }
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label}をコピーしました`);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(""), 3000);
    } catch { setManualCopy(text); }
  }
  function assetCard(asset: Asset, save = false) {
    return <figure className="bl-card" key={asset.src}>
      <button type="button" className="bl-card-image" onClick={() => setPreview(asset)} aria-label={`${asset.title}を拡大`}><Image src={asset.src} width={asset.width} height={asset.height} alt={asset.alt} quality={90} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 55px), 537px"/></button>
      <figcaption><div><strong>{save ? asset.title : asset.kind}</strong><span className="bl-state"><i aria-hidden="true"/>制作済み・候補</span></div>{save ? <a className="bl-pill" href={asset.src} download aria-label={`${asset.title}の画像を保存`}>画像を保存<Download size={14}/></a> : <button type="button" className="bl-pill" onClick={() => setPreview(asset)} aria-label={`${asset.title}を大きく見る`}>大きく見る<ArrowUpRight size={14}/></button>}</figcaption>
    </figure>;
  }
  const brandLinks = <div className="bl-brands" aria-label="Lakkanのキャラクター">
    <span className="bl-belongs">のんびり担当</span>
    <Link href="/racco" onClick={event => returnHome(event, isRacco)} className={`bl-brand ${isRacco ? "is-selected" : ""}`} aria-current={isRacco ? "page" : undefined}><span className="bl-brand-thumb"><Image src="/brand-book/racco-profile.png" width={48} height={48} alt=""/></span><span>Racco</span></Link>
  </div>;

  return <div className="brand-library" data-brand={brand} data-motion={motionOff ? "off" : "on"}>
    <div className="bl-shell">
      <header className="bl-header"><Link href="/concept" onClick={event => returnHome(event, !isRacco)} className="bl-label" aria-label="Lakkanについて">Lakkan<span>ラクするほうを、つくろう。</span></Link>{brandLinks}<nav className="bl-tabs" role="tablist" aria-label="ブランドの内容">{sections.map((item, i) => <button key={item.id} id={`bl-tab-${item.id}`} type="button" role="tab" aria-selected={section === item.id} aria-controls="main" tabIndex={section === item.id ? 0 : -1} onClick={() => select(item.id)} onKeyDown={event => tabKey(event, i)}>{item.label}</button>)}</nav><button className="bl-menu-button" type="button" aria-label="メニューを開く" aria-controls="bl-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={22}/></button></header>
      <main><div id="main" ref={panel} role="tabpanel" aria-labelledby={`bl-tab-${section}`} tabIndex={0}>
        {section === "concept" && <>
          <section className="bl-hero" aria-label={`${isRacco ? "Racco" : "Lakkan"}のコンセプト`}>
            <div className="bl-hero-copy"><p className="bl-kicker">{isRacco ? "LakkanのRacco｜サボるためのAI生存術" : "考える。つくる。ちょっとラクになる。"}</p><div className="bl-wordmark" aria-hidden="true">{isRacco ? "Racco" : "Lakkan"}</div><h1>{isRacco ? <>ラクするために、<br/>いっしょに試す。</> : <>その「めんどい」、<br/>つくって変えよう。</>}</h1><p className="bl-hero-subtitle">{isRacco ? "先生じゃなく、いっしょに試す味方。" : "仕事の整理から、サイトや仕組みづくりまで。"}</p>{isRacco ? <button type="button" className="bl-pill bl-hero-cta" onClick={() => select("posts", true)}>ちょっと読む<ArrowRight size={16}/></button> : <Link href="/works" className="bl-pill bl-hero-cta">つくったものを見る<ArrowRight size={16}/></Link>}</div>
            <div className="bl-hero-art"><Image src={raccoAssets[2].src} width={2172} height={724} alt={raccoAssets[2].alt} sizes="(max-width: 600px) calc(170vw - 17px), 1100px" quality={90} preload/></div>
          </section>
          <section className="bl-showcase" aria-label="読みものの入口"><div className="bl-section-head"><h2>{isRacco ? "Raccoのひとりごと" : "Lakkanの、のんびり担当。"}</h2><button type="button" onClick={() => select("visual", true)}>ギャラリーへ<ArrowRight size={14}/></button></div><div className="bl-grid">{channels.slice(0, 2).map((story, i) => <Link key={story.id} className="bl-story" href={`/racco#sns-${story.id}`} onClick={event => { if (isRacco && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); openStory(story.id); } }}><div className="bl-card-image"><Image src={raccoAssets[i].src} width={raccoAssets[i].width} height={raccoAssets[i].height} alt={raccoAssets[i].alt} sizes="(max-width: 600px) 100vw, 50vw"/></div><div className="bl-story-caption"><div><span>{story.id === "threads" ? "仕事のすみっこ" : "ラクする仕込み"}</span><h3>{story.subtitle}</h3></div><ArrowUpRight size={19}/></div></Link>)}</div></section>
          <div className="bl-company-strip"><div><span className="bl-kicker">{isRacco ? "Raccoがいる会社" : "Lakkanについて"}</span><h2>{isRacco ? "Lakkan" : "つくる相談も、どうぞ。"}</h2><p>仕事の整理から、サイトや仕組みづくりまで。</p></div><nav aria-label="Lakkanの仕事"><Link href="/services">できること<ArrowUpRight size={15}/></Link><Link href="/works">つくったもの<ArrowUpRight size={15}/></Link><Link href="/contact?topic=other#inquiry">相談する<ArrowRight size={15}/></Link></nav></div>
        </>}
        {section === "visual" && <section className="bl-pane"><div className="bl-section-head"><div><p className="bl-kicker">VISUAL LIBRARY</p><h1>{isRacco ? "Raccoのいる日常。" : "考え方を、見える形に。"}</h1></div><button type="button" className="bl-pill" onClick={() => select("assets", true)}>素材を保存<ArrowRight size={15}/></button></div><div className="bl-grid bl-visual-grid">{assets.map(asset => assetCard(asset))}</div><p className="bl-note">生成モック・制作候補です。商品化・入稿品質・実媒体での表示は別途確認します。</p></section>}
        {section === "posts" && <section className="bl-pane"><div className="bl-section-head"><div><p className="bl-kicker">RACCOのひとりごと</p><h1>{isRacco ? "めんどい日にも、いろいろある。" : "LakkanのRacco、考え中。"}</h1></div></div>{isRacco ? <>
          <div className="bl-channel-tabs" role="tablist" aria-label="SNS媒体">{channels.map((item, i) => <button key={item.id} id={`bl-channel-${item.id}`} type="button" role="tab" aria-selected={channel === item.id} aria-controls="bl-social-panel" tabIndex={channel === item.id ? 0 : -1} onClick={() => selectChannel(item.id)} onKeyDown={event => tabKey(event, i, true)}>{item.name}</button>)}</div>
          <div className="bl-social-layout" id="bl-social-panel" role="tabpanel" aria-labelledby={`bl-channel-${channel}`} tabIndex={0}><div className="bl-social-direction"><Image src={raccoAssets[0].src} width={1942} height={809} alt={raccoAssets[0].alt}/><h2>{current.subtitle}</h2><p>Lakkanのすみっこで、<br/>ラクするほうを考えてる。</p><details className="bl-profile"><summary>この文面の制作メモ</summary><p>{current.format}</p><Link href="/brand-guide#experiment" className="bl-pill">制作ガイドを見る<ArrowUpRight size={14}/></Link></details></div><article className="bl-social-card"><div className="bl-social-user"><Image src="/brand-book/racco-profile.png" width={44} height={44} alt=""/><div><strong>Racco</strong><span>Lakkan・{current.name}</span></div><span className="bl-state">文面案</span></div><p className="bl-social-text">{current.sample}</p><button type="button" className="bl-pill" onClick={() => copy(current.sample, "投稿例")}>文面をコピー<Copy size={15}/></button><details className="bl-profile"><summary>プロフィール案を見る</summary><p>{current.profile}</p><button type="button" className="bl-pill" onClick={() => copy(current.profile, "プロフィール")}>プロフィールをコピー<Copy size={14}/></button></details></article></div><p className="bl-note">Raccoのキャラクター文案です。実体験・効果の報告ではありません。SNSには投稿しません。</p>
        </> : <div className="bl-brand-boundary"><p>Lakkanは会社の考え方を短く、具体的に。Raccoはいつもの面倒をいっしょに試す味方。発信の口調と役割は分けます。</p><Link href="/racco#posts" className="bl-pill">Raccoの投稿の型を見る<ArrowRight size={15}/></Link></div>}</section>}
        {section === "assets" && <section className="bl-pane"><div className="bl-section-head"><div><p className="bl-kicker">BRAND KIT</p><h1>使うものを、ここから。</h1></div><Link href="/brand-book" className="bl-pill"><BookOpen size={15}/>資料版を開く</Link></div><div className="bl-grid bl-visual-grid">{assets.map(asset => assetCard(asset, true))}</div><div className="bl-kit-foot"><p>原寸画像を保存できます。掲載先のサイズ・切り抜きは、使う前に確認してください。</p><a href="/brand-book/brand-book.md" download className="bl-pill">原稿を保存<Download size={14}/></a></div>{isRacco && <div className="bl-palette">{["#F36755", "#292925", "#F6F6F5"].map(hex => <button key={hex} type="button" onClick={() => copy(hex, "カラーコード")}><i style={{ background: hex }} aria-hidden="true"/>{hex}<Copy size={13}/></button>)}<span>日本語：Noto Sans JP / 英字ロゴ：Space Grotesk</span></div>}</section>}
      </div></main>
      <footer className="bl-footer"><span>考え方を、使うところまで。</span><div><Link href="/brand-guide">詳しいブランドブック<ArrowUpRight size={14}/></Link><Link href="/brand-book">資料版<BookOpen size={14}/></Link><button type="button" aria-label={motionOff ? "動きを再開" : "動きを停止"} aria-pressed={paused} disabled={Boolean(reduced)} onClick={() => setPaused(!paused)}>{motionOff ? <Play size={14}/> : <Pause size={14}/>}<span>{reduced ? "動き控えめ" : paused ? "動きを再開" : "動きを停止"}</span></button></div></footer>
    </div>
    <dialog id="bl-preview" aria-label={preview ? `${preview.title}のプレビュー` : "画像のプレビュー"} ref={dialog} className="bl-dialog bl-preview-dialog" onClose={() => setPreview(null)}><header><strong>{preview?.title}</strong><button type="button" aria-label="画像を閉じる" onClick={() => setPreview(null)}><X size={22}/></button></header>{preview && <><Image src={preview.src} width={preview.width} height={preview.height} alt={preview.alt} sizes="90vw"/><div className="bl-dialog-foot"><p>{preview.width} × {preview.height} / PNG<br/>制作候補・生成モック</p><a href={preview.src} download className="bl-pill">画像を保存<Download size={15}/></a></div></>}</dialog>
    <dialog id="bl-menu" aria-label="LakkanとRaccoのメニュー" ref={menu} className="bl-dialog bl-menu-dialog" onClose={() => setMenuOpen(false)}><header><strong>Lakkan / Racco</strong><button type="button" aria-label="メニューを閉じる" onClick={() => setMenuOpen(false)}><X size={22}/></button></header>{brandLinks}<nav aria-label="メニュー">{sections.map(item => <button key={item.id} type="button" onClick={() => select(item.id, true)}>{item.label}<ArrowRight size={16}/></button>)}<Link href="/brand-guide">詳しいブランドブック<ArrowUpRight size={16}/></Link><Link href="/brand-book">資料版を開く<BookOpen size={16}/></Link></nav></dialog>
    <dialog aria-label="テキストの手動コピー" ref={copyDialog} className="bl-dialog bl-copy-dialog" onClose={() => setManualCopy(null)}><header><strong>コピー用のテキスト</strong><button type="button" aria-label="コピー用テキストを閉じる" onClick={() => setManualCopy(null)}><X size={22}/></button></header><p>自動コピーできませんでした。文章を選択してコピーできます。</p><textarea aria-label="手動コピー用テキスト" value={manualCopy ?? ""} readOnly onFocus={event => event.target.select()}/><button type="button" className="bl-pill" onClick={() => copyDialog.current?.querySelector("textarea")?.select()}>テキストを選択</button></dialog>
    <div className={`bl-toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite">{toast && <Check size={16}/>}<span>{toast}</span></div>
  </div>;
}
