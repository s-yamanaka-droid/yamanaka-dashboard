import type { Metadata } from "next";
import FactoryHome from "@/components/factory/FactoryHome";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/workshop", "Lakkanの工房", "Lakkanの仕事を、動く工房から探索できます。");

export default function WorkshopPage() {
  return <FactoryHome />;
}
