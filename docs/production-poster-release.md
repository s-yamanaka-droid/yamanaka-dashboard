# Lakkan poster edition release

The updated corporate site was approved for production on 2026-10-12.

## Included

- Animated paper/red poster hero and interactive crowd on the homepage.
- The original 3D workshop remains available at `/workshop`.
- Matching corporate styling for work, service, company and contact pages.
- Richer company explanation, philosophy and four linked business areas.
- Shared A3 logo in the corporate header/footer and homepage company introduction, displayed in red. The company introduction also uses the vertical 楽観 signature.
- Bolder filled hero lettering and meaningful Japanese title wrapping.

## Integration

Based on production revision `9f34032566a5b8e98abce14a1165c6cae6be76ad`. The published logo assets, Racco companions and their shared content are retained from that revision. Corporate changes are integrated into that current source.

## Checks

- `npm run check:release`: passed, including typecheck, lint, brand/inquiry tests, public-data checks, production build and route/asset smoke checks.
- Existing lint warnings: two unused-variable warnings; no errors.
- Production dependency audit: no reported vulnerabilities.
- Credential scan: no matching credentials in the release source or Git history.
- Before publication, the homepage and company page were reviewed at 375, 768, 1024 and 1440px, with no horizontal overflow or missing images.
- Hero waving and die interactions, service links and layout repeat checks passed.
- Inquiry actions create or copy an email draft; they do not send messages from the website.

## Production verification

Confirm the published commit via `/api/health`, the `poster-crowd` experience value, current HTML and JS/CSS delivery, and the actual rendered homepage and company page. Technical checks do not replace visual review.
