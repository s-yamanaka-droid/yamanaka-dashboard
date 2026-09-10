import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { PageHero } from "@/components/PageHero";
export const metadata:Metadata={title:"Contact — Lakkan Inc.",description:"AI・業務の再設計、プロダクト開発、Webサイト制作のご相談。株式会社Lakkan。"};
export default async function ContactPage({searchParams}:{searchParams:Promise<{topic?:string}>}) {
 const {topic}=await searchParams;
 return <main id="main" className="new-site"><PageHero section="Contact" title="話を、はじめよう。" lede="まだ形になっていないアイデアも、目の前の困りごとも。まずは、そのまま聞かせてください。"/><ContactForm initialTopic={topic}/></main>;
}
