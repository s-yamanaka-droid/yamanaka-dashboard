# Lakkan corporate website

Public corporate site and curated work portfolio for 株式会社Lakkan.

## Brand book — current entry points

- [ブランドブック本体](https://lakkan-inc.vercel.app/brand-book) — A4横12ページ。ロゴ、Raccoと仲間、世界観、SNS、グッズ。印刷・PDF保存対応。
- [詳しい制作ガイド](https://lakkan-inc.vercel.app/brand-guide) — コピー、仕事の試し方、制作規定の全文。
- [Lakkanロゴ素材](https://lakkan-inc.vercel.app/concept#assets) / [Racco画像素材](https://lakkan-inc.vercel.app/racco#assets)

本体の編集は `src/components/brand/BrandBookPrint.tsx` と `brand-print.css`。
設定の共通正本は `src/data/brand-book.ts`、世界観・5人の背景は `src/data/racco-world.ts`。
保存用原稿 `public/brand-book/brand-book.md` と原稿データの一致は `npm run test:brand` で検証する。
初期の画像カンプや8ページの別冊PDFは制作履歴であり、この現行本体とは別。

## Shared brand assets

Lakkanロゴの利用・他サイトへの展開は [共通仕様](docs/lakkan-logo.md) と
[A3 logo kit](public/brand/lakkan-logo/README.md) を参照。通常は英字のみ、落款付きは会社紹介に限定する。

https://lakkan-inc.vercel.app

## Development

```bash
npm install
npm run dev
```

Before publishing:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Only public, live work belongs in `src/data/projects.json`. Internal tools, pre-launch products, customer-confidential material, access codes, credentials, and operational data must not be committed to this public repository.
