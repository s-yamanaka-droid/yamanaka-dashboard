# Lakkan corporate website

Public corporate site and curated work portfolio for 株式会社Lakkan.

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
