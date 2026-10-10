import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { SectionShell } from "@/components/primitives/SectionShell";
import { publicWorks } from "@/lib/work-detail";
import { buildRaccoInquiryHref, resolveRaccoInquiryContext } from "@/lib/racco-inquiry";
import { redirect } from "next/navigation";
import styles from "./contact.module.css";
export const metadata: Metadata = { title: "お問い合わせ — Lakkan", description: "人財支援・CRM構築・FDE・AI活用のご相談。株式会社Lakkan。" };
export default async function ContactPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const query=await searchParams;
  const raccoContext=resolveRaccoInquiryContext(query);
  if (raccoContext) redirect(buildRaccoInquiryHref({source:raccoContext.source,intent:raccoContext.intent,article:raccoContext.article?.slug,product:raccoContext.product?.slug}));
  const topic=typeof query.topic==="string"?query.topic:undefined;
  const selectedProject=typeof query.project==="string"?publicWorks.find(p=>p.id===query.project):undefined;
  const contextKey=selectedProject?.id;
  return <main id="main" className={`new-site contact-page ${styles.page}`}><SectionShell id="contact-intro" tone="white" className={styles.intro}><div className={styles.introGrid}><div><p className={styles.label}>CONTACT</p><h1>一緒に、<br />次の一歩を。</h1></div><p>やりたいことが、まだ曖昧でも。<br />いまの課題から、一緒に考えます。<br /><a href="#inquiry">相談内容を書く ↓</a></p></div></SectionShell><ContactForm key={`${topic}-${contextKey}`} initialTopic={topic} projectName={selectedProject?.name} raccoContext={raccoContext}/></main>;
}
