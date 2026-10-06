"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./LakkanHome.module.css";

const links = [
  ["#home-services", "できること"],
  ["#home-works", "制作例"],
  ["/about", "私たちについて"],
];

export function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const intro = document.getElementById("home-intro");
    if (!intro || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPaper(!entry.isIntersecting && entry.boundingClientRect.bottom < 90);
    }, { rootMargin: "-88px 0px 0px 0px" });
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.header} data-paper={paper} onKeyDown={event => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} aria-label="Lakkan ホーム">Lakkan</Link>
        <nav className={styles.desktopNav} aria-label="メインナビゲーション">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/contact#inquiry" className={styles.navContact}>相談する <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </nav>
        <button ref={toggle} type="button" className={styles.menuToggle}
          aria-expanded={open} aria-controls="home-mobile-nav"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen(!open)}>
          {open ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>
      <nav id="home-mobile-nav" className={styles.mobileNav} aria-label="モバイルナビゲーション" hidden={!open}>
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={20} aria-hidden="true" /></Link>)}
        <Link href="/contact#inquiry" onClick={() => setOpen(false)}>相談する<ArrowUpRight size={20} aria-hidden="true" /></Link>
      </nav>
    </header>
  );
}
