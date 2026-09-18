"use client";
import Link from "next/link";
export function SiteFooter() {
  return <footer className="site-footer original-footer">
    <Link href="/" className="original-footer-brand" aria-label="Lakkan ホーム"><span className="brand-wordmark">Lakkan</span></Link>
    <p>ばらばらを、可能性に。</p>
    <nav aria-label="フッターナビゲーション"><Link href="/works">実績</Link><Link href="/services">できること</Link><Link href="/about">会社情報</Link><Link href="/atelier">実験室</Link><Link href="/changelog">更新情報</Link><Link href="/contact">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav>
    <small>© 2026 株式会社Lakkan</small>
  </footer>;
}
