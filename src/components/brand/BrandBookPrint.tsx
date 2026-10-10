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
    role: "仕事をひとつ選ぶ",
    format: "身近な場面と、その日に試せる頼み方。",
    cta: "自分の作業をひとつ選べるところで終える。",
    excerpt: "「AIでこんなのできる！」は分かった。\nで、今日の自分の仕事だと、どこに使う？\n新しいツールを探す前に、昨日めんどかった作業をひとつ選んでみる。\nたとえば会議メモなら、\n「決まったことと、次にやることを分けて。担当や期限が書いてなければ、未定のままで」\nと頼むところから。\nいきなり仕事を全部任せなくていい。まず、毎回めんどいあれをひとつ。",
  },
  x: {
    role: "直した指示を残す",
    format: "困りごと・指示・次に使う場面をひとつずつ。",
    cta: "同じ種類の仕事を頼むときのメモにする。",
    excerpt: "AIに毎回「もっと短く」って言ってない？\n直して終わりにせず、\n「結論から。箇条書きは3つまで。前置きはいらない」\nをメモして、次も同じ種類の仕事を頼むときに貼る。\n新しいチャットにも、最初に渡す。\n同じ説明を、毎回やりたくないので。",
  },
  instagram: {
    role: "メモを整理する",
    format: "5枚構成：困りごと→材料→指示→完成形→直し方。",
    cta: "同じ頼み方を、自分のメモで試せるようにする。",
    excerpt: "メモはある。で、何からやる？\n書いたメモを、また最初から読み返す。この整理をAIに頼んでみる。\n「このメモを、今やること・返事待ち・アイデアに分けて。期限は書いてあるものだけ残して」\n返事待ちまで「今日やる」に入っていたら、\n「相手の返事が必要なものは、今やることに入れないで」\nを追加する。この一文もメモして、次の整理で使う。",
  },
  note: {
    role: "自分用の頼み方を作る",
    format: "用途→初稿→直す基準→保存→次回も使う。",
    cta: "仕事用の指示メモをひとつ作り、次回も渡す。",
    excerpt: "AIへのダメ出し、毎回捨ててない？\n「長い」「そこじゃない」「その言い方はしない」。その修正、次の依頼にも持っていきたい。\nたとえば週報なら、「進んだこと・困っていること・来週やることの3つに。各項目は2行まで」と伝える。\n直したものがよければ、その指示を『週報を頼むときのメモ』として保存する。\n次の週報を頼むときは、そのメモも一緒に渡す。来週のメモでも使えるか、出てきた週報で確かめる。",
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
                <div className="bp-example-head"><div className="bp-avatar"><BookImage name="racco-self-avatar" alt="主役Raccoの太縁メガネのプロフィール画像" square /></div><div><strong>Racco / Lakkan</strong><span>投稿案 / 頼み方の例</span></div></div>
                <p>{printChannels[channel.id].excerpt}</p>
                <div className="bp-example-bottom"><strong>資料用の短縮版</strong><Link href={`/racco#sns-${channel.id}`}>全文：lakkan-inc.vercel.app/racco#sns-{channel.id}</Link></div>
              </div>
            </div>
            <p className="bp-note">プロフィール・投稿は下書き。文面を資料用に短くまとめています。頼み方の例であり、実際のAI出力・実体験・効果の実証ではありません。</p>
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
