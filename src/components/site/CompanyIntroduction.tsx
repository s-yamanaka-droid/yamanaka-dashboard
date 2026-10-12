import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** A short corporate introduction, grounded in Lakkan's existing company concept. */
export function CompanyIntroduction({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`company-introduction${compact ? " is-compact" : ""}`}>
      <div className="company-introduction-title">
        <p className="company-eyebrow">{compact ? "WHO WE ARE" : "OUR PHILOSOPHY"}</p>
        <h2><span>楽観と、</span><span>計画と。</span></h2>
        <p className="company-introduction-caption">株式会社Lakkan / ラッカン</p>
      </div>
      <div className="company-introduction-copy">
        <p className="company-introduction-lead">「こうなったらいいな」を、<br/>動く仕組みにしていく。</p>
        <p>人手が足りない。情報が散らばる。毎日の作業に追われて、次のことに手が回らない。Lakkanは、そんな人と仕事の課題を整理し、必要な仕組みをつくる会社です。</p>
        <p>業務の見直し、AIやシステムの活用、Webの伝え方、人と組織のつながり。ひとつの方法に決めつけず、課題に合わせて組み合わせます。小さく試し、使う人と確かめながら、実装と運用まで進めます。</p>
        {!compact && <p>社名のLakkanは、LUCKと「楽観」から。できる気がする、その先へ。前向きな気持ちを、計画と日々使える道具につなげることを大切にしています。</p>}
        <div className="company-introduction-actions">
          <Link className="company-introduction-link" href={compact ? "/about" : "/services"}>{compact ? "Lakkanについて" : "支援内容と進め方を見る"}<ArrowUpRight size={18} aria-hidden="true"/></Link>
          <Link className="company-introduction-link" href="/records">6枚のレコードで、Lakkanを聴く<ArrowUpRight size={18} aria-hidden="true"/></Link>
        </div>
      </div>
    </div>
  );
}
