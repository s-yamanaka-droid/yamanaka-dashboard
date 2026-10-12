import Image from "next/image";
import type { ServiceId } from "@/data/service-stories";

const captionParts: Record<string, string[]> = {
  "同じ作業が何度も": ["同じ作業が", "何度も"], "任せる・なくす・つなぐ": ["任せる・", "なくす・", "つなぐ"], "人は、判断に集中": ["人は、", "判断に集中"],
  "あちこちに情報": ["あちこちに", "情報"], "顧客・履歴・役割をつなぐ": ["顧客・履歴・", "役割をつなぐ"], "次の対応がわかる": ["次の対応が", "わかる"],
  "強みが埋もれる": ["強みが", "埋もれる"], "言葉・体験・導線をつくる": ["言葉・体験・", "導線をつくる"], "相談・応募へ進める": ["相談・応募へ", "進める"],
  "忙しいから、人を増やす？": ["忙しいから、", "人を増やす？"], "仕事と役割を見直す": ["仕事と役割を", "見直す"], "人が力を発揮する": ["人が力を", "発揮する"],
};

const illustrations: Record<ServiceId, { src: string; alt: string; width: number; height: number }> = {
  "ai-operations": {
    src: "/brand-book/racco-scenes/ai-work-story-ink.png",
    alt: "紙の山に埋もれる人から、歯車で作業を整理し、机で落ち着いて考えるラッコへ",
    width: 2098, height: 750,
  },
  crm: {
    src: "/brand-book/racco-scenes/crm-work-story-ink.png",
    alt: "散らばる情報に迷う人から、顧客・予定・履歴をつなぎ、ラッコが次の対応を示す",
    width: 2098, height: 749,
  },
  digital: {
    src: "/brand-book/racco-scenes/digital-work-story-ink.png",
    alt: "伝え方に悩む人から、言葉・Web体験・相談の導線を整え、ラッコが事業の強みを届ける",
    width: 2098, height: 750,
  },
  people: {
    src: "/brand-book/racco-scenes/people-work-story-ink.png",
    alt: "仕事を抱える人から、チームの役割を分け、ラッコと仲間が同じ机で力を発揮する",
    width: 2097, height: 750,
  },
};

export function WorkStory({ kind, captions }: { kind: ServiceId; captions: readonly string[] }) {
  const illustration = illustrations[kind];
  return <figure className="work-story work-story-illustrated" data-story-kind={kind}>
    <figcaption className="work-story-note">仕事の変化の例</figcaption>
    <Image
      className="work-story-illustration"
      {...illustration}
      sizes="(max-width: 760px) calc(100vw - 68px), (max-width: 1000px) calc(100vw - 166px), 720px"
    />
    <div className="work-story-illustrated-captions">
      {captions.map(text => <p key={text}>{(captionParts[text] ?? [text]).map(part => <span key={part}>{part}</span>)}</p>)}
    </div>
  </figure>;
}
