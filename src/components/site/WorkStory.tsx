import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ServiceId } from "@/data/service-stories";
import type { ReactNode } from "react";

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

function AutomatedWork() {
  return <svg viewBox="0 0 220 150" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M83 35C31 42 25 104 79 119m61-85c49 15 56 64 10 84M90 25l20-3 21 4M89 130l21 3 20-4" stroke="var(--red)" />
    {[ [20, 53], [83, 3], [168, 53], [83, 107] ].map(([x,y]) => <g key={x+":"+y} transform={`translate(${x} ${y})`}><rect x="0" y="0" width="35" height="42" rx="3"/><path d="M8 11h19M8 20h19M8 29h13"/></g>)}
    <g stroke="var(--red)" strokeWidth="7"><circle cx="110" cy="76" r="18"/><path d="M110 49v9m0 37v9M83 76h9m37 0h9M91 57l7 7m25 24 6 7m-38 0 7-7m25-24 6-7"/></g>
  </svg>;
}

function ClearDesk() {
  return <div className="work-story-desk" aria-hidden="true">
    <Image src="/brand-book/racco-self-avatar.png" alt="" width={1254} height={1254} unoptimized />
    <svg viewBox="0 0 220 150" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M32 91h122l-11 47H45L32 91Zm9 47h120M20 141h185M169 116h21v23h-21v-23Zm21 5c17-3 17 14 0 12" fill="var(--paper)"/><path d="m89 113 6 6 12-13" stroke="var(--red)"/><path d="m184 104-2-10m-24 3-6-8" stroke="var(--red)"/></svg>
  </div>;
}

