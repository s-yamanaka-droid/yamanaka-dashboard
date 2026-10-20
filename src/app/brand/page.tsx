import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LakkanLogo } from "@/components/brand/LakkanLogo";
import { SectionShell } from "@/components/primitives/SectionShell";
import "./brand-culture.css";

const stillLife = "/brand/editorial/lakkan-still-life-20261020.webp";

export const metadata: Metadata = {
  title: "Lakkan Brand — 余白から、おもしろく。",
  description: "考えて、つくって、軽くする。Lakkanのロゴ、紙の手触り、Racco、音楽。仕事と、そのまわりにあるブランドのかたち。",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Lakkan Brand — 余白から、おもしろく。",
    url: "/brand",
    images: [{ url: stillLife, width: 1448, height: 1086, alt: "Lakkanのロゴを配した名刺とレコードのブランドイメージ" }],
  },
};

export default function BrandPage() {
  return <div className="brand-culture">
    <header className="bc-header">
      <Link href="/" aria-label="Lakkan ホーム"><LakkanLogo /></Link>
      <nav aria-label="ブランドナビゲーション">
        <a href="#idea">考え方</a><Link href="/works">つくったもの</Link><Link href="/racco">Racco</Link><Link href="/records">Records</Link>
      </nav>
    </header>

    <main id="main">
      <SectionShell id="brand-intro" className="bc-intro">
        <div className="bc-hero">
          <div className="bc-hero-copy">
            <p className="bc-kicker">LAKKAN / BRAND &amp; CULTURE</p>
            <h1><span>余白から、</span><span>おもしろく。</span></h1>
            <p className="bc-lede">考えて、つくって、軽くする。<br />Lakkanの仕事と、そのまわり。</p>
            <a className="bc-text-link" href="#idea">Lakkanの考え方 <ArrowDown size={18} aria-hidden="true" /></a>
            <div className="bc-signature"><LakkanLogo variant="signature" size="feature" /></div>
          </div>
          <figure className="bc-hero-art">
            <Image src={stillLife} alt="朱赤の布の上に、Lakkanのロゴを配したコットン紙の名刺とレコードジャケット。ブランドの展開イメージ。" width={1448} height={1086} priority sizes="(max-width:760px) 100vw, 63vw" />
            <figcaption>LAKKAN — IDENTITY IN EVERYDAY LIFE</figcaption>
          </figure>
        </div>
      </SectionShell>

      <SectionShell id="identity" className="bc-collection">
        <div className="bc-section-heading"><h2>つくる。遊ぶ。<br className="bc-mobile-break" />余白ができる。</h2><span>THE LAKKAN COLLECTION</span></div>
        <div className="bc-gallery">
          <a className="bc-tile bc-identity" href="#idea">
            <span className="bc-tile-label">IDENTITY <ArrowUpRight size={19} aria-hidden="true" /></span>
            <div className="bc-paper-card"><LakkanLogo /></div>
            <div className="bc-tile-caption"><h3>手触りまで、らしく。</h3><p>ロゴと、紙と、小さな楽観。</p></div>
          </a>
          <Link className="bc-tile bc-racco" href="/racco">
            <span className="bc-tile-label">RACCO <ArrowUpRight size={19} aria-hidden="true" /></span>
            <Image src="/brand-book/racco-self-avatar.png" alt="太縁メガネと半目がいつもの顔、Racco" width={1254} height={1254} sizes="(max-width:760px) 40vw, 22vw" />
            <div className="bc-tile-caption"><h3>だいたい、眠い。</h3><p>いつもの顔に、会いにいく。</p></div>
          </Link>
          <Link className="bc-tile bc-records" href="/records">
            <span className="bc-tile-label">RECORDS <ArrowUpRight size={19} aria-hidden="true" /></span>
            <div className="bc-vinyl" aria-hidden="true"><div className="bc-vinyl-label"><LakkanLogo /></div></div>
            <div className="bc-tile-caption"><h3>余白に、音楽を。</h3><p>Lakkanを聴く。</p></div>
          </Link>
        </div>
      </SectionShell>

      <SectionShell id="idea" className="bc-idea">
        <div className="bc-idea-grid">
          <div><p className="bc-kicker">OUR KIND OF OPTIMISM</p><h2>楽観は、<br />手を動かすこと。</h2></div>
          <div className="bc-idea-body"><p>「こうなったらいいな」を、つくってみる。<br />同じ作業を減らしたり、<br />ばらばらだった仕組みをつないだり。</p><p>仕事が少し軽くなると、<br />考える時間や、寄り道する時間が生まれる。<br />その余白から、またおもしろいことを。</p><Link className="bc-text-link" href="/services">Lakkanにできること <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </div>
      </SectionShell>

      <SectionShell id="brand-more" className="bc-more">
        <div className="bc-more-heading"><LakkanLogo variant="signature" size="feature" /><p>ひとつのマークから、いろんな表情へ。</p></div>
        <nav aria-label="ブランドをもっと見る"><Link href="/works">つくったもの <ArrowUpRight size={20} aria-hidden="true" /></Link><Link href="/brand-book">Raccoのブランドブック <ArrowUpRight size={20} aria-hidden="true" /></Link><Link href="/concept#assets">ロゴと素材 <ArrowUpRight size={20} aria-hidden="true" /></Link></nav>
        <p className="bc-art-note">名刺・レコードの物撮りは、ブランドの展開を表す生成イメージです。</p>
      </SectionShell>
    </main>

    <footer className="bc-footer"><Link href="/">株式会社Lakkan</Link><div><Link href="/about">会社情報</Link><Link href="/contact">相談する <ArrowUpRight size={14} aria-hidden="true" /></Link><Link href="/privacy">Privacy</Link></div><small>© 2026 Lakkan Inc.</small></footer>
  </div>;
}
