import projects from "./projects.json";
import type { Project } from "@/types";

// The public gallery is curated independently of the existing case-study URLs.
const selectedIds = ["now-on-air", "luna-ai"];
export const selectedWorks: (Project & { cover: string; coverAlt: string })[] = selectedIds.map(id => {
  const project = projects.find(project => project.id === id && project.status === "live");
  if (!project) throw new Error(`Missing selected public work: ${id}`);
  return project as Project & { cover: string; coverAlt: string };
});

export function workPresentationLabel(project: { id: string; workType?: string }) {
  if (project.id === "now-on-air") return "自社メディア / Web制作";
  if (project.id === "luna-ai") return "別ブランドのWeb制作";
  return project.workType === "client" ? "クライアントワーク" : project.workType === "ai-concept" ? "コンセプト作品 / 架空ブランド" : "プロダクト・共同事業";
}
