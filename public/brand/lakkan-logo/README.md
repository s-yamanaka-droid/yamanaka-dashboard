# Lakkan A3 logo kit

## 使い分け

- **通常は英字だけ**：ヘッダー、フッター、ナビ、他サイトでの会社ロゴには `lakkan-a3-wordmark.png`。
- **楽観の落款付きは会社を説明する場面だけ**：会社紹介・コンセプトには `lakkan-a3-signature.png`。
- RaccoはLakkanの中のキャラクター／発信ブランド。Racco自身のロゴ・キャラクターは置き換えない。
- 英字A3の形と縦組みの楽観を採用。旧05、横組み、楽一文字の検討画像を現行素材と混ぜない。

## ファイル

両ファイルは1983 × 793px、透過PNGです。承認されたA3案から作成したWeb用画像で、ベクター原画や印刷入稿用の確定データではありません。元画像には余白があります。

| 用途 | PNG | 内容を表示するviewBox |
|---|---|---|
| 通常 | lakkan-a3-wordmark.png | 75 170 1830 438 |
| 会社紹介 | lakkan-a3-signature.png | 139 216 1712 366 |

サイトでは `LakkanLogo` がSVGの表示窓にPNGを置き、原画を変形せず余白だけを除いて表示します。SVGパスへ変換したロゴではありません。

## 別サイトで使う

1. このフォルダのPNG2つを同じ `public/brand/lakkan-logo/` へ置く。
2. `src/components/brand/LakkanLogo.tsx` と `LakkanLogo.module.css` を一緒に移す。
3. 通常は `<LakkanLogo />`。暗い背景のみ `<LakkanLogo inverse />`。
4. 会社説明だけ `<LakkanLogo variant="signature" size="feature" />`。

目安：通常幅120px、狭い場所88px、会社紹介は幅360px以下の可変。落款版をナビに縮小しない。色付き背景や印刷用途は実寸で読みやすさを確認する。

英字見出しをすべてロゴ画像へ置換する必要はありません。本文中の会社名・正式名称は通常のテキストのまま使用します。
