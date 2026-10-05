# Interactive Lakkan homepage

The homepage is one fullscreen procedural Three.js scene. It keeps the supplied
factory geometry, materials, lighting and simulation. The surrounding interface
keeps Lakkan, Menu, an interaction hint and pause. A brief company introduction
and two visible actions explain the support offered and lead to an inquiry
without requiring visitors to discover or operate a 3D station.

Hovering reveals a short station name. Clicking or tapping moves to that device
and opens the relevant Lakkan support, a concrete description and a contextual
inquiry link. Web, AI operations and recruitment show existing public examples;
CRM describes its scope without inventing a case. Homepage stations do not link
directly to Luna products. Examples open an internal case page so visitors can
understand the work before leaving Lakkan. Closing,
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
