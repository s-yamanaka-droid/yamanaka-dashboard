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
}
