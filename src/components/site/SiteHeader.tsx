"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [["/works", "Works", "実績"], ["/services", "Services", "できること"], ["/about", "Studio", "会社紹介"], ["/atelier", "Lab", "実験室"]];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  if (pathname === "/") return null;
  return <header className="site-header" onKeyDown={e => { if(e.key === "Escape"){setOpen(false);toggle.current?.focus();} }}>
    <Link href="/" className="site-logo" aria-label="Lakkan ホーム" onClick={() => setOpen(false)}><span className="logo-symbol" aria-hidden="true">L</span>Lakkan<span className="logo-dot">.</span></Link>
    <nav className="desktop-nav" aria-label="メインナビゲーション">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
    <Link className="header-contact" href="/contact">相談をはじめる <span className="button-orb"><ArrowUpRight size={16}/></span></Link>
    <button ref={toggle} className="menu-toggle" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="モバイルナビゲーション">{links.map(([href,label,jp]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}><span>{label}</span><small>{jp}</small><ArrowUpRight size={20}/></Link>)}<Link href="/contact" onClick={() => setOpen(false)}><span>Contact</span><small>相談する</small><ArrowUpRight size={20}/></Link></nav>}
  </header>;
}
