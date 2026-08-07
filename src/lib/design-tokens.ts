import { Category } from "@/types";

export const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
export const INSTRUMENT = "var(--font-instrument), 'Instrument Serif', 'Frank Ruhl Libre', Georgia, serif";
export const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

/** Lakkan accent palette */
export const ACCENT = {
  blue: "#2C5268",        // blueprint ink
  orange: "#A14C3B",      // oxidized copper
  vermillion: "#B4382B",  // editorial proof mark
  forest: "#315A4E",      // ledger green
};

export const CAT_LABEL: Record<Exclude<Category, "all">, string> = {
  website: "Website", external: "External", internal: "Internal",
  analytics: "Analytics", onboarding: "Onboarding", ai_agent: "AI Agent",
};
export const CAT_COLOR: Record<Exclude<Category, "all">, string> = {
  website: "#2C5268", external: "#315A4E", internal: "#5B5871",
  analytics: "#A14C3B", onboarding: "#806126", ai_agent: "#7C445E",
};
export const STATUS = {
  live:     { label: "Live",     color: "#315A4E", dot: "#315A4E" },
  dev:      { label: "In Dev",   color: "#806126", dot: "#A14C3B" },
  archived: { label: "Archived", color: "#6E7A7C", dot: "#A8B4AE" },
};
export const ALL_CATS: Category[] = ["all", "website", "external", "internal", "analytics", "onboarding", "ai_agent"];
export const EASE = [0.22, 1, 0.36, 1] as const;
export const NEW_MS = 7 * 24 * 60 * 60 * 1000;
export const isNew = (d: string) => Date.now() - new Date(d).getTime() < NEW_MS;

export type SortKey = "updatedAt" | "createdAt" | "name";
export type ViewMode = "list" | "timeline" | "cards";

export interface MarqueeItem { text: string; color?: string; dot?: string; }
