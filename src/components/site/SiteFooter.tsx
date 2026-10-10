"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function SiteFooter() {
  const pathname = usePathname();
  if ((pathname.startsWith("/racco/columns/") || pathname.startsWith("/racco/goods/") || pathname === "/racco/contact") || ["/", "/racco", "/concept", "/brand-book", "/brand-guide"].includes(pathname)) return null;
  return <footer className="site-footer original-footer">
    <Link href="/" className="original-footer-brand" aria-label="Lakkan ホーム"><span className="brand-wordmark">Lakkan</span></Link>
    <p>業務を見直す。技術を活かす。人と組織をつなぐ。</p>
    <nav aria-label="フッターナビゲーション"><Link href="/works">実績</Link><Link href="/services">できること</Link><Link href="/about">会社情報</Link><Link href="/atelier">実験室</Link><Link href="/changelog">更新情報</Link><Link href="/contact">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav>
    <small>© 2026 株式会社Lakkan</small>
  </footer>;
}
