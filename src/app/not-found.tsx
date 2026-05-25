import type { Metadata } from "next";
import Link from "next/link";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const INSTRUMENT = "var(--font-instrument), 'Instrument Serif', 'Frank Ruhl Libre', Georgia, serif";
const SANS = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";
const INK = "#0D0D0D";
const FOREST = "#1F3A2E";
const VERMILLION = "#B8362E";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "お探しのページが見つかりません。",
};

const LINKS = [
  { href: "/", label: "Home", desc: "トップへ戻る" },
  { href: "/about", label: "About", desc: "山中秀斗 / Lakkan の思想" },
  { href: "/services", label: "Services", desc: "提供サービス一覧" },
  { href: "/works", label: "Works", desc: "プロダクトポートフォリオ" },
  { href: "/vigil", label: "Vigil AI", desc: "育つ第二の脳" },
  { href: "/contact", label: "Contact", desc: "お問い合わせ" },
];

export default function NotFound() {
  return (
    <main
      style={{
        background: "#F7F4EE",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 32px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 600,
            color: VERMILLION,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Error · 404
        </p>
        <h1
          style={{
            fontFamily: INSTRUMENT,
            fontSize: "clamp(64px, 11vw, 144px)",
            fontWeight: 400,
            color: INK,
            letterSpacing: "-0.025em",
            lineHeight: 0.95,
            margin: 0,
            marginBottom: 24,
          }}
        >
          道に迷いました。
        </h1>
        <p
          style={{
            fontFamily: FRANK,
            fontStyle: "italic",
            fontSize: 22,
            color: INK,
            opacity: 0.7,
            lineHeight: 1.5,
            marginBottom: 64,
            maxWidth: 520,
          }}
        >
          このページは存在しないか、移動した可能性があります。
          <br />
          下記から、行きたかった場所を選んでください。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: "rgba(13,13,13,0.14)",
            border: "1px solid rgba(13,13,13,0.14)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "20px 22px",
                background: "#FFFFFF",
                textDecoration: "none",
                color: INK,
                transition: "background 0.2s",
              }}
              className="not-found-link"
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  color: FOREST,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {l.label}
              </span>
              <span
                style={{
                  fontFamily: FRANK,
                  fontSize: 15,
                  color: INK,
                  opacity: 0.85,
                }}
              >
                {l.desc}
              </span>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 48, fontFamily: SANS, fontSize: 12, color: "rgba(13,13,13,0.5)" }}>
          ※ 心当たりがある場合は、URL を再確認の上、
          <Link href="/contact" style={{ color: FOREST, textDecoration: "underline" }}>
            お問い合わせ
          </Link>{" "}
          ください。
        </p>
      </div>
    </main>
  );
}
