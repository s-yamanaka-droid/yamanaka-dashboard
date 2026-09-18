import type { ReactNode } from "react";
import { SiteMotion } from "@/components/site/SiteMotion";

export default function Template({children}:{children:ReactNode}) {
  return <SiteMotion>{children}</SiteMotion>;
}
