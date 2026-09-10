"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
const topics = [["ai-consult","AI・業務のご相談"],["luna","Luna AIについて"],["placement","人材紹介について"],["crm","CRM構築について"],["fde","FDEについて"],["atelier-site","サイトのデザイン相談"],["corp-site","コーポレートサイト制作"],["recruit","採用サイト・LP制作"],["partnership","パートナーシップ"],["other","その他"]];
export function ContactForm({initialTopic = "ai-consult"}:{initialTopic?:string}) {
 const [topic,setTopic]=useState(topics.some(([id])=>id===initialTopic)?initialTopic:"ai-consult");
 const [status,setStatus]=useState("");
 return <section className="contact-layout"><aside className="contact-aside"><p className="eyebrow">FIRST, A CONVERSATION.</p><h2>課題の整理から、<br/>お付き合いします。</h2><p>「何からはじめればいい？」も、立派なご相談です。<br/>事業の状況と、実現したいことをお聞かせください。</p></aside><form className="contact-form" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const body=["お名前："+data.get("name"),"メール："+data.get("email"),"会社名："+data.get("company"),"ご相談："+topics.find(([id])=>id===topic)?.[1],"",String(data.get("message"))].join("\n");window.location.href="mailto:s-yamanaka@tre-pro.co.jp?subject="+encodeURIComponent("[Lakkan] "+topics.find(([id])=>id===topic)?.[1])+"&body="+encodeURIComponent(body);setStatus("メールアプリで内容をご確認のうえ、送信してください。");}}>
 <div><label htmlFor="name">お名前（必須）</label><input id="name" name="name" autoComplete="name" required maxLength={100}/></div>
 <div><label htmlFor="email">メールアドレス（必須）</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
 <div><label htmlFor="company">会社名・所属（任意）</label><input id="company" name="company" autoComplete="organization" maxLength={200}/></div>
 <div><label htmlFor="topic">ご相談のテーマ</label><select id="topic" value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></div>
 <div><label htmlFor="message">ご相談内容（必須）</label><textarea id="message" name="message" rows={7} required maxLength={4000} placeholder="いまの課題や、実現したいことをお聞かせください。"/></div>
 <p className="form-note">お使いのメールアプリに下書きを作成します。アプリ側で送信するまで、お問い合わせは送られません。<br/>ご相談内容は<Link href="/privacy">プライバシーポリシー</Link>に基づき取り扱います。</p>
 <div className="form-actions"><button className="pill-button orange" type="submit">メールの下書きを作る <span><ArrowUpRight size={18}/></span></button></div>
 <p className="form-status" role="status">{status}</p>
 <p className="form-note">メールアプリが開かない場合は、<a href="mailto:s-yamanaka@tre-pro.co.jp">s-yamanaka@tre-pro.co.jp</a> へ直接お送りください。</p>
 </form></section>;
}
