import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ServiceId } from "@/data/service-stories";

const captionParts: Record<string, string[]> = {
  "同じ作業が何度も": ["同じ作業が", "何度も"], "任せる・なくす・つなぐ": ["任せる・", "なくす・", "つなぐ"], "人は、判断に集中": ["人は、", "判断に集中"],
  "あちこちに情報": ["あちこちに", "情報"], "顧客・履歴・役割をつなぐ": ["顧客・履歴・", "役割をつなぐ"], "次の対応がわかる": ["次の対応が", "わかる"],
  "強みが埋もれる": ["強みが", "埋もれる"], "言葉・体験・導線をつくる": ["言葉・体験・", "導線をつくる"], "相談・応募へ進める": ["相談・応募へ", "進める"],
  "忙しいから、人を増やす？": ["忙しいから、", "人を増やす？"], "仕事と役割を見直す": ["仕事と役割を", "見直す"], "人が力を発揮する": ["人が力を", "発揮する"],
};
function Caption({ text }: { text: string }) {
  return <p>{(captionParts[text] ?? [text]).map(part => <span key={part}>{part}</span>)}</p>;
}

function PaperPile() {
  return <svg viewBox="0 0 220 150" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${i % 2 ? 4 : 0} ${i * 12})`}><path d="m30 20 66-6 17 14-68 8-15-16Z M30 20v7l15 15 68-8v-6"/><path d="m46 24 42-4"/></g>)}
    <path d="m145 32 22-8 22 13-23 10-21-15Zm-7 38 31-9 23 17-33 7-21-15Zm-6 52h72M149 109c-1-17 5-28 17-28s18 13 17 28M159 67c-1 7 4 14 10 13 9-1 11-13 7-18-4-5-14-4-17 5Z"/>
    <path d="m141 7 4 10m20-10-6 9m39 38-11 2" stroke="var(--red)" />
  </svg>;
}

function ConnectedWork({ kind }: { kind: ServiceId }) {
  return <svg viewBox="0 0 220 150" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M83 35C31 42 25 104 79 119m61-85c49 15 56 64 10 84M90 25l20-3 21 4M89 130l21 3 20-4" stroke="var(--red)" />
    {[ [20, 53], [83, 3], [168, 53], [83, 107] ].map(([x,y]) => <g key={x+":"+y} transform={`translate(${x} ${y})`}><rect x="0" y="0" width="35" height="42" rx="3"/><path d="M8 11h19M8 20h19M8 29h13"/></g>)}
    {kind === "ai-operations" ? <g stroke="var(--red)" strokeWidth="7"><circle cx="110" cy="76" r="18"/><path d="M110 49v9m0 37v9M83 76h9m37 0h9M91 57l7 7m25 24 6 7m-38 0 7-7m25-24 6-7"/></g> : <g><rect x="77" y="54" width="65" height="45" rx="4"/><path d="M77 68h65M89 80h14m-14 9h38m-16-9h16"/><path d="m157 22 5 4 9-12" stroke="var(--red)"/></g>}
  </svg>;
}

function ClearDesk() {
  return <div className="work-story-desk" aria-hidden="true">
    <Image src="/brand-book/racco-self-avatar.png" alt="" width={1254} height={1254} unoptimized />
    <svg viewBox="0 0 220 150" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M32 91h122l-11 47H45L32 91Zm9 47h120M20 141h185M169 116h21v23h-21v-23Zm21 5c17-3 17 14 0 12" fill="var(--paper)"/><path d="m89 113 6 6 12-13" stroke="var(--red)"/><path d="m184 104-2-10m-24 3-6-8" stroke="var(--red)"/></svg>
  </div>;
}

export function WorkStory({ kind, captions }: { kind: ServiceId; captions: readonly string[] }) {
  return <figure className="work-story">
    <figcaption className="work-story-note">仕事の変化の例</figcaption>
    <div className="work-story-scenes">
      <div><PaperPile /><Caption text={captions[0]}/></div><ArrowRight className="work-story-arrow" aria-hidden="true" />
      <div><ConnectedWork kind={kind} /><Caption text={captions[1]}/></div><ArrowRight className="work-story-arrow" aria-hidden="true" />
      <div><ClearDesk /><Caption text={captions[2]}/></div>
    </div>
  </figure>;
}
