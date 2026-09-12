import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PrismaHero } from "@/components/site/PrismaHero";
import { ServiceScene } from "@/components/site/ServiceScene";
import news from "../../public/now-on-air/index.json";

const items = [
  { id: "luna", name: "Luna", category: "PERSONAL AI", title: ["あなた専用に、", "育つAI。"], text: "日々の判断や仕事の経験を蓄積し、あなたと働くAIの右腕。Luna AIの導入と活用をご案内します。", href: "https://lunatech-migration-guide.vercel.app", link: "Luna AIを知る", note: "LunaTechのサービスです。" },
  { id: "recruitment", name: "人材紹介", category: "PEOPLE", title: ["人と事業の、", "次の出会いを。"], text: "企業が目指す未来と、一人ひとりが進みたい方向。双方の想いを聞くところから、採用のご相談に向き合います。", href: "/contact?topic=placement", link: "人材について相談する" },
  { id: "news", name: "News", category: "NOW ON AIR", title: ["変化を知る。", "次を考える。"], text: "AIの動きと、仕事に関わる変化をピックアップ。Now on AIrで、日々のニュースを届けています。", href: "https://nowonair.vercel.app", link: "ニュースを読む" },
  { id: "crm", name: "CRM構築", category: "CUSTOMER RELATIONSHIP", title: ["顧客との関係を、", "仕組みに。"], text: "顧客情報、商談、日々のフォローを一つの流れへ。現場の仕事に合わせて、使い続けられるCRMを設計・構築します。", href: "/contact?topic=crm", link: "CRMについて相談する" },
  { id: "fde", name: "FDE", category: "FORWARD DEPLOYED ENGINEERING", title: ["現場に入り、", "一緒につくる。"], text: "業務を理解し、課題を見つけ、実装する。エンジニアが現場に伴走し、開発から運用・改善までつなぎます。", href: "/contact?topic=fde", link: "FDEについて相談する" },
];

export default function Home() {
  return <main id="main" className="prisma-home">
    <PrismaHero />
    <div className="prisma-index">
      <div className="prisma-intro"><p>IDEAS INTO REALITY</p><p>LAKKAN / TOKYO</p></div>
      <div className="prisma-statement"><p>少し先の未来を、<br/><span>一緒におもしろく。</span></p><span>人の可能性と、テクノロジーの可能性。<br/>その間に、新しい仕事をつくる。</span></div>
      {items.map(item => <section className="prisma-item" id={item.id} key={item.id} aria-labelledby={`${item.id}-title`}>
        <div className="prisma-item-name"><h2 id={`${item.id}-title`}>{item.name}</h2><span>{item.category}</span></div>
        <div className="prisma-item-copy"><h3>{item.title.map(phrase => <span key={phrase}>{phrase}</span>)}</h3><p>{item.text}</p>{item.note && <small>{item.note}</small>}<Link className="prisma-text-link" href={item.href}>{item.link}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <ServiceScene id={item.id} articles={item.id === "news" ? news.articles.map(a=>({title:a.title,category:a.category,image:a.image,link:a.link,lede:a.lede})) : []}/>
      </section>)}
      <div className="prisma-contact"><h2><span>まずは、</span><span>話してみませんか。</span></h2><Link className="prisma-pill" href="/contact">お問い合わせ<span><ArrowUpRight size={19} aria-hidden="true" /></span></Link></div>
    </div>
  </main>;
}
