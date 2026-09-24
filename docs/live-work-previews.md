# Inline work previews

Home, work gallery and case pages share LiveWork. The approved typography and water identity remain unchanged. LunaTech is the first homepage work so visitors encounter a live example immediately.

Frame policies checked on 2026-09-25: LunaTech, PLIME, AURA and SOLNA permit framing; the local Atelier fluid demo is same-origin. Central Medical, LiA, Now On AIr, AI Lab and Reception now explicitly allow https://lakkan-inc.vercel.app as an ancestor. Existing allowed ancestors are preserved. Conflicting X-Frame-Options headers are replaced by the explicit CSP allowlist. No origin policies are bypassed or proxied. All ten works have inline previews.

Only visible previews mount. Offscreen previews unmount. Pointer interaction and keyboard entry require the explicit operation toggle; ending interaction restores the scroll shield. Reduced motion waits for activation. A persistent external link covers network and browser restrictions. Sandbox does not permit top navigation, forms or device access. Reception's microphone and form-dependent actions remain available through its external link. CSP permits only self and the nine checked external origins.

Validation: check:release passed typecheck, lint (two pre-existing warnings), public-data validation, production build and smoke. Smoke checks cover CSP, deferred iframe mounting and blocked-origin fallback. Chrome desktop and 390px mobile were checked; LunaTech's embedded menu opened, and ending interaction restored inert. The in-app browser did not finish loading external frames during local testing; static fallback and external links remain available there. Do not count fallback images as proof of iframe playback. Physical mobile devices were not tested.

Production follow-up: Chrome's homepage preview successfully opened the embedded LunaTech menu. The in-app browser loaded the external frame on HTTPS production (ready state and rendered live site confirmed), although its automation tool rejected fractional iframe click coordinates. PLIME also rendered its real content in Chrome. Preview width is explicitly 100% while height is capped to keep the exit control reachable.
