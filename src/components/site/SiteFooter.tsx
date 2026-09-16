"use client";
import Link from "next/link";
export function SiteFooter() {
  return <footer className="site-footer original-footer">
    <Link href="/" className="original-footer-brand">Lakkan<span>.</span></Link>
    <p>楽観と、計画と。</p>
    <nav aria-label="フッターナビゲーション"><Link href="/services">できること</Link><Link href="/about">会社情報</Link><Link href="/contact">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav>
    <small>© 2026 株式会社Lakkan</small>
  </footer>;
}
