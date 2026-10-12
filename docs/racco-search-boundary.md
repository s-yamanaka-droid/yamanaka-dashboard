# Racco public reading and production material

Racco is the character/editorial entry inside the Lakkan website, not a separate company or a second corporate site.

## Search boundary

- `/racco` and the three existing `/racco/columns/[slug]` articles permit indexing, have self-referencing canonical URLs, and appear in the sitemap.
- `/racco/studio` reuses the existing visual library for social drafts and image resources. It is noindex/nofollow and excluded from the sitemap.
- The concept library, brand book, detailed guide, inquiry page and goods candidates remain noindex. The downloadable brand manuscript also sends an X-Robots-Tag.
- noindex is not access control. These are non-confidential, URL-accessible materials. Do not store private information here.
- Known legacy social/asset hashes are carried to the corresponding studio view. Public galleries, characters and image previews remain accessible.

## Editorial responsibility

Article markup uses the displayed headline, summary, category and illustration. The author/publisher is 株式会社Lakkan, linked to the company page. Fictional characters are not represented as credentialed human authors.

These articles contain illustrative work examples, not measured client outcomes. They have no invented publication dates, performance numbers, reviews or sale offers. A visible note explains this distinction.

Article cards open actual articles. Each article links to related reading, relevant Lakkan AI/work-improvement support, and the existing contextual inquiry draft. No form or social post is sent by this change.

## Verification

`npm run check:release` checks types, lint, brand/inquiry handlers, public data, production build, server-rendered metadata/schema, sitemap membership, manuscript headers and route/asset delivery.

Browser checks must additionally cover old hash migration, the studio menu closing on navigation, returning to public reading, and small-screen overflow. Search indexing and AI citation are separate observations, not implied by a successful build or publication.

Legacy hash migration uses a full document replacement. An immediate client-router replacement reproduced duplicate canonical/robots tags on the pinned Next version, while direct loading did not. This avoids mixing the old indexable page's head with the studio head. Ordinary user-initiated links continue to use Next navigation. See [the related upstream report](https://github.com/vercel/next.js/issues/97472); identical internal causation is not assumed.

## References

- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features): standard search eligibility and useful, accessible content; no special AI-only markup requirement.
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article): describe the actual article and its responsible author.
- [Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): pages must remain crawlable for a crawler to read the noindex directive.
