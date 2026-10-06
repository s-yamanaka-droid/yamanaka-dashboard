import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { selectedWorks, workPresentationLabel } from "@/data/selected-works";
import { HomeHeader } from "./HomeHeader";
import styles from "./LakkanHome.module.css";

const services = [
  { title: "業務改善・AI活用", text: "仕事の流れを見直し、AIを活かす。現場の整理から、導入・運用まで支援します。", topic: "ai-consult" },
  { title: "CRM・業務アプリ", text: "顧客情報と、日々の仕事をつなぐ。現場に合うシステムを設計・開発します。", topic: "crm" },
  { title: "Webサイト・LP", text: "事業の強みを、伝わるかたちに。コーポレートサイトやサービス・採用LPを制作します。", topic: "corp-site" },
  { title: "採用・人材支援", text: "必要な役割を、一緒に考える。採用の仕組みづくりから、人材の定着・活躍まで支援します。", topic: "placement" },
];

const workNotes: Record<string, string> = {
  "now-on-air": "AIの動きを、事業の視点で読む。情報が自然に届く、新聞のようなWebメディア。",
  "luna-ai": "ブランドの世界観を、ひとつの体験に。文字と動きで理念を伝える公式サイト。",
};

function SectionHeading({ title, english }: { title: string; english: string }) {
  return <div className={styles.sectionHeading}><h2>{title}</h2><span className={styles.headingRule} aria-hidden="true" /><span className={styles.englishLabel}>{english}</span></div>;
}

export default function LakkanHome() {
  return <div className={styles.home} data-home="cobalt">
    <HomeHeader />
    <main id="main" tabIndex={-1}>
      <SectionShell id="home-intro" tone="cobalt" className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.wordmark} aria-hidden="true">{"Lakkan".split("").map((letter, index) => <span key={index} style={{ "--letter-order": index } as CSSProperties}>{letter}</span>)}</p>
          <div className={styles.heroBottom}>
            <h1 className={styles.headline}><span>頭はやわらかく。</span><span>つくるのは、しっかり。</span></h1>
            <div className={styles.heroCopy}>
              <p className={styles.heroLead}>業務を見直す。技術を活かす。<br />人と組織をつなぐ。</p>
              <p className={styles.heroDescription}>業務改善・AI活用、CRM開発、<br />Web制作、人材支援。<br />課題の整理から実装まで、伴走します。</p>
              <Link href="/contact#inquiry" className={styles.heroContact}>相談する <ArrowUpRight size={21} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="home-works" tone="white" className={styles.worksSection}>
        <SectionHeading title="制作例" english="SELECTED WORKS" />
        <div className={styles.workList}>
          {selectedWorks.map(project => <article key={project.id} className={styles.work} data-selected-work={project.id}>
            <div className={styles.workInfo}>
              <h3><Link href={`/works/${project.id}`}>{project.name}<ArrowUpRight size={22} aria-hidden="true" /></Link></h3>
              <p className={styles.workType}>{workPresentationLabel(project)}</p>
              <p className={styles.workDescription}>{workNotes[project.id]}</p>
              <div className={styles.workLinks}>
                <Link href={`/works/${project.id}`} className={styles.detailLink}>制作例を見る <ArrowRight size={17} aria-hidden="true" /></Link>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.externalLink} aria-label={`${project.name}の公開サイトを別タブで開く`}>公開サイト <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <Link href={`/works/${project.id}`} className={styles.workImage} aria-label={`${project.name}の制作例を見る`}>
              <Image src={project.cover} alt={project.coverAlt} width={1280} height={720}
                sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1440px) 70vw, 930px"
                loading="lazy" />
              <span className={styles.imageAction} aria-hidden="true"><ArrowUpRight size={23} /></span>
            </Link>
          </article>)}
        </div>
      </SectionShell>

      <SectionShell id="home-services" tone="white" className={styles.servicesSection}>
        <SectionHeading title="できること" english="WHAT WE DO" />
        <div className={styles.services}>
          {services.map(service => <article key={service.topic} className={styles.service}>
            <div><h3>{service.title}</h3><p>{service.text}</p>
              <Link href={`/contact?topic=${service.topic}#inquiry`} aria-label={`${service.title}について相談する`} className={styles.serviceLink}>相談する <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </article>)}
        </div>
        <div className={styles.serviceBottom}><p>ひとつの方法にとらわれず、<br className={styles.mobileBreak} />事業の課題に向き合います。</p><Link href="/services#support" className={styles.detailLink}>支援内容を詳しく見る <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </SectionShell>

      <SectionShell id="home-contact" tone="white" className={styles.contactSection}>
        <div className={styles.contactLayout}>
          <div><p className={styles.contactLabel}>CONTACT</p><h2><span>一緒に、</span><span>次の一歩を。</span></h2></div>
          <div className={styles.contactCopy}><p>やりたいことが、まだ曖昧でも。<br />いまの課題から、一緒に考えます。</p><Link href="/contact#inquiry" className={styles.contactButton}>相談をはじめる <ArrowUpRight size={24} aria-hidden="true" /></Link></div>
        </div>
      </SectionShell>
    </main>
    <footer className={styles.footer}>
      <div className={styles.footerInner}><Link href="/" className={styles.footerBrand}>Lakkan<span>株式会社Lakkan</span></Link>
        <nav aria-label="フッターナビゲーション"><Link href="/about">会社情報</Link><Link href="/contact#inquiry">お問い合わせ</Link><Link href="/privacy">Privacy</Link></nav>
        <small>© 2026 Lakkan Inc.</small>
      </div>
    </footer>
  </div>;
}
