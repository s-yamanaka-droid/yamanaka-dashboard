"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy } from "lucide-react";
import type { RaccoInquiryContext } from "@/lib/racco-inquiry";

const topics = [
  ["ai-consult", "AI・業務のご相談"],
  ["racco-goods", "グッズについて"],
  ["racco-design", "キャラクター・デザインの相談"],
  ["luna", "Luna AIについて"],
  ["placement", "人材紹介について"],
  ["crm", "CRM構築について"],
  ["fde", "FDEについて"],
  ["atelier-site", "サイトのデザイン相談"],
  ["corp-site", "コーポレートサイト制作"],
  ["recruit", "採用サイト・LP制作"],
  ["partnership", "パートナーシップ"],
  ["other", "その他"],
];
const recipient = "s-yamanaka@tre-pro.co.jp";

export function ContactForm({
  initialTopic = "ai-consult",
  projectName,
  raccoContext,
}: {
  initialTopic?: string;
  projectName?: string;
  raccoContext?: RaccoInquiryContext;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [topic, setTopic] = useState(topics.some(([id]) => id === initialTopic) ? initialTopic : "ai-consult");
  const [status, setStatus] = useState("");
  const [manualDraft, setManualDraft] = useState<string | null>(null);

  function makeDraft(form: HTMLFormElement) {
    const data = new FormData(form);
    const label = topics.find(([id]) => id === topic)?.[1] ?? "その他";
    const subject = `[Lakkan] ${label}`;
    const body = [
      `お名前：${data.get("name") ?? ""}`,
      `メール：${data.get("email") ?? ""}`,
      `会社名：${data.get("company") ?? ""}`,
      `ご相談：${label}`,
      ...(raccoContext?.bodyLines ?? []),
      ...(projectName ? [`見ていた実績：${projectName}`] : []),
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    return { subject, body, text: `宛先：${recipient}\n件名：${subject}\n\n${body}` };
  }

  async function copyDraft() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    const draft = makeDraft(form);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(draft.text);
      setManualDraft(null);
      setStatus("下書きをコピーしました。お問い合わせはまだ送信されていません。");
    } catch {
      setManualDraft(draft.text);
      setStatus("コピーできませんでした。入力内容は残っています。下の下書きを選択してコピーしてください。まだ送信されていません。");
    }
  }

  return (
    <section id="inquiry" className="contact-layout">
      <aside className="contact-aside">
        <p className="eyebrow">CONTACT / LAKKAN</p>
        <h2><span>まずは、</span><span>話そう。</span></h2>
        <p>人のこと。仕事の仕組みのこと。<br />いま困っていることから、お聞かせください。</p>
        <div className="contact-guide"><span>01 — テーマを選ぶ</span><span>02 — 相談内容を書く</span><span>03 — メールで確認して送る</span></div>
      </aside>
      <form
        ref={formRef}
        className="contact-form"
        onChange={() => { setStatus(""); setManualDraft(null); }}
        onSubmit={event => {
          event.preventDefault();
          const draft = makeDraft(event.currentTarget);
          window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
          setStatus("メールアプリで内容をご確認のうえ、送信してください。この画面ではまだ送信されていません。");
        }}
      >
        <div><label htmlFor="name">お名前（必須）</label><input id="name" name="name" autoComplete="name" required maxLength={100} /></div>
        <div><label htmlFor="email">メールアドレス（必須）</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
        <div><label htmlFor="company">会社名・所属（任意）</label><input id="company" name="company" autoComplete="organization" maxLength={200} /></div>
        <div><label htmlFor="topic">ご相談のテーマ</label><select id="topic" value={topic} onChange={event => setTopic(event.target.value)}>{topics.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></div>
        {raccoContext && <p className="contact-project-context">{raccoContext.sourceLabel}からのご相談です。{raccoContext.article && <>記事：<strong>{raccoContext.article.title}</strong>。</>}{raccoContext.product && <>グッズ：<strong>{raccoContext.product.title}</strong>。</>}<br />下の文章は自由に変更できます。</p>}
        {projectName && <p className="contact-project-context">「{projectName}」の実績からのご相談です。下の文章は自由に変更できます。</p>}
        <div><label htmlFor="message">ご相談内容（必須）</label><textarea id="message" name="message" rows={7} required maxLength={4000} defaultValue={raccoContext?.initialMessage ?? (projectName ? `${projectName}の実績を見て相談したいです。\n\n` : undefined)} placeholder="いまの課題や、実現したいことをお聞かせください。" /></div>
        <p className="form-note">お使いのメールアプリに下書きを作成します。アプリ側で送信するまで、お問い合わせは送られません。<br />ご相談内容は<Link href="/privacy">プライバシーポリシー</Link>に基づき取り扱います。</p>
        <div className="form-actions"><button className="pill-button orange" type="submit">メールの下書きを作る <span><ArrowUpRight size={18} /></span></button></div>
        <p className="form-note">メールアプリが開かない場合は、下書きをコピーして、<a href={`mailto:${recipient}`}>{recipient}</a> へ直接お送りください。</p>
        <div className="form-actions"><button className="pill-button" type="button" onClick={copyDraft}>下書きをコピーする <span><Copy size={18} /></span></button></div>
        <p className="form-status" role="status" aria-live="polite">{status}</p>
        {manualDraft !== null && <div><label htmlFor="manual-draft">手動コピー用の下書き（未送信）</label><textarea id="manual-draft" readOnly rows={12} value={manualDraft} onFocus={event => event.currentTarget.select()} /><p className="form-note">欄を選ぶと下書き全体が選択されます。コピーしてメールアプリへ貼り付けてください。</p></div>}
      </form>
    </section>
  );
}
