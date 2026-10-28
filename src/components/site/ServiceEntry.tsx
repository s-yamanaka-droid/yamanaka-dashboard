import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceStories } from "@/data/service-stories";
import { RaccoGuide } from "./RaccoGuide";

export function ServiceEntry() {
  return <div className="service-entry">
    <div className="service-entry-heading"><p className="racco-eyebrow">できること / LAKKAN</p><h2><span>仕事のクセを、</span><span>ほどく。</span></h2><p>仕事、仕組み、伝え方、人。<br/>ひとつの課題から、一緒につくる。<br/>Luna AI（提供：LunaTech）の導入・活用も支援します。</p></div>
    <RaccoGuide pose="pointing" />
    <nav className="service-entry-tabs" aria-label="Lakkanの支援領域">{serviceStories.map(s => <Link href={`/services#${s.id}`} key={s.id}><strong>{s.label.map(part => <span key={part}>{part}</span>)}</strong><small>{s.category.split("・").map((part, index, parts) => <span key={part}>{part}{index < parts.length - 1 ? "・" : ""}</span>)}</small><ArrowRight size={18} aria-hidden="true"/></Link>)}</nav>
  </div>;
}
