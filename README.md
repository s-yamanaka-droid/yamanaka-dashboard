# Lakkan corporate website

Public corporate site and curated work portfolio for 株式会社Lakkan.

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
