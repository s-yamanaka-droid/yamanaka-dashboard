# Works: portfolio presentation

## Problem and change

The previous large introductory block pushed the actual work below the first screen. The repeated cards gave every project the same weight. The revised page leads with the Central Medical client project, showing its existing screenshot alongside the project description and a direct public-site link. Remaining work uses a two-column gallery and a single-column mobile layout.

## Design decisions

- Existing Lakkan celadon background and dark green text; project screenshots supply the visual variety.
- Japanese Mincho for the compact introductory heading; sans serif for project names and descriptions.
- Body 16 px, supplementary text 14 px, project headings 28 px desktop / 24 px mobile.
- Underlined category controls, not rounded pill buttons. Counts are announced through a status region.
- Client work, products/co-ventures and fictional concept work retain explicit labels. No new project claims or metrics were introduced.
- Page styles are isolated in `gallery.module.css`. Shared homepage cards are unchanged.

## Evidence

- Desktop browser at 1239 CSS px: complete featured screenshot and accompanying text visible in the initial viewport; no horizontal overflow. All ten images loaded.
- Filters: all 10, client 3, own 5, concept 2. Concept disclaimer and per-project labels displayed.
- Mobile check at 354 CSS px identified crowded filter labels; count moved to a separate row. Final 390 CSS px screenshot confirmed readable labels, 16 px body copy and no horizontal overflow. Enter-key activation switched the concept filter to two results.
- Browser console error log was empty during the desktop checks.
- All ten existing external project URLs returned HTTP 200.
- TypeScript, ESLint and public-data gate pass; ESLint retains two unrelated existing warnings.
- Final webpack build and the existing eight-page route smoke test pass, including topic selection, seven demos and 404 behavior.

Deployment target for review is the existing local preview at port 8786. No production deployment is authorized by this change.
