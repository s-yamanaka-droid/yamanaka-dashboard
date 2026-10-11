import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { SectionShell } from "@/components/primitives/SectionShell";
import { publicWorks } from "@/lib/work-detail";
import { buildRaccoInquiryHref, resolveRaccoInquiryContext } from "@/lib/racco-inquiry";
import { redirect } from "next/navigation";
import { PosterRule, StudioPeople } from "@/components/site/PosterHeading";
import { BrandHeading } from "@/components/site/BrandHeading";
export const metadata: Metadata = { title: "お問い合わせ — Lakkan", description: "人財支援・CRM構築・FDE・AI活用のご相談。株式会社Lakkan。" };
export default async function ContactPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const query=await searchParams;
  const raccoContext=resolveRaccoInquiryContext(query);
  if (raccoContext) redirect(buildRaccoInquiryHref({source:raccoContext.source,intent:raccoContext.intent,article:raccoContext.article?.slug,product:raccoContext.product?.slug}));
  const topic=typeof query.topic==="string"?query.topic:undefined;
  const selectedProject=typeof query.project==="string"?publicWorks.find(p=>p.id===query.project):undefined;
  const contextKey=selectedProject?.id;
  return <main id="main" className="poster-page poster-contact"><SectionShell id="contact-intro"><PosterRule index="04"/><ContactForm key={`${topic}-${contextKey}`} initialTopic={topic} projectName={selectedProject?.name} raccoContext={raccoContext} variant="poster" posterIntro={<><p className="poster-page-name" aria-hidden="true">CONTACT</p><BrandHeading as="h1" reveal={false}>{"一緒に、\n次の一歩を。"}</BrandHeading><p>やりたいことが、まだ曖昧でも。<br/>いまの課題から、一緒に考えます。<br/>まずは、お気軽にご相談ください。</p><StudioPeople scene="wave"/><p className="poster-contact-caption">まとまっていなくても、どうぞ。</p></>}/></SectionShell></main>;
}
