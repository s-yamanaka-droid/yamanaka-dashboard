# Lakkan site redesign

The homepage now leads with the brand statement, selected work, three service areas, Luna AI, delivery approach and a studio statement. Shared navigation and footer unify Works, Services, Studio, Lab, Updates, Contact and Privacy.

Visual references: Hirael Agency Landing (white light, pill navigation, orange CTA), Hirael Creative Studio (large wordmark and dark editorial sections), and Northstar / Dali AI Agency (clear AI services and product presentation). This is an original implementation based on the observed references; paid template source was not acquired or copied.

All ten existing public project URLs returned HTTP 200 during the content review. Central Medical is described as a food-service company, and LunaTech projects and fictional concept demos are identified explicitly. Existing public screenshots are retained.

Run `npm ci && npm run check` for typecheck, lint, production build, public-data gate and route smoke tests. GitHub Actions runs the same check; Vercel uses the existing linked project. `/api/health` returns a public, non-sensitive status.

Contact creates a draft in the visitor's mail application; it does not claim to have sent a message. No new email provider is required.
