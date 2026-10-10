import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { raccoGoods } from "@/data/racco-goods";
import { raccoRounded, raccoLogo } from "@/lib/racco-fonts";
import { buildRaccoInquiryHref } from "@/lib/racco-inquiry";
import "@/components/brand/brand-library.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return raccoGoods.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = raccoGoods.find(product => product.slug === slug);
  if (!item) notFound();

  const description = `${item.description} 商品化準備中の生成デザインです。注文・予約は受け付けていません。`;
  return {
    title: `${item.title} | Racco`,
    description,
    alternates: { canonical: `/racco/goods/${item.slug}` },
    openGraph: {
      type: "website",
      title: `${item.title} | Racco`,
      description,
      url: `/racco/goods/${item.slug}`,
      images: [{ url: item.image, width: item.width, height: item.height, alt: item.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: `${item.title} | Racco`, description, images: [item.image] },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const item = raccoGoods.find(product => product.slug === slug);
  if (!item) notFound();

  return (
    <div className={`${raccoRounded.variable} ${raccoLogo.variable}`}>
      <div className="brand-library" data-brand="racco" data-motion="off">
        <div className="bl-shell">
          <header className="bl-header bl-column-header">
            <Link href="/concept" className="bl-label" aria-label="Lakkanについて">Lakkan<span>ラクするほうを、つくろう。</span></Link>
            <Link href="/racco" className="bl-brand"><span className="bl-brand-thumb"><Image src="/brand-book/racco-self-avatar.png" width={48} height={48} alt=""/></span>Racco</Link>
            <Link href="/racco#goods" className="bl-text-link">グッズ一覧<ArrowRight size={15} aria-hidden="true"/></Link>
          </header>

          <main id="main" className="bl-column-main bl-goods-main">
            <nav aria-label="グッズのナビゲーション">
              <Link className="bl-text-link" href="/racco#goods"><ArrowLeft size={15} aria-hidden="true"/>グッズに戻る</Link>
            </nav>
            <article className="bl-goods-detail">
              <figure className="bl-goods-art">
                <Image
                  src={item.image}
                  width={item.width}
                  height={item.height}
                  alt={item.imageAlt}
                  sizes="(max-width: 760px) calc(100vw - 44px), 520px"
                  quality={90}
                  preload
                />
                <figcaption>生成デザイン・制作見本です。製造済み商品の写真ではありません。</figcaption>
              </figure>
              <div className="bl-goods-copy">
                <header>
                  <p className="bl-kicker">Racco goods</p>
                  <span className="bl-goods-label">{item.statusLabel}</span>
                  <h1>{item.title}</h1>
                  <p className="bl-goods-intro">{item.subtitle}</p>
                </header>
                <p>{item.description}</p>
                <p>{item.designNote}</p>
                <dl className="bl-goods-spec">
                  {[
                    ["価格", "調整中"],
                    ["サイズ", "調整中"],
                    ["素材・加工", "調整中"],
                    ["送料・発送時期", "調整中"],
                  ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
                <p className="bl-goods-note">販売開始時期は未定です。現在、注文・予約は受け付けていません。画像の色や形、仕様は商品化の際に変わる場合があります。</p>
                <Link
                  className="bl-pill bl-hero-cta"
                  href={buildRaccoInquiryHref({ source: "racco-goods", product: item.slug, intent: "goods" })}
                >グッズについて問い合わせる<ArrowRight size={15} aria-hidden="true"/></Link>
                <p className="bl-goods-note">問い合わせフォームへ進みます。お問い合わせは購入や予約にはなりません。</p>
                <Link className="bl-text-link" href={item.collectionHref}>関連するコレクションを見る<ArrowUpRight size={15} aria-hidden="true"/></Link>
              </div>
            </article>

            <nav className="bl-column-related" aria-label="ほかのグッズデザイン">
              <h2>こっちも、どうぞ。</h2>
              {raccoGoods.filter(product => product.slug !== item.slug).map(product => (
                <Link key={product.slug} href={`/racco/goods/${product.slug}`}><span>{product.title}</span><ArrowRight size={18} aria-hidden="true"/></Link>
              ))}
            </nav>
          </main>

          <footer className="bl-footer"><span>日常に、Raccoを。</span><div><Link href="/racco#goods">グッズ一覧</Link><Link href="/racco#members">Raccoと、なかま</Link><Link href="/concept">Lakkanについて</Link></div></footer>
        </div>
      </div>
    </div>
  );
}
