import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
export const metadata: Metadata = { title: "お問い合わせ — Lakkan", description: "人財支援・CRM構築・FDE・AI活用のご相談。株式会社Lakkan。" };
export default async function ContactPage({searchParams}:{searchParams:Promise<{topic?:string}>}) {
  const {topic}=await searchParams;
  return <main id="main" className="new-site contact-page"><ContactForm initialTopic={topic}/></main>;
}
