"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links=[["/services","できること"],["/#news","News"],["/works","実績"],["/about","会社情報"],["/contact","相談する"]];
export function SiteHeader(){
 const pathname=usePathname();
 return <header className="site-header journal-header"><div className="journal-topline"><span>PEOPLE, TECHNOLOGY & BUSINESS</span><span>株式会社Lakkan</span></div><Link href="/" className="site-logo journal-wordmark" aria-label="Lakkan ホーム">Lakkan.</Link><p>楽観と、計画と。</p><nav aria-label="メインナビゲーション">{links.map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?"page":undefined}>{label}</Link>)}</nav></header>;
}