function Drawing({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 220 150" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

function ScatteredInformation() {
  return <Drawing>
    <g transform="rotate(-10 51 45)"><rect x="17" y="20" width="68" height="46" rx="3"/><path d="m18 23 33 25 33-25M18 64l23-24m20 0 23 24"/></g>
    <g transform="rotate(8 165 40)"><rect x="128" y="13" width="67" height="51" rx="3"/><path d="M128 28h67m-48 0v36m24-36v36m-42-18h66"/></g>
    <g transform="rotate(-4 91 106)"><rect x="59" y="78" width="79" height="58" rx="4"/><circle cx="79" cy="98" r="7"/><path d="M68 118c0-16 22-16 22 0m10-23h25m-25 12h18m-18 12h25"/></g>
    <path d="m94 26 13-5m3 16 9 4M33 82l-7 13m128 16 9 3m8-16 8-3" stroke="var(--red)"/>
    <path d="M172 78c18-4 31 7 24 17-7 8-15 5-15 17m0 10v1" stroke="var(--red)" strokeWidth="3.2"/>
  </Drawing>;
}

function ConnectedInformation() {
  return <Drawing>
    <path d="M44 39h55v25m76-26h-43v26M45 110h54V88m79 21h-46V88" stroke="var(--red)" strokeWidth="3"/>
    <g fill="var(--paper)"><rect x="13" y="15" width="52" height="40" rx="4"/><rect x="156" y="15" width="50" height="40" rx="4"/><rect x="13" y="91" width="51" height="42" rx="4"/><rect x="155" y="90" width="51" height="44" rx="4"/><rect x="78" y="51" width="65" height="51" rx="7"/></g>
    <path d="m14 19 25 19 25-19M166 28h28m-28 11h18m-142 63h24m-24 12h24m-24 10h14M166 102h28m-28 11h28m-28 10h18"/>
    <circle cx="110" cy="67" r="7"/><path d="M96 88c0-18 28-18 28 0"/>
    <path d="m149 68 8 6 11-15" stroke="var(--red)" strokeWidth="3"/>
  </Drawing>;
}

function BuriedMessage() {
  return <Drawing>
    <g transform="rotate(-9 65 78)"><rect x="29" y="30" width="87" height="106" rx="2"/><path d="M41 46h46m-46 11h58m-58 55h54m-54 11h36"/><path d="m73 69 5 12 13 1-10 8 3 13-11-7-12 7 3-13-10-8 14-1 5-12Z" stroke="var(--red)"/></g>
    <g transform="rotate(12 137 80)" fill="var(--paper)"><path d="M94 25h82v103H94z"/><path d="M105 41h56m-56 12h44m-44 16h56m-56 12h52m-52 16h56m-56 12h37" fill="none"/></g>
    <path d="m11 84 8-3m166-49 9-8m-7 29 13 2M100 8l2 9" stroke="var(--red)"/>
    <path d="M181 110c10-17 25-8 17 1l-6 6m-4 8v1" stroke="var(--red)" strokeWidth="3"/>
  </Drawing>;
}

function MessageJourney() {
  return <Drawing>
    <path d="M45 71c-23 36 30 65 73 47m26-80c35-10 50 4 46 31" stroke="var(--red)" strokeDasharray="4 6"/>
    <path d="m111 112 9 6-7 9m70-63 7 7 8-7" stroke="var(--red)"/>
    <path d="M15 22h61v40H39L25 73V62H15V22Z" fill="var(--paper)"/><path d="M28 36h35m-35 12h24"/>
    <g transform="rotate(-5 112 70)"><rect x="86" y="21" width="67" height="88" rx="3" fill="var(--paper)"/><path d="M86 34h67m-56 12h44m-44 9h31"/><path d="M97 67h43v29H97z" fill="var(--red)" stroke="var(--red)"/><path d="m113 76 10 7-10 6" stroke="var(--paper)"/></g>
    <rect x="157" y="80" width="49" height="53" rx="3" fill="var(--paper)"/><path d="M166 91h30m-30 10h18"/><path d="m171 115 6 6 12-14" stroke="var(--red)" strokeWidth="3"/>
  </Drawing>;
}

function OverloadedRole() {
  return <Drawing>
    <circle cx="95" cy="66" r="13"/><path d="M76 115V98c0-22 37-22 37 0v17M85 62h4m11 0h4m-15 14 10-2M61 119h72m-62 0-7 22m59-22 7 22"/>
    <g transform="rotate(-13 40 56)"><path d="M18 26h44v61H18z" fill="var(--paper)"/><path d="M28 39h24m-24 12h24m-24 12h18m-18 12h20"/></g>
    <g transform="rotate(10 130 34)"><path d="M108 9h40v45h-40z" fill="var(--paper)"/><path d="M118 22h20m-20 11h20m-20 11h14"/></g>
    <path d="M163 90V66h35v24m-38 0h42m-37 0-4 30m35-30 4 30" strokeDasharray="4 5"/>
    <path d="m66 8 5 15m-21-6 10 9M175 32c0-13 21-13 20-1-1 8-13 6-13 15m0 8v1" stroke="var(--red)"/>
  </Drawing>;
}

function RolesThatFit() {
  return <Drawing>
    <path d="M45 52v25h30v20m33-45v45m66-45v25h-33v20" stroke="var(--red)" strokeWidth="3"/>
    <g fill="var(--paper)"><rect x="20" y="12" width="50" height="41" rx="3" transform="rotate(-5 45 32)"/><rect x="84" y="12" width="48" height="41" rx="3"/><rect x="149" y="12" width="50" height="41" rx="3" transform="rotate(5 175 32)"/></g>
    <path d="m36 40 8-20 8 20m-13-7h11m-6-5v12M98 27h20m-20 10h14m46-16h22m-16-5v29m-11-8h21"/>
    {[65, 110, 155].map((x, i) => <g key={x}><circle cx={x} cy={104 + (i === 1 ? -9 : 0)} r="9"/><path d={`M${x-14} 137v-8c0-18 28-18 28 0v8`}/></g>)}
    <path d="M23 137h174m-15-62 7 6 11-13" stroke="var(--red)"/>
  </Drawing>;
}

function RaccoOutcome({ kind }: { kind: Exclude<ServiceId, "ai-operations"> }) {
  const pose = { crm: "pointing", digital: "presenting", people: "welcoming" }[kind];
  return <div className={`work-story-outcome is-${kind}`} aria-hidden="true">
    <Image src={`/brand-book/racco-scenes/${pose}.png`} alt="" fill sizes="(max-width: 760px) 120px, 200px" />
    <Drawing>
      {kind === "crm" && <><g transform="rotate(-4 48 87)"><rect x="8" y="51" width="66" height="82" rx="4" fill="var(--paper)"/><path d="M20 66h39m-39 11h28m-28 13h38m-38 11h24"/><path d="M20 112h42v12H20z" fill="var(--red)" stroke="var(--red)"/><path d="m37 118 6 0m-2-3 3 3-3 3" stroke="var(--paper)"/></g><path d="M11 143h195m-99-117 6-10m7 16 10-4" stroke="var(--red)"/></>}
      {kind === "digital" && <><path d="m13 45 9 3m-2-22 6 7m161 6 5-10m-1 25 12-3" stroke="var(--red)"/><g transform="rotate(9 181 116)"><rect x="157" y="98" width="48" height="33" rx="3" fill="var(--paper)"/><path d="m158 101 23 16 23-16"/><circle cx="202" cy="98" r="8" fill="var(--red)" stroke="var(--red)"/><path d="m198 98 3 3 5-6" stroke="var(--paper)"/></g></>}
      {kind === "people" && <><path d="M16 93V76h28v17m-31 0h34m-30 0-4 37m30-37 4 37M172 102V85h28v17m-31 0h34m-30 0-4 30m30-30 4 30"/><path d="M12 141h193m-30-117 5 11m7-11-3 12m-21 2 11 4" stroke="var(--red)"/></>}
    </Drawing>
  </div>;
}

const beforeScenes = { "ai-operations": PaperPile, crm: ScatteredInformation, digital: BuriedMessage, people: OverloadedRole };
const changeScenes = { "ai-operations": AutomatedWork, crm: ConnectedInformation, digital: MessageJourney, people: RolesThatFit };

export function WorkStory({ kind, captions }: { kind: ServiceId; captions: readonly string[] }) {
  const BeforeScene = beforeScenes[kind];
  const ChangeScene = changeScenes[kind];
  return <figure className="work-story" data-story-kind={kind}>
    <figcaption className="work-story-note">仕事の変化の例</figcaption>
    <div className="work-story-scenes">
      <div><BeforeScene /><Caption text={captions[0]}/></div><ArrowRight className="work-story-arrow" aria-hidden="true" />
      <div><ChangeScene /><Caption text={captions[1]}/></div><ArrowRight className="work-story-arrow" aria-hidden="true" />
      <div>{kind === "ai-operations" ? <ClearDesk /> : <RaccoOutcome kind={kind} />}<Caption text={captions[2]}/></div>
    </div>
  </figure>;
}
