"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import AgenticFactory3D, { type StationId } from "@/components/ui/agentic-factory-3d";
import { works } from "@/data/factory-works";
import "./factory.css";

type Panel = "menu" | "work" | "contact" | null;

function Cross({ plus = false }: { plus?: boolean }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={plus ? "M10 3v14M3 10h14" : "m4 4 12 12M16 4 4 16"} stroke="currentColor" strokeWidth="1.2" /></svg>;
}

function Arrow({ direction = "out" }: { direction?: "out" | "left" | "right" }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={direction === "out" ? "M5 15 15 5M5 5h10v10" : direction === "left" ? "m12 5-5 5 5 5" : "m8 5 5 5-5 5"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function WorkImage({ work }: { work: (typeof works)[number] }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="work-image-fallback">{work.name}<span>下のリンクから作品を開けます。</span></div> : <Image className="work-image" src={work.cover} width={800} height={600} alt={work.alt} unoptimized loading="eager" onError={() => setFailed(true)} />;
}

export default function FactoryHome() {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [station, setStation] = useState<StationId | null>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const focusedScene = useRef(false);
  const panelHistory = useRef(false);

  const finishClosing = useCallback(() => {
    if (focusedScene.current) window.__machine?.returnToExplore();
    focusedScene.current = false;
    setPanel(null);
    setStation(null);
    requestAnimationFrame(() => {
      const target = returnFocus.current;
      if (target?.isConnected) target.focus();
      else menuRef.current?.focus();
    });
  }, []);

  const closePanel = useCallback(() => {
    const ownsEntry = panelHistory.current;
    panelHistory.current = false;
    finishClosing();
    if (ownsEntry) window.history.back();
  }, [finishClosing]);

  function rememberPanel() {
    if (panelHistory.current) return;
    window.history.pushState({ lakkanPanel: true }, "", window.location.href);
    panelHistory.current = true;
  }

  function openStation(id: StationId, alreadyFocused = false) {
    rememberPanel();
    if (!panel) returnFocus.current = document.activeElement as HTMLElement;
    if (!alreadyFocused) window.__machine?.focusStation(id);
    focusedScene.current = true;
    setStation(id);
    setPanel(id === "cashdesk" ? "contact" : "work");
  }

  function openMenu() {
    if (panel) { closePanel(); return; }
    returnFocus.current = menuRef.current;
    rememberPanel();
    setPanel("menu");
  }

  function togglePlayback() {
    const playing = window.__machineDebug?.getState().playing;
    if (playing) window.__machine?.pause();
    else window.__machine?.play();
    setPaused(Boolean(playing));
  }

  useEffect(() => {
    function pop() {
      if (!panelHistory.current) return;
      panelHistory.current = false;
      finishClosing();
    }
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [finishClosing]);

  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    function keys(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); closePanel(); }
      if (e.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]'));
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", keys);
    return () => document.removeEventListener("keydown", keys);
  }, [panel, closePanel]);

  const activeIndex = works.findIndex(w => w.station === station);
  const work = works[activeIndex] ?? works[2];
  const dialogTitle = panel === "menu" ? "Menu" : panel === "contact" ? "Contact" : "Work";

  return (
    <main id="main" className="factory-shell" data-ready={ready} data-station={station ?? ""} data-panel={panel ?? "none"}>
      <h1 className="sr-only">Lakkan — Interactive studio</h1>
      <div className="factory-scene" inert={Boolean(panel)} aria-hidden={panel ? true : undefined}>
        <AgenticFactory3D minimal height="100dvh" onReady={() => {
          setReady(true);
          setPaused(!window.__machineDebug?.getState().playing);
        }} onStation={id => openStation(id, true)} />
      </div>
      <header className="factory-header" inert={Boolean(panel)}>
        <button className="lakkan-wordmark" aria-label="Lakkan — 全体に戻る" onClick={() => window.__machine?.setCamera("overview")}>Lakkan</button>
        <button className="menu-toggle" ref={menuRef} onClick={openMenu} aria-label="Menuを開く" aria-haspopup="dialog" aria-expanded={panel === "menu"}>Menu<Cross plus /></button>
      </header>
      <div className="factory-hud" inert={Boolean(panel)}>
        <p className="gesture-hint"><svg viewBox="0 0 16 22" fill="none" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="19" rx="5.5" stroke="currentColor" /><path d="M8 5v4" stroke="currentColor" strokeLinecap="round" /></svg><span>Drag to explore</span></p>
        <button className="play-toggle" onClick={togglePlayback} disabled={!ready} aria-label={paused ? "動きを再開" : "動きを一時停止"} aria-pressed={paused}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{paused ? <path d="m6 4 10 6-10 6V4Z" /> : <><rect x="5" y="4" width="2" height="12" rx=".4" /><rect x="12" y="4" width="2" height="12" rx=".4" /></>}</svg>
        </button>
      </div>
      <p className="sr-only">装置をクリックまたはタップすると作品が開きます。矢印キーとEnter、またはMenuからも選べます。</p>
      {panel && <div className="panel-layer">
        <button className="panel-backdrop" aria-label="探索に戻る" tabIndex={-1} onClick={closePanel} />
        <div ref={dialogRef} className={`factory-panel ${panel}-panel`} role="dialog" aria-modal="true" aria-labelledby="panel-title">
          <div className="panel-top"><h1 id="panel-title">{dialogTitle}</h1><button className="icon-button" onClick={closePanel} aria-label="閉じて探索に戻る"><Cross /></button></div>
          {panel === "work" && <>
            <a className="work-preview" href={work.url} target="_blank" rel="noopener noreferrer" aria-label={`${work.name}の公開作品を開く`}><WorkImage key={work.id} work={work} /><span className="preview-arrow"><Arrow /></span></a>
            <div className="work-caption"><h2>{work.name}</h2><a className="work-link" href={work.url} target="_blank" rel="noopener noreferrer">作品を見る<Arrow /></a></div>
            <nav className="work-pager" aria-label="作品の切り替え"><button className="icon-button" aria-label="前の作品" onClick={() => openStation(works[(activeIndex + works.length - 1) % works.length].station)}><Arrow direction="left" /></button><span>{String(activeIndex + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span><button className="icon-button" aria-label="次の作品" onClick={() => openStation(works[(activeIndex + 1) % works.length].station)}><Arrow direction="right" /></button></nav>
          </>}
          {panel === "menu" && <>
            <nav className="menu-works" aria-label="作品を選ぶ">{works.map(w => <button key={w.id} onClick={() => openStation(w.station)}><span>{w.label}</span><span>{w.name}<Arrow /></span></button>)}</nav>
            <nav className="menu-secondary" aria-label="Lakkanについて"><Link href="/works">Works<Arrow /></Link><Link href="/services">Services<Arrow /></Link><Link href="/about">About<Arrow /></Link><Link href="/contact">Contact<Arrow /></Link></nav>
          </>}
          {panel === "contact" && <div className="contact-content"><p>話すことから、はじめよう。</p><Link href="/contact">お問い合わせ<Arrow /></Link></div>}
        </div>
      </div>}
    </main>
  );
}
