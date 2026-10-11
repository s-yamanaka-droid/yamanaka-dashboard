"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteMotion } from "@/components/site/SiteMotion";

export default function Template({children}:{children:ReactNode}) {
  const pathname = usePathname();
  const independent = pathname === "/workshop" || pathname.startsWith("/racco") || ["/concept", "/brand-book", "/brand-guide"].includes(pathname);
  if (!independent) return <>{children}</>;
  return <SiteMotion>{children}</SiteMotion>;
}
