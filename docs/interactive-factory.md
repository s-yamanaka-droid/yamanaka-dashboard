# Interactive Lakkan homepage

The homepage is one fullscreen procedural Three.js scene. It keeps the supplied
factory geometry, materials, lighting and simulation. The surrounding interface
is limited to Lakkan, Menu, an interaction hint and pause.

Hovering reveals a short station name. Clicking or tapping moves to that device
and opens an existing public work with its cover and destination. Closing,
Escape or browser Back restores the exploration pose. Menu also provides the
existing Works, Services, About and Contact routes.

The canvas supports arrow-key selection and Enter. Dialogs trap focus and return
it to the initiating control. Reduced motion starts paused and skips camera
flight. Menu remains usable without WebGL; a failed cover keeps the work link.

Implementation lives in `src/components/factory/FactoryHome.tsx`,
`src/components/factory/factory.css`, `src/components/ui/agentic-factory-3d.tsx`
and `src/data/factory-works.ts`. The homepage owns its minimal navigation;
subpages retain their shared header, footer and existing content. Factory CSS
is scoped to prevent style changes after navigating to a subpage.

Before publication run `npm run check:release` and actual browser interactions
at desktop, portrait phone and landscape phone sizes. Verify the public root,
work links, subpage navigation, CSP and JS/CSS asset responses after deployment.
`/api/health` exposes the public Git revision and experience identifier so the
deployed version can be compared with main.

The underlying factory component retains its original attribution. The visual
reference describes three states of one screen, with real project covers used
in the implementation.
