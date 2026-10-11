import type { Metadata } from "next";
import FactoryHome from "@/components/factory/FactoryHome";

export const metadata: Metadata = {
  title: "Lakkanの工房",
  description: "Lakkanの仕事を、動く工房から探索できます。",
};

export default function WorkshopPage() {
  return <FactoryHome />;
}
