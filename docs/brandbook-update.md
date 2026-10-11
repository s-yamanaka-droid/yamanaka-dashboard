# Brand book: current shared edition

## Entry points

- `/brand-book`: main book, twelve landscape pages, screen reading and browser print/PDF.
- `/brand-guide`: full prose and production guide.
- `/concept#assets`: Lakkan logo kit.
- `/racco#assets`: character and social image assets.

The old eight-page avatar supplement and original generated cover are production history, not the current book. Their source files are retained. The old generated Lakkan cover is no longer promoted in the current logo asset collection.

## Requirements and implementation

| Requirement | Implementation | Verification |
|---|---|---|
| Lakkan owns Racco, with distinct identities | Logo usage page; A3 wordmark for normal use, signature only for company explanation | Server-rendered logo tests and visual check |
| Include all current companions | Original three Racco roles plus Muchimuchi and Fuwafuwa; shared shop world | All five `racco-world.ts` backgrounds present in the book |
| Keep website and manuscript aligned | Shared world data in print/guide; synchronized downloadable Markdown | `npm run test:brand` exact manuscript equality |
| Find the authoritative book | Clear book/guide/asset labels, stable contents anchors | Contents and twelve-page numbering tests |
| Read on phone and paper-sized desktop | Responsive layout, 44px primary controls, preserved 10pt body sizes on paper | 375/768/1024/1440 actual browser measurements |

## Checks

- `npm run check:release`: typecheck, lint, brand tests, public-data gate, build and HTTP smoke.
- Browser measurements: twelve pages, no horizontal/body overflow, no body/footer collision, no missing images at four widths.
- Independent read-only review: identity rules, five companions, page/contents consistency and public-data boundary.

Screen measurements are not a physical print proof. The print/PDF command remains available; commercial printing, color proof, trademark clearance, merchandise manufacture and SNS posting are separate workflows.
The current book excludes Hina from its content and navigation; the historic source PNG is retained, not represented as an approved current asset.

## Ownership

Book layout: `src/components/brand/BrandBookPrint.tsx` and `brand-print.css`.
Shared text: `src/data/brand-book.ts`.
Character world: `src/data/racco-world.ts`.
Full guide: `src/components/brand/BrandStudio.tsx`.
Download: `public/brand-book/brand-book.md`.

Use the canonical book URL when briefing designers. Use the asset pages for image downloads. Do not distribute the old supplement as the current complete book.
