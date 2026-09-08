# Lakkan video hero

Adapted from the supplied `scroll-locked-video-hero.tsx` by guglielmogiannattasio.exe.
Video and background source: https://github.com/gughigug/run-hero-assets

The existing shadcn configuration maps `@/components/ui` to `src/components/ui`;
Tailwind CSS and TypeScript are already configured. No new dependencies are needed.

The supplied video, background, coverflow transforms, momentum, crossfade loop,
theme toggle and desktop pointer tilt are retained. The content layer lives in
`src/components/sections/VideoHero.tsx` and links to existing public pages.

Integration changes:
- The hero participates in document flow; expanded mode stays inside the hero.
- Wheel and touch listeners are scoped to the list, not the window.
- Brand navigation and the next-section link remain available.
- Theme colors are scoped to the dark media surface, independent of the host's OKLCH tokens.
- Video starts muted and reduced-motion pauses initial playback.
- Nested buttons retain their native keyboard behavior.
- Pause stops both crossfade videos. Nonfunctional shuffle/repeat controls are removed.
- Media is served locally to comply with the existing same-origin CSP.

Validation: production build, TypeScript, lint (no new warnings), and browser checks
at 1440 and 390px. Verified video decoding, next-item switching, pause/resume,
keyboard arrows, expanded bounds, document scroll, and reduced-motion pause.
No horizontal overflow or JavaScript page errors observed in these checks.

The supplied source attachment is retained separately; SHA256:
`dc7300b7a0a3b8077cc742495950982f8fdc3b440b2c71e26b5db16fce28fa73`.
This is an adaptation, not an unchanged copy of the full-screen music demo.
