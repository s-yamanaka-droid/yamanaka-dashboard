import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import changelog from "@/data/changelog.json";
export const metadata:Metadata={title:"Updates — Lakkan Inc.",description:"Lakkanと公開プロダクトの更新情報。"};
export default function ChangelogPage(){return <main id="main" className="new-site"><PageHero section="Updates" title="少しずつ、次のかたちへ。" lede="Lakkanの制作・プロダクト・会社のアップデート。"/><section className="site-section">{changelog.entries.map((entry,i)=><article className="update-row" key={entry.date+i}><time dateTime={entry.date}>{entry.date}</time><div><p className="eyebrow">{entry.tag}</p><h2>{entry.title}</h2><p>{entry.body}</p><div className="update-links">{entry.links?.map(link=><a key={link.url} href={link.url} target={link.url.startsWith("http")?"_blank":undefined} rel={link.url.startsWith("http")?"noopener noreferrer":undefined}>{link.label} ↗</a>)}</div></div></article>)}</section></main>}
