"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import {
  brandPrinciples,
  channels,
  repairPrompt,
  starterPrompt,
  voiceRules,
  workCycle,
} from "@/data/brand-book";

const totalPages = channels.length + 6;

function Sheet({
  page,
  label,
  className = "",
  children,
}: {
  page: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`bp-sheet ${className}`} aria-label={`${page}ページ：${label}`}>
      <header className="bp-sheet-head">
        <span className="bp-edition">RACCO / BRAND BOOK</span>
        <span>{label}</span>
      </header>
      <div className="bp-sheet-body">{children}</div>
      <footer className="bp-page-foot">
        <span>ラクするためなら、手間を惜しまない。</span>
        <span className="bp-page-number">{String(page).padStart(2, "0")} / {totalPages}</span>
      </footer>
    </article>
  );
}

function BookImage({
  name,
  alt,
  square = false,
}: {
  name: string;
  alt: string;
  square?: boolean;
}) {
  return (
    <Image
      src={`/brand-book/${name}.png`}
      alt={alt}
      width={square ? 1254 : name.startsWith("racco-world") || name === "racco-glasses" ? 1672 : 1536}
      height={square ? 1254 : name.startsWith("racco-world") || name === "racco-glasses" ? 941 : 1024}
      sizes="(max-width: 720px) 100vw, 700px"
      loading="eager"
      unoptimized
    />
  );
}

