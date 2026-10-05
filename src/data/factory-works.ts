import type { StationId } from "@/components/ui/agentic-factory-3d";

// Reused from Lakkan's existing public portfolio; URLs checked on 2026-10-05.
export const works = [
  { id: "luna-management", station: "engine", label: "Motion", name: "Luna Management", cover: "/works/luna-management.jpg", alt: "Luna Managementの公開紹介画面", url: "https://luna-management-jp.vercel.app/showcase" },
  { id: "luna-reception", station: "admin", label: "AI", name: "Luna Reception", cover: "/works/luna-reception.jpg", alt: "Luna Receptionの公開デモ画面", url: "https://luna-receptionist.vercel.app" },
  { id: "central-medical", station: "storefront", label: "Work", name: "Central Medical", cover: "/works/central-medical.jpg", alt: "中央メディカルの公開サイト", url: "https://lakkan-central-medical.vercel.app" },
  { id: "atelier-patterns", station: "cabinet", label: "Lab", name: "Lakkan Atelier", cover: "/works/atelier-patterns.jpg", alt: "Lakkan Atelierの公開制作パターン集", url: "https://lakkan-inc.vercel.app/atelier" },
] satisfies { id: string; station: StationId; label: string; name: string; cover: string; alt: string; url: string }[];
