import type { Metadata } from "next";
import { RecordsPoster } from "@/components/records/RecordsPoster";
import { recordDiscs } from "@/lib/records/catalog";
import "./records.css";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/records", "Lakkan Records", "Lakkanの事業を6枚のレコードに。再生ボタンを押すと、1枚ずつ書いた曲をブラウザの中で演奏します。");

export default function RecordsPage() {
  return (
    <main id="main" className="records-page">
      <h1 className="sr-only">Lakkan Records</h1>
      <RecordsPoster discs={recordDiscs} />
    </main>
  );
}
