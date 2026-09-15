# Services LP rebuild

## Interactive revision — 2026-09-15

User feedback: make the page more interesting. The static rotating sculpture has been replaced by an interactive composition called the Possibility Studio. Forty-eight instanced 3D pieces morph from a scattered layout into four service-specific arrangements: work lanes, a customer-contact ring, a designed surface, and groups of roles. The original Blender model is reused in the operations scene. This revision is an original implementation; the additional 21st search returned HTTP 401, so no newly retrieved component is claimed.

The service buttons change the shape target, color, problem, intended result, and flow. A native range control allows reversible exploration; a button animates the transition and a reset repeats it. The animation is a conceptual illustration, not a numerical business simulation. Reduced-motion preference makes user-triggered composition immediate and disables idle movement. Off-screen rendering pauses. The selected support link opens the corresponding existing service panel. Mobile places service choices above a sticky 3D stage so the transformation remains visible while operating the controls. GPU resources, listeners and scheduled animation are disposed on unmount.

Verification: TypeScript and webpack build pass. Browser checks at actual CSS width 390px found no horizontal overflow; transformation reached range value 100 and the target outcome text, and CRM support navigation selected the matching panel. Additional desktop/browser checks are summarized in the completion response. Physical phone testing and OS reduced-motion emulation remain unperformed.

## Purpose

A visitor should understand Lakkan's support, choose a current business problem, and reach Contact with the corresponding topic selected. Source claims come from the existing public `/services` page. No new performance metrics, pricing, customer claims or delivery guarantees were added.

## Design candidates and source review

1. **Editorial + original sculpture (selected for the trial).** Shell: two-column serif headline and visual. Core: issue-based service selector. Signature: original Blender passage sculpture. Reference: https://21st.dev/@felipemenezes098/components/hero-04 (ID 19074). Paid CLI search and retrieval succeeded; `isPublic` is true, but no license grant was returned. The code references ArtCollage and Cta utilities absent from the response, plus motion/react and react-wrap-balancer. The two-column hierarchy is used as a visual reference; no component code or source images are copied. Implementation is **reconstructed**, not a complete reproduction. Generic-risk mitigation: existing Lakkan paper/ink/serif language, actual service topics, original asset.
2. **Modern landing hero (not selected).** Shell: https://21st.dev/@mokshithgujjeti/components/modern-landing-hero. Core: same issue selector. Signature: large hero artwork. Access and dependencies remain unverified because it was not adopted. Risk: another generic agency landing page and weaker connection to the restored corporate identity.
3. **Product console (not selected).** Shell: ReUI `@reui/hero-11`, https://reui.io/components. Core: analytics console. Signature: framed interface. Access and dependencies require a separate review. Not appropriate here: Lakkan offers multiple services, and fictional analytics would imply unsupported outcomes.

## Implementation

- `/services` only; shared header/footer and homepage preserved.
- `SectionShell` preserves existing section and motion conventions.
- Four accessible tabs: AI operations, CRM/development, Web, people/organization.
- FDE remains an explicit cross-functional offering.
- Existing service hash entry points map to the appropriate tab.
- Native FAQ disclosures and query-string contact links.
- Sculpture created with Blender 5.2 LTS using `scripts/render-services.py`.
- `passage.glb`: original geometry and materials; 317 KB. Loaded via Three.js on the client. Pauses out of view, respects reduced motion, includes a pause control. `passage.png` is a server-rendered fallback.
- Blender source is in `design/services`, outside the public folder.
- No Runway paid feature or Higgsfield generation was submitted for this trial.

## Requirements → evidence

| Requirement | Implementation | Evidence |
|---|---|---|
| Explain what Lakkan does | Hero + four issue categories + FDE | Existing public content retained and reorganized |
| Clear enquiry route | Topic-specific Contact links | CRM/Web tab interaction and `corp-site` selection verified in browser |
| Real 3D | Blender GLB + Three.js | Model exported successfully; canvas rendered on desktop/mobile; pause toggles |
| Keyboard interaction | Roving tab index, arrows, Home/End | ArrowDown changed CRM to Web and panel copy changed |
| FAQ | Native details/summary | Fee question opened and displayed its answer |
| Mobile/desktop | Responsive grid and typography | Chrome measured 390px / scrollWidth 386 and 1440px / scrollWidth 1436; no horizontal overflow |
| Compilation | Next production build | `npm run build -- --webpack` passed |
| Static checks | TypeScript + ESLint | `npx tsc --noEmit` passed; lint passed with two existing warnings outside changed files |
| Route regression | Existing smoke suite | All eight main paths, seven demos, topic selection, and 404 passed |

## Verification limitations

The in-app browser ignored viewport changes, so responsive QA used Chrome. Its zoom caused requested width to differ from CSS width; dimensions above are actual DOM measurements. The default Turbopack build failed due to the environment denying a child process port bind; webpack passed. The development build reports the existing CSP/React eval warning; production-page inspection showed no new error from the services implementation. Do not weaken CSP to hide development warnings.

No physical phone test, user conversion test, or reduced-motion browser emulation was performed. Reduced motion has an explicit media-query branch, but that branch remains an implementation check rather than a browser-verified result. Reference component full multi-width comparison remains incomplete because its hosted preview did not load during the initial review.

## Reuse

Suitable for a multi-service consultancy with an existing editorial identity. Not suitable for a product-specific sales page needing pricing, proof, or a purchase flow. Original component dependencies: Next/React, existing Three.js, Lucide and SectionShell/Framer Motion. Change content data, brand CSS, and sculpture independently. This is one trial, not a promoted reusable intelligence pattern.
