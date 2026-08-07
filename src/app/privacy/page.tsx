import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "プライバシーポリシー — Lakkan Inc.",
  description:
    "株式会社Lakkan のプライバシーポリシー。個人情報の取扱い・利用目的・第三者提供・開示請求について明記。",
};

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

export default function PrivacyPage() {
  return (
    <main id="main" style={{ background: "#EEF0EC", minHeight: "100vh" }}>
      <PageHero
        section="Privacy Policy"
        version="v.1"
        title="プライバシーポリシー。"
        lede="個人情報の取扱いに関する基本方針。最終改定 2026年5月。"
      />
      <section
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "80px 32px 160px",
          fontFamily: SANS,
          color: "#132126",
          fontSize: 16,
          lineHeight: 1.85,
        }}
      >
        <p style={{ marginBottom: 48 }}>
          株式会社Lakkan（以下「当社」といいます）は、お客様の個人情報を取り扱うにあたり、個人情報保護法その他の関連法令を遵守し、適切な保護・管理を行います。本プライバシーポリシーは、当社がお客様の個人情報をどのように取り扱うかを定めるものです。
        </p>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          1. 事業者情報
        </h2>
        <ul style={{ paddingLeft: 24, marginBottom: 32 }}>
          <li>事業者名：株式会社Lakkan</li>
          <li>所在地：東京都渋谷区神宮前六丁目23番4号</li>
          <li>代表者：山中 秀斗</li>
          <li>連絡先：s-yamanaka@tre-pro.co.jp</li>
        </ul>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          2. 取得する個人情報
        </h2>
        <p>当社は、以下の場面で個人情報を取得することがあります。</p>
        <ul style={{ paddingLeft: 24, marginBottom: 32 }}>
          <li>お問い合わせフォーム送信時：氏名、メールアドレス、会社名、お問い合わせ内容</li>
          <li>採用応募時：氏名、連絡先、職歴、その他応募者が提供する情報</li>
          <li>サービス利用時：利用ログ、アクセス情報、Cookie 等</li>
        </ul>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          3. 利用目的
        </h2>
        <p>取得した個人情報は、以下の目的の範囲内で利用します。</p>
        <ul style={{ paddingLeft: 24, marginBottom: 32 }}>
          <li>お問い合わせへの回答・対応</li>
          <li>採用選考のため</li>
          <li>サービス提供・改善のため</li>
          <li>当社からのお知らせ・ご案内のため</li>
          <li>法令に基づく対応のため</li>
        </ul>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          4. 第三者提供
        </h2>
        <p style={{ marginBottom: 32 }}>
          当社は、以下の場合を除き、お客様の事前の同意なく個人情報を第三者に提供しません。
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 32 }}>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要であって、お客様の同意を得ることが困難である場合</li>
          <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要であって、お客様の同意を得ることが困難である場合</li>
          <li>国の機関等が法令の定める事務を遂行することに対して協力する必要がある場合</li>
        </ul>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          5. Cookie および解析ツール
        </h2>
        <p style={{ marginBottom: 32 }}>
          当社サイトでは、サイトの利用状況を分析するため、Vercel Analytics 等の Cookie および類似技術を利用することがあります。これらの情報には個人を特定する情報は含まれません。ブラウザの設定により Cookie を無効化することができますが、その場合一部のサービスが正常に動作しない可能性があります。
        </p>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          6. 保有個人データの開示・訂正・利用停止
        </h2>
        <p style={{ marginBottom: 32 }}>
          お客様ご本人から、保有個人データの開示・訂正・利用停止・削除のご請求があった場合、合理的な期間内に対応します。お申し出は、上記事業者連絡先までご連絡ください。
        </p>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          7. 安全管理措置
        </h2>
        <p style={{ marginBottom: 32 }}>
          当社は、個人情報の漏えい、滅失または毀損の防止その他の安全管理のため、適切な組織的・技術的・人的安全管理措置を講じます。
        </p>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          8. プライバシーポリシーの変更
        </h2>
        <p style={{ marginBottom: 32 }}>
          本ポリシーの内容は、法令の変更または当社の判断により改定することがあります。改定後の内容は本ページに掲載した時点から効力を生じるものとします。
        </p>

        <h2 style={{ fontFamily: FRANK, fontSize: 26, fontWeight: 400, marginTop: 56, marginBottom: 16, letterSpacing: "-0.01em" }}>
          9. お問い合わせ
        </h2>
        <p style={{ marginBottom: 32 }}>
          本ポリシーまたは個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 64 }}>
          <li>株式会社Lakkan 個人情報問合せ窓口</li>
          <li>Email：<a href="mailto:s-yamanaka@tre-pro.co.jp" style={{ color: "#315A4E", textDecoration: "underline" }}>s-yamanaka@tre-pro.co.jp</a></li>
        </ul>

        <p style={{ fontSize: 13, color: "#45545A", borderTop: "1px solid rgba(19,33,38,0.12)", paddingTop: 24 }}>
          制定：2026年5月23日<br />
          株式会社Lakkan 代表取締役 山中 秀斗
        </p>
      </section>
    </main>
  );
}
