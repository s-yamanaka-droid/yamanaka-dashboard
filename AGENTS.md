<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Lakkan public site rules

This repository is public and deploys the Lakkan corporate website.

## Public-data boundary

- `src/data/projects.json` contains public, live work only.
- Never add internal, pre-launch, archived, client-confidential, password-protected, or worktree-only projects.
- Do not add private repository URLs, internal dashboards, access codes, credentials, customer data, personal vault data, or operational metrics.
- Product claims and dates must be verified from the public production URL or an authoritative public release before publication.
- The current customer-facing product name is **Luna AI**. Use **Vigil** only when explicitly describing historical migration.

## Editing workflow

1. Read the target component and `src/components/primitives/SectionShell.tsx`.
2. Preserve the existing Lakkan visual language unless a design change is explicitly requested.
3. Use text, SVG, or Lucide icons instead of emoji.
4. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
5. Review `git diff` for invented metrics and non-public information.

## Completion gate

- Public project links return a valid production response.
- Removed private routes redirect to a public page.
- No credential-shaped values or internal-status markers are present in tracked public source.
- GitHub and production are updated together.
