import type { Metadata } from "next";
import { RecordsPoster } from "@/components/records/RecordsPoster";
import { recordDiscs } from "@/lib/records/catalog";
import "./records.css";

export const metadata: Metadata = {
  title: "Lakkan Records",
  description: "Lakkanの事業を6枚のレコードに。1枚ずつ書いた曲を、ブラウザの中で演奏します。",
};

export default function RecordsPage() {
  return (
    <main id="main" className="records-page">
      <h1 className="sr-only">Lakkan Records</h1>
      <RecordsPoster discs={recordDiscs} />
    </main>
  );
}
