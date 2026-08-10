export type Category =
  | "all"
  | "website"
  | "internal"
  | "external"
  | "onboarding"
  | "ai_agent"
  | "analytics";

export type Status = "live" | "dev" | "archived";

export type BuiltWith = "claude_code" | "manual" | "v0" | "bolt";

export type WorkType = "client" | "own" | "ai-concept";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  status: Status;
  builtWith: BuiltWith;
  createdAt: string;
  updatedAt: string;
  url?: string;
  client?: string;
  tags: string[];
  featured?: boolean;
  /** 公開中サイトから取得したポートフォリオ用の実画面 */
  cover?: string;
  coverAlt?: string;
  /** client=実案件 / own=自社・関係会社 / ai-concept=架空ブランドのAI制作実験 */
  workType?: WorkType;
}

const OWN_ORGANIZATIONS = new Set(["Lakkan", "LunaTech", "TREPRO", "Trepro", "KANOA", "SKYLINK", "Solve"]);

export function resolveWorkType(project: Project): WorkType {
  if (project.workType) return project.workType;
  if (project.client && !OWN_ORGANIZATIONS.has(project.client)) return "client";
  return "own";
}
