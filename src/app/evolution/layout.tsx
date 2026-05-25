import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evolution — Internal",
  robots: { index: false, follow: false },
};

export default function EvolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
