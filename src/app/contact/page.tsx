import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact — Lakkan Inc.",
  description:
    "株式会社Lakkan へのお問い合わせ。AI 活用相談・コーポレートサイト制作・採用 DX・パートナーシップ。",
  openGraph: {
    title: "Contact — Lakkan Inc.",
    description: "AI で動かす。Lakkan へのお問い合わせはこちらから。",
  },
};

export default function ContactPage() {
  return (
    <main style={{ background: "#F7F4EE", minHeight: "100vh" }}>
      <PageHero
        section="Contact"
        version="v.1"
        title="話を、はじめよう。"
        lede="AI 活用 / プロダクト相談 / パートナーシップ。何でも、まずは送ってください。"
      />
      <ContactForm />
    </main>
  );
}
