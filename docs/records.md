# Lakkan Records（/records）

Lakkan の事業を6枚のレコードにしたページです。曲は1枚ずつ楽譜で書いてあり、ブラウザの中で作曲の仕組みが演奏します。何も押さなければ音は鳴りません。

- ページ：`src/app/records/page.tsx` と `records.css`（サイトの紙・墨・朱、Bebas Neue と Noto Sans JP を使う）
- 画面：`src/components/records/RecordsPoster.tsx`。左上は共通の `LakkanLogo`（押すとトップへ戻る）、右上は問い合わせ
- 演奏の仕組み：`src/lib/records/music/`（作曲・編曲・音色・再生）
- 曲とディスク：`src/data/records/songs/*.json` と `src/data/records/discs.json`
- レコードの絵：`public/records/discs/<ディスクid>.webp`
  - 盤の全面に、名画や風景の絵を刷ったピクチャー盤にしている。
  - 絵はシカゴ美術館のパブリックドメイン作品（CC0）。月・海・山・畑・池から選んだ。
  - 作り方は `python3 scripts/records-picture-discs.py`。
  - 承認済みのロゴは焼き込まない。ページの `RecordImprint` が、元の PNG のまま盤の上に重ねる。ラベルの文字は、ロゴが重なる位置を避けて置いている。
  - 絵を替えるときは、スクリプトの `ART` と `src/lib/records/catalog.ts` の `ART` の両方を直す。
- 楽器の録音：`public/records/samples/`
  - ローファイ用の楽器（アップライトピアノ、ビブラフォン、カリンバ、ダン・チャン、テナーサックス）は VCSL（CC0）から使っている。作り方とテストは試作 `~/apps/disc-records`（`scripts/prepare-lofi-samples.py`）にある。
  - 曲はすべて `"style": "lofi"` で、ジャズのノリ（`groove`：`swing` はライドとウォーキングベース、`bossa` はボサノバ、`ballad` はゆっくり）。曲ごとに、ノリ（`groove`）、鍵盤（`keys`）、メロディの楽器（`lead`）、メロディの高さ（`octave`）、背景の音（`texture`）を変えている。
  - エレピ：Wurlitzer EP200（CC BY 3.0、表記が必要）
  - ドラム：Virtuosity Drums（CC0）
  - 表記は `CREDITS.txt` に書き、ページ右下の SOUND CREDITS からリンクしている

## 曲を直す・足す

1. `src/data/records/songs/` の JSON を書き換える。
   - 和音はローマ数字で書く（例：`IVmaj9`、`IIIm7 VI7b9`）。
   - メロディは1小節を8つに区切って書く（例：`". C5 Eb5 G5 - - Eb5 C5"`）。
   - 拍の頭には、その時の和音の音を置く。
2. 新しい曲は `src/lib/records/catalog.ts` の一覧に足し、`discs.json` の `"song"` でその名前を指す。
3. 書き方を間違えると、ビルドが日本語のメッセージで止まる。メッセージにはファイルと項目の名前が出る。

作曲の仕組みのテストと試聴音源の書き出しは、元の試作 `~/apps/disc-records`（`npm run check`・`SONG=<id> npm run song`）にあります。仕組みを直すときは、そちらで確かめてから、ここへ写してください。

## 確認

`npm run check:release`。smoke では、`/records` が描画されることと、ロゴ・問い合わせ・クレジットのリンクがあることも確かめている。

## サイトへの入口と説明

トップの人と仕事のセクション、会社紹介、共通フッターから「Lakkanを聴く」へ進める。共通のロゴからトップへ、相談リンクから問い合わせへ戻れる。

6枚は、会社の考え方・採用と役割・AIと仕事・現場開発・支援の組み合わせ・相談の入口を表す。説明は現行の会社紹介と4つの支援に揃えている。曲名や譜面のIDは音楽の識別子であり、商品の提供名や納期保証ではない。
