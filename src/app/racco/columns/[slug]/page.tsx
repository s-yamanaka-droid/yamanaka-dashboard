import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { raccoColumns } from "@/data/racco-columns";
import { raccoRounded, raccoLogo } from "@/lib/racco-fonts";
import { buildRaccoInquiryHref } from "@/lib/racco-inquiry";
import ColumnPrompt from "@/components/brand/ColumnPrompt";
import "@/components/brand/brand-library.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return raccoColumns.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = raccoColumns.find(item => item.slug === slug);
  if (!article) notFound();
  return {
    title: `${article.title} | Racco`, description: article.excerpt,
    alternates: { canonical: `/racco/columns/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, url: `/racco/columns/${article.slug}`, images: [{ url: article.image, width: 1672, height: 941, alt: article.imageAlt }] },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: [article.image] },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = raccoColumns.find(item => item.slug === slug);
  if (!article) notFound();
  return <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}>
    <div className="brand-library" data-brand="racco" data-motion="off"><div className="bl-shell">
      <header className="bl-header bl-column-header">
        <Link href="/concept" className="bl-label" aria-label="Lakkanについて">Lakkan<span>ラクするほうを、つくろう。</span></Link>
        <Link href="/racco" className="bl-brand"><span className="bl-brand-thumb"><Image src="/brand-book/racco-self-avatar.png" width={48} height={48} alt=""/></span>Racco</Link>
        <Link href="/racco#columns" className="bl-text-link">コラム一覧<ArrowRight size={15}/></Link>
      </header>
      <main id="main" className="bl-column-main">
        <nav aria-label="コラムのナビゲーション"><Link className="bl-text-link" href="/racco#columns"><ArrowLeft size={15}/>コラムに戻る</Link></nav>
        <article className="bl-column-article" data-brand-reveal>
          <header><p className="bl-kicker">RaccoのAIコラム / {article.category}</p><h1>{article.title}</h1><p className="bl-column-lead">{article.excerpt}</p><p className="bl-column-byline">Lakkan / Racco</p></header>
          <Image className="bl-column-cover" src={article.image} width={1672} height={941} alt={article.imageAlt} sizes="(max-width: 760px) calc(100vw - 44px), 720px" quality={90} preload/>
          {article.sections.map(part => <section key={part.heading} className="bl-column-section"><h2>{part.heading}</h2>{part.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <ColumnPrompt text={article.prompt}/>
          <aside className="bl-column-takeaway"><p className="bl-kicker">今日、ひとつ試すなら。</p><p>{article.takeaway}</p></aside>
        </article>
        <aside className="bl-column-inquiry"><p className="bl-kicker">自分の仕事で、試したいなら。</p><h2>どこから頼めばいいか、<br/>そこから一緒に。</h2><p>手間がかかっていることを、Lakkanに聞かせてください。</p><Link className="bl-pill bl-hero-cta" href={buildRaccoInquiryHref({ source: "racco-column", article: article.slug, intent: "ai" })}>この記事をきっかけに相談する<ArrowRight size={15}/></Link></aside>
        <nav className="bl-column-related" aria-label="ほかのコラム"><h2>こっちも、どうぞ。</h2>{raccoColumns.filter(item => item.slug !== article.slug).map(item => <Link key={item.slug} href={`/racco/columns/${item.slug}`}><span>{item.title}</span><ArrowRight size={18}/></Link>)}</nav>
      </main>
      <footer className="bl-footer"><span>サボるためのAI生存術</span><div><Link href="/racco#columns">コラム一覧</Link><Link href="/racco#members">Raccoと、なかま</Link><Link href="/concept">Lakkanについて</Link></div></footer>
    </div></div>
  </div>;
}
