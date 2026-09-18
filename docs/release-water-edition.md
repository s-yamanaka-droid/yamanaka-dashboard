# Lakkan water edition

The approved identity uses orange glass serif lettering and a shallow water surface. The homepage opens with a five-second Blender-rendered assembly, then hands over to pointer-reactive water. The film has no audio or playback controls and plays once per homepage mount. Reduced-motion and playback failures retain the static lettering. Rendering pauses when the artwork is offscreen or the document is hidden.

Navigation leads from work examples to case studies, relevant services and a contextual inquiry. Ten existing public works have detail pages, with clear distinctions between client work, products/joint projects and fictional-brand concepts. Descriptions discuss visible presentation and existing published information without inventing client outcomes.

The contact form prepares a draft in the visitor's email application; it does not claim to send a message from the website. Known work IDs and service topics are carried into the editable draft.

## Validation

Run `npm run check:release` for type checking, lint, public-data validation, a production webpack build and smoke checks. Smoke checks include detail routes, one h1/main, unknown-project 404, contextual inquiry, sitemap, media range requests and existing interactive demos.

Desktop and mobile browser checks cover the actual playback ending, fallback image, page layout and inquiry navigation. OS reduced-motion behavior is implemented but not exercised on physical devices in this release. Technical verification does not substitute for visual acceptance.

## Attribution

Ripple rendering adapts Ruixen UI's MIT-licensed ripple example; text motion uses the existing licensed text-effect component. License notices are retained in `docs/vendor`.
