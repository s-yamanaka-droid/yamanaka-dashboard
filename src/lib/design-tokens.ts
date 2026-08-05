import { Category } from "@/types";

export const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
export const INSTRUMENT = "var(--font-instrument), 'Instrument Serif', 'Frank Ruhl Libre', Georgia, serif";
export const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

/** Lakkan accent palette */
export const ACCENT = {
  blue: "#1C3BCC",
  orange: "#F4541A",
  vermillion: "#B8362E", // editorial 朱赤
  forest: "#1F3A2E",     // Luna AI のローカルファーストを示す深緑
};

export const CAT_LABEL: Record<Exclude<Category, "all">, string> = {
  website: "Website", external: "External", internal: "Internal",
  analytics: "Analytics", onboarding: "Onboarding", ai_agent: "AI Agent",
};
export const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  website: "#1C3BCC", external: "#3A8C5C", internal: "#7C3AED",
  analytics: "#E8694A", onboarding: "#B07D00", ai_agent: "#D4317A",
};
export const STATUS = {
  live:     { label: "Live",     color: "#3A8C5C", dot: "#3A8C5C" },
  dev:      { label: "In Dev",   color: "#B07D00", dot: "#F4541A" },
  archived: { label: "Archived", color: "#B0ADA6", dot: "#D0CCC4" },
};
export const ALL_CATS: Category[] = ["all", "website", "external", "internal", "analytics", "onboarding", "ai_agent"];
export const EASE = [0.22, 1, 0.36, 1] as const;
export const NEW_MS = 7 * 24 * 60 * 60 * 1000;
export const isNew = (d: string) => Date.now() - new Date(d).getTime() < NEW_MS;

export type SortKey = "updatedAt" | "createdAt" | "name";
export type ViewMode = "list" | "timeline" | "cards";

export interface MarqueeItem { text: string; color?: string; dot?: string; }
