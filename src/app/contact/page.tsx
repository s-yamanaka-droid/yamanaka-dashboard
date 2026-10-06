import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { SectionShell } from "@/components/primitives/SectionShell";
import { publicWorks } from "@/lib/work-detail";
import styles from "./contact.module.css";
export const metadata: Metadata = { title: "お問い合わせ — Lakkan", description: "人財支援・CRM構築・FDE・AI活用のご相談。株式会社Lakkan。" };
export default async function ContactPage({searchParams}:{searchParams:Promise<{topic?:string;project?:string}>}) {
  const {topic,project}=await searchParams;
  const selectedProject=publicWorks.find(p=>p.id===project);
  return <main id="main" className={`new-site contact-page ${styles.page}`}><SectionShell id="contact-intro" tone="white" className={styles.intro}><div className={styles.introGrid}><div><p className={styles.label}>CONTACT</p><h1>一緒に、<br />次の一歩を。</h1></div><p>やりたいことが、まだ曖昧でも。<br />いまの課題から、一緒に考えます。<br /><a href="#inquiry">相談内容を書く ↓</a></p></div></SectionShell><ContactForm key={`${topic}-${selectedProject?.id}`} initialTopic={topic} projectName={selectedProject?.name}/></main>;
}
