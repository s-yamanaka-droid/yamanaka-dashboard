import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { WaterSculpture } from "@/components/site/WaterSculpture";
import { SectionShell } from "@/components/primitives/SectionShell";
import { publicWorks } from "@/lib/work-detail";
export const metadata: Metadata = { title: "お問い合わせ — Lakkan", description: "人財支援・CRM構築・FDE・AI活用のご相談。株式会社Lakkan。" };
export default async function ContactPage({searchParams}:{searchParams:Promise<{topic?:string;project?:string}>}) {
  const {topic,project}=await searchParams;
  const selectedProject=publicWorks.find(p=>p.id===project);
  return <main id="main" className="new-site contact-page water-contact-page"><SectionShell id="contact-water-hero"><div className="water-contact-top"><p>お問い合わせ</p><p>話すことから、はじめよう。</p></div><h1 className="water-accessible-title">お問い合わせ — Let’s talk.</h1><WaterSculpture src="/brand/lets-talk-orange.jpg" alt="浅い水面に浮かぶ、オレンジのLet’s talk." priority/><a className="water-form-jump" href="#inquiry">相談内容を書く ↓</a></SectionShell><ContactForm key={`${topic}-${selectedProject?.id}`} initialTopic={topic} projectName={selectedProject?.name}/></main>;
}
