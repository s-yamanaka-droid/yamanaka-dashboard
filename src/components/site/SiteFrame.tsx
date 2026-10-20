"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Corporate routes share the approved paper frame; independent experiences keep their own brand. */
export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const independent = pathname === "/" || pathname === "/workshop" || pathname === "/records" || pathname.startsWith("/racco") || ["/brand", "/concept", "/brand-book", "/brand-guide"].includes(pathname);
  return <div className={independent ? undefined : "corporate-frame"}>{children}</div>;
}
