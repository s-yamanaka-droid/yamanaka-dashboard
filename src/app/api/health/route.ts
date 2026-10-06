export function GET() {
  return Response.json({ status: "ok", service: "lakkan-site", revision: process.env.RELEASE_REVISION ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local", experience: "interactive-workshop" });
}
