"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LakkanLogo } from "@/components/brand/LakkanLogo";
export function SiteFooter() {
  const pathname = usePathname();
  if ((pathname.startsWith("/racco/columns/") || pathname.startsWith("/racco/goods/") || pathname === "/racco/contact" || pathname === "/racco/studio") || ["/", "/workshop", "/records", "/racco", "/concept", "/brand-book", "/brand-guide"].includes(pathname)) return null;
  return <footer className="site-footer original-footer">
    <Link href="/" className="original-footer-brand" aria-label="Lakkan ホーム"><LakkanLogo tone="red" /></Link>
    <p>考えたら、つくる。<br/>つくったら、動かす。</p>
    <nav aria-label="フッターナビゲーション"><Link href="/works">実績</Link><Link href="/services">できること</Link><Link href="/about">会社情報</Link><Link href="/records">Lakkanを聴く</Link><Link href="/racco">Raccoに会う</Link><Link href="/atelier">実験室</Link><Link href="/changelog">更新情報</Link><Link href="/contact">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav>
    <small>© 2026 株式会社Lakkan</small>
  </footer>;
}
