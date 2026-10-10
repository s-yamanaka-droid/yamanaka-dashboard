# Racco: cast and SNS integration

## Scope

The already-approved three-character world now appears in the existing Racco site, not a separate brand. The thick-glasses personal Racco remains the main avatar; the thin-round-glasses automation enthusiast is a separate character. Hobby-only characters are not published.

- `/racco#members`: three roles, their morning scene, identity distinction, links to assets and SNS.
- `/racco#assets`: personal Racco (5 original PNGs), cast (2), SNS expression references (7). Download returns the original file; previews use responsive delivery.
- `/racco#posts`: Threads, X, Instagram, note drafts, exact-copy actions, shared profile, matching channel asset entry points.
- `/brand-guide`: shared cast direction and typography, with the existing work-card tools preserved.
- `/brand-book`: ten-page print layout, short excerpts and explicit links to full web text. No previously exported PDF is silently replaced.

SNS drafts use a concrete hypothetical email-reply example. They are not claims of a real experiment or measured savings. Existing text-in-image assets are expression references, not finished posts matching the new copy. Reels artwork is a static cover, not generated video. No social account, profile, or post was changed.

## Existing sources and implementation

Approved originals were reused from the shared Lakkan brand-book cast set and the existing Racco SNS rebranding set. No asset pixels were regenerated, resized for download, or edited. Original dimensions range from 940×1672 to 2172×724; these are not 4K or print-ready deliverables.

`src/data/racco-kit.ts` owns cast and asset grouping. `src/data/brand-book.ts` owns shared channel copy and manuscript; handler tests check exact equality with the downloadable Markdown. `src/lib/racco-fonts.ts` shares the already-approved Zen Maru Gothic / Nunito font files across Racco, guide and print.

The existing library interactions, motion controls, keyboard navigation and clipboard fallback were reused. ReUI admin/app-shell patterns did not match this brand library; Kokonut clipboard patterns would duplicate existing behavior; the unavailable 21st lookup did not justify a new dependency. No paid template or browser instance was introduced for design research.

## Verification

- `npm run check:release`: typecheck, lint, handler tests, public-data gate, production build and route smoke passed. Two unrelated pre-existing lint warnings remain in NeuralNet and ProjectCard.
- `SMOKE_BASE_URL=http://127.0.0.1:8791 node scripts/smoke.mjs`: final build passed.
- Isolated functional E2E: all 4-width page overflow, 5/2/7 asset counts, original-PNG download hash, profile/channel clipboard equality, deep links, back navigation, Escape, copy fallback, mobile menu and reduced-motion checks passed.
- Initial print QA found fixed-page overflow after shared-copy expansion. It was corrected with print-specific excerpts and spacing, without clipping the content or shrinking all typography. Final recheck: all 10 pages had zero body/child overflow and an 18.89px gap to their footers. Four widths × four states again had zero horizontal overflow. At 768px, two measurements after visible images and fonts loaded matched exactly; the original pre-load mismatch is not treated as a successful check.

Interaction and rendering tests do not establish aesthetic acceptance, trademark clearance, manufacturing readiness, or SNS account publication.
