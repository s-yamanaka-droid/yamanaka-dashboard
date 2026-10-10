import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ContactForm } from "@/app/contact/ContactForm";
import { raccoLogo, raccoRounded } from "@/lib/racco-fonts";
import { resolveRaccoInquiryContext } from "@/lib/racco-inquiry";
import "./racco-contact.css";

export const metadata: Metadata = {
  title: "AIのこと、ちょっと話そう。 — Racco",
  description: "自分の仕事だと何に使える？ 毎回やっているこの作業、任せられない？ AIのことも、Raccoのグッズのことも、Lakkanへ気軽にご相談ください。",
  robots: { index: false, follow: true },
};

export default async function RaccoContactPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const context = resolveRaccoInquiryContext(query) ?? resolveRaccoInquiryContext({ source: "racco-home", intent: "ai" });
  return <div className={`racco-contact ${raccoRounded.variable} ${raccoLogo.variable}`} data-brand="racco">
    <header className="rc-header">
      <Link className="rc-brand" href="/racco" aria-label="Racco ホーム"><strong>Racco<span aria-hidden="true">′</span></strong><small>by Lakkan</small></Link>
      <nav aria-label="Raccoナビゲーション"><Link href="/racco#columns">読みもの</Link><Link href="/racco#members">なかま</Link><Link href="/racco#goods">グッズ</Link></nav>
      <Link className="rc-back" href="/racco"><ArrowLeft size={16} aria-hidden="true" /><span>Raccoに戻る</span></Link>
    </header>
    <main id="main" className="rc-main">
      <section className="rc-hero rc-hero-companions" aria-labelledby="rc-title">
        <div className="rc-hero-image"><Image src="/brand-book/racco-fuwafuwa-shop-v2.png" alt="メガネのRaccoとゴマアザラシのふわふわさんが、お店で並んでくつろいでいる" fill sizes="(max-width: 900px) 100vw, 750px" priority /></div>
        <div className="rc-hero-copy">
          <p className="rc-eyebrow">RACCO / LET’S TALK</p>
          <h1 id="rc-title"><span>AIのこと、</span><span>ちょっと話そう。</span></h1>
          <p>「自分の仕事だと、何に使える？」<br />そんな話から、一緒に考えます。</p>
          <a className="rc-primary" href="#inquiry">ちょっと相談してみる<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
      <ContactForm key={`${context?.source}-${context?.intent}-${context?.article?.slug}-${context?.product?.slug}`} variant="racco" initialTopic={context?.topic} raccoContext={context} />
    </main>
    <footer className="rc-footer"><Link className="rc-brand" href="/racco"><strong>Racco</strong><small>by Lakkan</small></Link><p>相談は、Lakkanがお受けします。</p><Link href="/privacy">プライバシーポリシー</Link></footer>
  </div>;
}
