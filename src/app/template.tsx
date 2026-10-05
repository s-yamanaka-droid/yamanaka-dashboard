"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteMotion } from "@/components/site/SiteMotion";

export default function Template({children}:{children:ReactNode}) {
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;
  return <SiteMotion>{children}</SiteMotion>;
}
