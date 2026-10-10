"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import {
  brandPrinciples,
  channels,
  voiceRules,
  workCycle,
} from "@/data/brand-book";

const totalPages = channels.length + 6;
const printChannels = {
  threads: {
    role: "迷いと、言い直し",
    format: "ひとつの想定場面と、足す指示の一文。",
    cta: "無理に問いかけず、送る前に読むところで閉じる。",
    excerpt: "たとえば、いつもの相手に「資料ありがとう。明日見るね」と返したいとき。AIに「丁寧な返信を」とだけ頼んで、「平素より格別のご高配を賜り」が出てきたら。急に、知らない会社の自分。\n「何度もやりとりしている相手。いつもの敬語で、短く。まだ約束していない締切は足さない」まで渡してみる。\n下書きは任せたい。相手との距離感までは、まだ渡せてなかったな。送る前には読む。そこだけ、ちょっと起きる。",
  },
  x: {
    role: "足す一文を、短く",
    format: "一投稿に指示の差分をひとつ。想定例と明記。",
    cta: "結果が未確認のうちは「使えた」と書かない。",
    excerpt: "返信の下書きをAIに頼むなら。「丁寧に」だけで堅すぎたときは、\n「いつもの相手に、普段の敬語で短く。新しい約束は足さない」\nも渡してみる。これは試すための想定例。うまくいくかは、出た文を見てから。送信ボタンまでは任せない。そこは起きてる。",
  },
  instagram: {
    role: "違いを、順に見せる",
    format: "5枚構成：表紙→材料→想定初稿→追加指示→確認。",
    cta: "持ち帰れる一文を置く。自動送信は勧めない。",
    excerpt: "AIが書いた返事、よそ行きすぎる。「自分、そんな挨拶するっけ。」\nいつもの相手へ、資料のお礼と「明日確認する」を伝えたい。最初の頼み方は「丁寧な返信を作って」。\n足してみる一文：「何度もやりとりしている相手です。普段の敬語で、2文くらい。明日確認することだけ伝え、新しい締切や約束は足さないで」\n送る前は、人が読む。宛先・日時・約束が合っているか。自分が言いそうか。",
  },
  note: {
    role: "頼み方の過程を残す",
    format: "用途→最初の指示→ズレ→追加指示→人の確認。",
    cta: "結論はこの返信の範囲に。効果は測ってから。",
    excerpt: "いつもの相手から資料が届く。お礼と「明日確認する」を返したい。書くことは決まっているのに、書き出しの前で少し止まる。こういうところをAIに渡したい。\n丁寧さは頼んだけど、距離感は伝えてなかった。次に試す指示は、こう。\n「何度もやりとりしている相手に送ります。資料のお礼と、明日確認することを、普段の敬語で2文くらいに。」\n下書きは任せたい。でも、最後は自分の返事。読んでから送る。",
  },
};
const printStarterPrompt = `今回使う仕事カードと、初稿をひとつ作ってください。
任せたい仕事：［ひとつ］
誰が何に使うか：［用途］
使える材料：［共有してよい材料だけ］
完成の条件：［使える状態］
優先したいこと：［判断の順番］
避けたいこと：［勝手に決めないこと］

重大な不足だけ質問してください。
事実と仮置きを分け、未確認は補わないでください。
外部への送信・公開・設定変更はしないでください。`;
const printRepairPrompt = `期待したもの：［欲しかった状態］
実際に出たもの：［問題の箇所］
特に違う点：［一つから三つ］

1. どの基準からズレたか、箇所を示す。
2. 原因候補を根拠と仮説に分ける。
3. 必要な箇所だけ直す。
4. 次回へ足す指示を、最小限で出す。
5. 別の入力で確かめることを一つ挙げる。

「今回だけ」と「次も使う候補」を分けてください。
保存・次回読込は実際に確認します。`;

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
        <span>同じ作業は、AIに任せたい。</span>
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
      width={square ? 1254 : name === "racco-self-morning" || name === "racco-trio" ? 1672 : 1536}
      height={square ? 1254 : name === "racco-self-morning" || name === "racco-trio" ? 941 : 1024}
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
            <h2>同じ作業は、<br />AIに任せたい。</h2>
            <p className="bp-cover-lead">Lakkanの中にいる、だるそうなラッコ。<br />できれば寝てたい。<br />でも、ラクするための工夫はする。</p>
            <p className="bp-cover-caption">コンセプト / 世界観 / 編集の姿勢 / 媒体別の使い方</p>
          </div>
          <div className="bp-cover-image"><BookImage name="racco-self-morning" alt="太縁メガネと灰色のパーカーで、朝をのんびり過ごす主役のRacco" /></div>
        </Sheet>

        <Sheet page={2} label="01 / BRAND AXIS" className="bp-axis-sheet">
          <p className="bp-kicker">The everyday experiment</p>
          <h2 className="bp-title">AIすごいのは分かった。<br />で、今日どこで使う？</h2>
          <div className="bp-axis-grid">
            <div className="bp-axis-intro">
              <p className="bp-large-copy">頑張り続けるのはだるい。<br />でも、雑な仕事をしたいわけじゃない。</p>
              <p>書きかけの返事、毎朝のコピペ。手元の小さな面倒を、どこまでAIに任せられるか考える。</p>
              <p className="bp-axis-boundary">RaccoはLakkanの中にいる。先生や営業マンではなく味方。会社の作品紹介とせりふは分け、購入へ自動誘導しない。</p>
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

        <Sheet page={3} label="02 / CHARACTER & WORLD" className="bp-cast-sheet">
          <p className="bp-kicker">Racco and two friends</p>
          <h2 className="bp-title">Raccoと、ふたりの仲間。</h2>
          <div className="bp-cast-grid">
            <div>
              <figure className="bp-trio-image"><BookImage name="racco-trio" alt="灰色パーカーのRacco、コーラルの小柄な仲間、チャコールと丸メガネの長顔の仲間が過ごす朝" /></figure>
              <div className="bp-main-avatar"><BookImage name="racco-self-avatar" alt="主役Racco単独の太縁メガネのSNSアイコン" square /><p><strong>本人アバター / SNSアイコン</strong><span>太縁メガネのRaccoを単独で。丸メガネの仲間とは別の顔です。</span></p></div>
            </div>
            <div className="bp-cast-roles">
              <div><h3>のんびり担当 / Racco</h3><p>灰色パーカー、横に広い丸顔、半目。面倒に気づき、何を試すかと採否を決める主役。</p></div>
              <div><h3>テキパキ担当</h3><p>コーラルの上着、小柄で軽い体格。今日できるひとつを隣で進める。叱る上司にはしない。</p></div>
              <div><h3>自動化オタク担当</h3><p>チャコール、細長い顔と胴、寝癖と丸メガネ。繰り返しを減らす仕組みを考え、つい凝る仲間。</p></div>
            </div>
          </div>
          <div className="bp-rule-strip"><h3>3人とも、味方。</h3><p>先生・営業マン・万能役にしない。顔・体格・姿勢で区別し、投稿には必要な人数だけ。世界観は暖かな朝、柔らかな毛、布と木。画像は生成表現で、実績の証拠ではありません。</p></div>
          <p className="bp-note"><Link href="/racco#members">3人の紹介：lakkan-inc.vercel.app/racco#members</Link></p>
        </Sheet>

        <Sheet page={4} label="03 / VOICE & WORK CYCLE" className="bp-voice-sheet">
          <p className="bp-kicker">Voice, proof, and the next try</p>
          <h2 className="bp-title">試したことも、ズレも、隠さない。</h2>
          <div className="bp-voice-grid">
            <div>
              <h3 className="bp-column-title">言葉のものさし</h3>
              <table className="bp-voice-table">
                <thead><tr><th>Raccoの言葉</th><th>避ける言葉</th></tr></thead>
                <tbody>{voiceRules.map((rule) => <tr key={rule.good}><td>{rule.good}</td><td><span>{rule.bad}</span></td></tr>)}</tbody>
              </table>
            </div>
            <div>
              <h3 className="bp-column-title">一つの仕事を、次へ残す</h3>
              <ol className="bp-cycle">{workCycle.map((step, index) => <li key={step.label}><span>{index + 1}</span><div><h4>{step.label}</h4><p>{step.detail}</p></div></li>)}</ol>
            </div>
          </div>
          <div className="bp-rule-strip"><h3>投稿の余白</h3><p>小さな場面から話し、読者を急かさない。創作と実験は分ける。実験には材料・修正・未確認点を添える。<Link href="/brand-guide#voice">理由の全文はWebガイドへ。</Link></p></div>
        </Sheet>

        {channels.map((channel, index) => (
          <Sheet key={channel.id} page={index + 5} label={`04 / CHANNEL ${String(index + 1).padStart(2, "0")}`} className={`bp-channel-sheet bp-channel-${channel.id}`}>
            <p className="bp-kicker">Same Racco, different everyday moments</p>
            <div className="bp-channel-heading"><h2 className="bp-channel-name">{channel.name}</h2><p>{channel.subtitle}</p></div>
            <div className="bp-channel-grid">
              <div className="bp-channel-strategy">
                <div className="bp-channel-role"><span>この媒体の役割 / 印刷用の概要</span><h3>{printChannels[channel.id].role}</h3></div>
                <div className="bp-channel-profile"><h3>プロフィール案</h3><p>{channel.profile}</p></div>
                <dl className="bp-channel-spec"><div><dt>届ける形</dt><dd>{printChannels[channel.id].format}</dd></div><div><dt>終わり方</dt><dd>{printChannels[channel.id].cta}</dd></div></dl>
              </div>
              <div className="bp-post-example">
                <div className="bp-example-head"><div className="bp-avatar"><BookImage name="racco-self-avatar" alt="主役Raccoの太縁メガネのプロフィール画像" square /></div><div><strong>Racco / Lakkan</strong><span>キャラクターの創作文案 / 表示例</span></div></div>
                <p>{printChannels[channel.id].excerpt}</p>
                <div className="bp-example-bottom"><strong>文面抜粋 / 想定例</strong><Link href={`/racco#sns-${channel.id}`}>全文：lakkan-inc.vercel.app/racco#sns-{channel.id}</Link></div>
              </div>
            </div>
            <p className="bp-note">プロフィール・投稿は下書き。文面は創作の想定例を抜粋し、空行を整理しています。実際のAI出力・実体験・効果の実証ではありません。</p>
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
            <div><h3>最初の仕事カード / 印刷用の要約</h3><pre>{printStarterPrompt}</pre></div>
            <div><h3>ズレを直すとき / 印刷用の要約</h3><pre>{printRepairPrompt}</pre></div>
          </div>
          <p className="bp-use-note">材料は匿名化し、秘密・認証・不要な個人情報を除く。事実・権利・送信・公開は人が確認する。</p>
          <div className="bp-resource-links"><Link href="/brand-guide#experiment">指示の全文：/brand-guide#experiment</Link><Link href="/racco#assets">全素材：/racco#assets</Link><Link href="/racco#posts">投稿：/racco#posts</Link></div>
          <p className="bp-source">Lakkan / Racco ブランドブック。日本語はZen Maru Gothic、英字ロゴはNunito。Webと本冊は同じ内容から展開しています。画像は生成素材、本文は制作・運用案を含みます。効果・商標・印刷品質・商品化の確認は別工程です。</p>
        </Sheet>
      </div>
    </main>
  );
}
