"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
 if (usePathname() === "/") return <footer className="site-footer prisma-footer"><span>© 2026 株式会社Lakkan</span><nav aria-label="フッターナビゲーション"><Link href="/about">会社情報</Link><Link href="/contact">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav></footer>;
 return <footer className="site-footer" id="contact">
   <div className="footer-top"><p className="eyebrow light">LET’S MAKE IT HAPPEN</p><div className="footer-invite"><h2><span>次の一歩を、</span><span>一緒につくろう。</span></h2><Link href="/contact" className="round-link" aria-label="Lakkanに相談する"><ArrowUpRight/></Link></div><p className="footer-lede">まだ、まとまっていなくても大丈夫。<br/>その「やってみたい」から、はじめましょう。</p></div>
   <div className="footer-links"><p>AI strategy.<br/>Digital craft.<br/>Real-world impact.</p><nav aria-label="フッターナビゲーション"><Link href="/works">Works</Link><Link href="/services">Services</Link><Link href="/about">Studio</Link><Link href="/atelier">Lab</Link><Link href="/changelog">Updates</Link></nav><div><p>株式会社Lakkan</p><p>Tokyo, Japan</p><Link href="/contact">お問い合わせ <ArrowUpRight size={14}/></Link></div></div>
   <div className="footer-wordmark" aria-hidden="true">Lakkan</div>
   <div className="footer-bottom"><span>© 2026 Lakkan Inc.</span><span>楽観と、計画と。</span><Link href="/privacy">Privacy Policy</Link></div>
 </footer>;
}
