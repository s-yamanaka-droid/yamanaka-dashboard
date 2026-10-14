import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import WavingPortfolioLanding from "@/components/ui/waving-portfolio-landing";
import CrowdCanvas from "@/components/ui/skiper39";
import { SectionShell } from "@/components/primitives/SectionShell";
import { CompanyIntroduction } from "@/components/site/CompanyIntroduction";
import { LakkanLogo } from "@/components/brand/LakkanLogo";
import { ServiceEntry } from "@/components/site/ServiceEntry";
import "./poster-home.css";

export const metadata: Metadata = {
  title: { absolute: "株式会社Lakkan — 人と仕事の課題を、整理から実装まで。" },
  description: "業務改善・AI活用、CRM・業務アプリ開発、Webサイト・LP制作、採用・人材支援。Lakkanは、課題の整理から実装・運用まで伴走します。",
};

export default function Home() {
  return (
    <main id="main" className="poster-home" data-home="poster-crowd">
      <div className="poster-hero">
        <WavingPortfolioLanding
          name="Lakkan Inc."
          year="2026"
          roles={["PEOPLE & WORK", "IDEAS TO ACTION"]}
          lettersLeft={["LA", "WOR"]}
          giantLetter="K"
          lettersRight={["KAN", "S"]}
          title="株式会社Lakkan — 人と仕事の課題を、整理から実装まで。"
          signature="LAK/KAN"
          greeting="HELLO!"
          accent="#B4382B"
          paper="#F4F0E8"
          ink="#17221F"
          typeface="poster"
          height="100%"
        />
        <nav className="poster-nav" aria-label="メインナビゲーション">
          <Link href="/works">実績</Link>
          <Link href="/services">できること</Link>
          <Link href="/about">会社情報</Link>
          <Link href="/racco">Racco</Link>
          <Link className="poster-nav-contact" href="/contact?topic=other#inquiry">相談する <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </nav>
        <a className="poster-scroll" href="#people">SCROLL TO PEOPLE <ArrowDownRight size={17} aria-hidden="true" /></a>
      </div>

      <SectionShell id="home-racco" className="poster-home-racco" tone="white" topBorder>
        <Link href="/racco" className="home-racco-link" aria-labelledby="home-racco-title home-racco-cta">
          <div className="home-racco-copy">
            <p className="home-racco-kicker">LAKKAN / RACCO</p>
            <h2 id="home-racco-title">Racco</h2>
            <p className="home-racco-tagline"><span>同じ作業は、</span><span>AIに任せたい。</span></p>
            <p className="home-racco-description"><span>AIの読みもの、</span><span>仲間たち、</span><span>ギャラリー。</span></p>
            <span className="home-racco-cta" id="home-racco-cta">Raccoの世界へ <ArrowUpRight size={20} aria-hidden="true" /></span>
          </div>
          <div className="home-racco-portrait">
            <Image src="/brand-book/racco-scenes/welcoming.png" alt="" width={1254} height={1254} sizes="(max-width: 760px) 42vw, 340px" />
          </div>
        </Link>
      </SectionShell>

      <SectionShell id="people" className="poster-people" tone="white" eyebrow="PEOPLE MAKE THINGS MOVE" topBorder>
        <div className="people-intro">
          <div>
            <p className="people-kicker">LAKKAN / ABOUT OUR WORK</p>
            <h2><span className="people-heading-part">人と仕事の</span><span className="people-heading-part">あいだに、</span><br className="people-desktop-break" /><span className="people-heading-accent">いい動きを。</span></h2>
          </div>
          <p className="people-lede">何から始めればいいか、まだ決まっていなくても。<br />課題を一緒にほどき、つくり、動かし続ける。<br />Lakkanは整理から実装・運用まで伴走します。</p>
        </div>
        <CrowdCanvas src="/people/open-peeps-crowd.png" />
        <div className="people-links">
          <Link href="/services"><span>01 / WHAT WE DO</span><strong>できること</strong><ArrowUpRight aria-hidden="true" /></Link>
          <Link href="/works"><span>02 / SELECTED WORKS</span><strong>制作・運用例</strong><ArrowUpRight aria-hidden="true" /></Link>
          <Link href="/records"><span>03 / LAKKAN RECORDS</span><strong>Lakkanを聴く</strong><ArrowUpRight aria-hidden="true" /></Link>
          <Link href="/workshop"><span>04 / INTERACTIVE</span><strong>工房を探索する</strong><ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="people-outro" id="now-on-air">
          <p>AIの変化を、仕事のヒントに。</p>
          <a href="https://nowonair.vercel.app/">Now on AIrを読む <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <div className="people-outro">
          <p>一緒に、次の動きを。</p>
          <Link href="/contact?topic=other#inquiry">相談する <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <p className="people-credit">Illustrations: Open Peeps by Pablo Stanley · Crowd interaction adapted from Skiper UI</p>
      </SectionShell>
      <SectionShell id="racco-services" className="poster-home-services" topBorder><ServiceEntry /></SectionShell>
      <SectionShell id="company" className="poster-home-company" topBorder>
        <div className="home-company-mark"><LakkanLogo tone="red" size="feature" /></div>
        <CompanyIntroduction compact />
        <div className="home-company-details">
          <p><strong>株式会社Lakkan</strong><span>東京都渋谷区神宮前六丁目23番4号</span></p>
          <Link href="/contact">一緒に、次の動きを。<ArrowUpRight size={18} aria-hidden="true"/></Link>
        </div>
      </SectionShell>
    </main>
  );
}
