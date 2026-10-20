import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const crmScreens = {
  pipeline: {
    src: "/works/crm-pipeline-20261020.jpg",
    width: 1280,
    height: 720,
    alt: "実装したCRMの商談パイプライン。リードから受注まで、案件・金額・次のアクションを一覧する画面。掲載用サンプルデータを使用。",
  },
  customers: {
    src: "/works/crm-customers-20261020.jpg",
    width: 1270,
    height: 714,
    alt: "実装したCRMの顧客マスタ。会社名、契約プラン、ステータス、月額売上を一覧する画面。掲載用サンプルデータを使用。",
  },
};

export function CrmScreen({ screen, preload = false }: { screen: keyof typeof crmScreens; preload?: boolean }) {
  const image = crmScreens[screen];
  return <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1400px) calc(100vw - 112px), 1280px" quality={90} preload={preload} className="crm-screen-image" />;
}

export function CrmCaseCard() {
  return <article className="crm-case-card">
    <Link className="crm-case-preview" href="/works/crm-development#main" aria-label="CRM・営業支援ツールの制作事例を見る">
      <CrmScreen screen="pipeline" />
      <span className="crm-preview-link">制作事例を見る <ArrowUpRight size={18} aria-hidden="true" /></span>
    </Link>
    <div className="crm-case-caption">
      <div><p className="case-kicker">SYSTEM / CRM</p><h2><Link href="/works/crm-development#main">商談の先まで、<br />見渡せるCRM。<ArrowUpRight size={24} aria-hidden="true" /></Link></h2></div>
      <div><p>顧客マスタから、商談の進捗、次のアクションまで。実際に開発した業務ツールの画面と、その設計を紹介します。</p><p className="crm-screen-note">実装画面 / 掲載用サンプルデータ</p></div>
    </div>
  </article>;
}