export function BrandBookPrint() {
  const [preparingPrint, setPreparingPrint] = useState(false);

  async function printBook() {
    setPreparingPrint(true);
    try {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.querySelectorAll<HTMLImageElement>(".brand-print-route img"))
          .map((image) => image.decode().catch(() => undefined)),
      );
      window.print();
    } finally {
      setPreparingPrint(false);
    }
  }

  return (
    <main id="main" className="brand-print-route">
      <div className="bp-toolbar" aria-label="資料の操作">
        <Link href="/racco"><ArrowLeft size={16} aria-hidden="true" />Raccoへ戻る</Link>
        <p>A4横 / {totalPages}ページ <span>印刷設定で「背景のグラフィック」をオンに</span></p>
        <div>
          <a href="/brand-book/brand-book.md" download><Download size={16} aria-hidden="true" />原稿 MD</a>
          <button type="button" onClick={printBook} disabled={preparingPrint} aria-busy={preparingPrint}>
            <Printer size={16} aria-hidden="true" />{preparingPrint ? "印刷を準備中…" : "印刷 / PDF保存"}
          </button>
        </div>
      </div>

      <div className="bp-pages">
        <Sheet page={1} label="CONCEPT & EXPRESSION" className="bp-cover">
          <div className="bp-cover-copy">
            <p className="bp-kicker">Racco Brand Book</p>
            <h1 className="bp-logo">Racco<span aria-hidden="true">↗</span></h1>
            <h2>ラクするためなら、<br />手間を惜しまない。</h2>
            <p className="bp-cover-lead">Lakkanの中にいる、だるそうなラッコ。<br />できれば寝てたい。<br />でも、ラクするための工夫はする。</p>
            <p className="bp-cover-caption">コンセプト / 世界観 / 編集の姿勢 / 媒体別の使い方</p>
          </div>
          <div className="bp-cover-image"><BookImage name="racco-world" alt="半目のRaccoが灰色のパーカーを着て、ソファでくつろぐ世界観" /></div>
        </Sheet>

        <Sheet page={2} label="01 / BRAND AXIS" className="bp-axis-sheet">
          <p className="bp-kicker">The everyday experiment</p>
          <h2 className="bp-title">AIすごいのは分かった。<br />で、今日どこで使う？</h2>
          <div className="bp-axis-grid">
            <div className="bp-axis-intro">
              <p className="bp-large-copy">頑張り続けるのはだるい。<br />でも、雑な仕事をしたいわけじゃない。</p>
              <p>探しているファイル、書きかけの返事、毎朝のコピペ。Raccoが話すのは、手元の小さな面倒。AIも道具のひとつとして、どこを任せられるか考える。</p>
              <p>先生でも営業マンでもなく、隣でいっしょに考える味方。ぼやきや言い直しを残し、毎回きれいな教訓にしない。</p>
              <p className="bp-axis-boundary">RaccoはLakkanの中にいる。会社の作品紹介とキャラクターのせりふは、それぞれの口調で。ブランドブックと製品案内は分け、相談・購入へ自動誘導しない。</p>
            </div>
            <div className="bp-principles">
              {brandPrinciples.map((principle, index) => (
                <div key={principle.title}>
                  <span className="bp-small-number">0{index + 1}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bp-takeaway"><span>持ち帰る最小単位</span><strong>仕事カード1枚 ＋ 直した指示の差分 ＋ 残る確認</strong></div>
        </Sheet>

        <Sheet page={3} label="02 / CHARACTER & WORLD">
          <p className="bp-kicker">Same Racco, different moments</p>
          <h2 className="bp-title">だるい顔のまま、仕込みはする。</h2>
          <div className="bp-character-grid">
            <figure>
              <BookImage name="racco-world" alt="通常版のRacco。半目、茶色い毛、灰色のパーカー" />
              <figcaption><strong>通常版 / 日常と共感</strong><span>ブランドの入口。気負わない半目、茶色い毛、灰パーカー。銀のAIバッジと小さなコーラルのカーソル。</span></figcaption>
            </figure>
            <figure>
              <BookImage name="racco-glasses" alt="薄い丸フレームのメガネをかけた仕込み中のRacco" />
              <figcaption><strong>メガネ版 / 仕込み中</strong><span>仕事カード、比較、指示の修正を扱う差分。薄い丸フレームで目を隠さず、半目の表情を保つ。</span></figcaption>
            </figure>
          </div>
          <div className="bp-rule-strip"><h3>変えない約束</h3><p>メガネをかけても、別人格・先生・別アカウントにはしない。ロボット眼、ネオン回路、大きな鎧は足さない。3Dは世界観、太い輪郭の2Dは印刷へ。生成画像の文字は正式ロゴ原本や入稿データとして使わない。</p></div>
          <p className="bp-note">画像は生成した世界観表現。商品の実物写真や、AI活用の効果を証明する画像ではありません。</p>
        </Sheet>

        <Sheet page={4} label="03 / VOICE & WORK CYCLE" className="bp-voice-sheet">
          <p className="bp-kicker">Voice, proof, and the next try</p>
          <h2 className="bp-title">仕込みも、ズレも、隠さない。</h2>
          <div className="bp-voice-grid">
            <div>
              <h3 className="bp-column-title">言葉のものさし</h3>
              <table className="bp-voice-table">
                <thead><tr><th>Raccoの言葉</th><th>避ける言葉 / 理由</th></tr></thead>
                <tbody>{voiceRules.map((rule) => <tr key={rule.good}><td>{rule.good}</td><td><span>{rule.bad}</span><small>{rule.reason}</small></td></tr>)}</tbody>
              </table>
            </div>
            <div>
              <h3 className="bp-column-title">一つの仕事を、次へ残す</h3>
              <ol className="bp-cycle">{workCycle.map((step, index) => <li key={step.label}><span>{index + 1}</span><div><h4>{step.label}</h4><p>{step.detail}</p></div></li>)}</ol>
            </div>
          </div>
          <div className="bp-rule-strip"><h3>投稿の余白</h3><p>手元の小さな場面から話す。言い直しを残し、ぼやきで終わってもいい。創作のせりふと実験の記録は分ける。実験を書くときは、材料・修正・まだ確かめていないことを添える。</p></div>
        </Sheet>

        {channels.map((channel, index) => (
          <Sheet key={channel.id} page={index + 5} label={`04 / CHANNEL ${String(index + 1).padStart(2, "0")}`} className={`bp-channel-sheet bp-channel-${channel.id}`}>
            <p className="bp-kicker">Same Racco, different everyday moments</p>
            <div className="bp-channel-heading"><h2 className="bp-channel-name">{channel.name}</h2><p>{channel.subtitle}</p></div>
            <div className="bp-channel-grid">
              <div className="bp-channel-strategy">
                <div className="bp-channel-role"><span>この媒体の役割</span><h3>{channel.role}</h3></div>
                <div className="bp-channel-profile"><h3>プロフィール案</h3><p>{channel.profile}</p></div>
                <dl className="bp-channel-spec"><div><dt>届ける形</dt><dd>{channel.format}</dd></div><div><dt>終わり方</dt><dd>{channel.cta}</dd></div></dl>
              </div>
              <div className="bp-post-example">
                <div className="bp-example-head"><div className="bp-avatar"><BookImage name="racco-profile" alt="Raccoのプロフィール画像" square /></div><div><strong>Racco / Lakkan</strong><span>キャラクターの創作文案 / 表示例</span></div></div>
                <p>{channel.sample}</p>
                <div className="bp-example-bottom">実体験・実績の報告ではありません。</div>
              </div>
            </div>
            <p className="bp-note">プロフィール・投稿は未公開の下書き。日常場面はRaccoの口調を確かめるための創作です。運営者の実体験、実サービスの表示仕様、アルゴリズムや成果の実証ではありません。</p>
          </Sheet>
        ))}

        <Sheet page={channels.length + 5} label="05 / WORLD TO OBJECTS" className="bp-merch-sheet">
          <p className="bp-kicker">Take the mood home</p>
          <h2 className="bp-title">サボる気分を、持ち帰る。</h2>
          <div className="bp-merch-grid">
            <figure><BookImage name="racco-apparel" alt="Raccoの平面イラストを印刷した灰色のパーカーとニット帽の生成モック" /><figcaption><strong>Apparel / 灰パーカーと小さな合図</strong><span>布の質感は立体的に。印刷するRaccoは太い輪郭の2Dとして扱う。</span></figcaption></figure>
            <figure><BookImage name="racco-desk" alt="Raccoのマグ、ステッカー、透明チャームを机に置いた生成モック" /><figcaption><strong>Desk objects / いつもの机の相棒</strong><span>マグ、ステッカー、透明チャーム。ホログラムは表面の加工とし、キャラクター自体を立体化しない。</span></figcaption></figure>
          </div>
          <div className="bp-rule-strip"><h3>生成モック / 販売・製造は未決定</h3><p>世界観の表現であり、実物・製造仕様・商品化完了ではない。入稿は単一の編集原稿から展開し、ロゴの権利、色、線幅、素材別の再現性を別に確認する。ここに購入導線は設けない。</p></div>
        </Sheet>

        <Sheet page={channels.length + 6} label="06 / USE & BOUNDARIES" className="bp-use-sheet">
          <p className="bp-kicker">Start small. Keep the correction.</p>
          <h2 className="bp-title">ひとつ渡す。違ったら、直す。</h2>
          <div className="bp-prompts">
            <div><h3>最初の仕事カード</h3><pre>{starterPrompt}</pre></div>
            <div><h3>ズレを直すとき</h3><pre>{repairPrompt}</pre></div>
          </div>
          <p className="bp-use-note">使う材料は匿名化し、秘密・認証情報・不要な個人情報を除く。読者の経験を紹介する前に、出所と共有許可を確認する。事実・権利・送信・公開は人が確認し、採用した一文を次の依頼へ実際に貼る。</p>
          <p className="bp-source">Lakkan / Racco ブランドブック。Webと本冊は同じ内容から展開しています。画像は生成素材、本文は制作・運用案を含みます。効果・商標・印刷品質・商品化の確認は別工程です。</p>
        </Sheet>
      </div>
    </main>
  );
}
