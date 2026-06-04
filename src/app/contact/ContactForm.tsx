"use client";

import { useEffect, useState } from "react";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";
const FOREST = "#1F3A2E";
const INK = "#0D0D0D";
const MUTED = "#5A554D";
const RULE = "rgba(13,13,13,0.14)";

const TOPICS = [
  { id: "ai-consult", label: "AI 活用相談" },
  { id: "vigil", label: "Vigil AI 導入" },
  { id: "atelier-site", label: "Atelier でサイト制作（素地から）" },
  { id: "corp-site", label: "コーポレートサイト制作" },
  { id: "recruit", label: "採用 DX / LP 制作" },
  { id: "partnership", label: "パートナーシップ" },
  { id: "other", label: "その他" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("ai-consult");
  const [message, setMessage] = useState("");

  // /contact?topic=atelier-site などのクエリで初期トピックを切替
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("topic");
    if (q && TOPICS.some((t) => t.id === q)) setTopic(q);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? "";
    const subject = `[Lakkan Contact] ${topicLabel} — ${name}`;
    const body = [
      `お名前：${name}`,
      `メール：${email}`,
      `会社名：${company || "（未記入）"}`,
      `ご相談：${topicLabel}`,
      "",
      "本文：",
      message,
      "",
      "—",
      "送信元：lakkan-inc.vercel.app/contact",
    ].join("\n");
    const mailto = `mailto:s-yamanaka@tre-pro.co.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: SANS,
    fontSize: 15,
    color: INK,
    background: "#FFFFFF",
    border: `1px solid ${RULE}`,
    borderRadius: 8,
    padding: "12px 14px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 600,
    color: MUTED,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <section
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "80px 32px 160px",
      }}
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <label htmlFor="name" style={labelStyle}>
            お名前 <span style={{ color: FOREST }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={fieldStyle}
            placeholder="山中 秀斗"
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
            メールアドレス <span style={{ color: FOREST }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={fieldStyle}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="company" style={labelStyle}>
            会社名・所属（任意）
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={fieldStyle}
            placeholder="株式会社○○"
          />
        </div>

        <div>
          <label htmlFor="topic" style={labelStyle}>
            ご相談内容
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ ...fieldStyle, cursor: "pointer" }}
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" style={labelStyle}>
            本文 <span style={{ color: FOREST }}>*</span>
          </label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            style={{ ...fieldStyle, resize: "vertical", minHeight: 160 }}
            placeholder="どんな課題に直面していますか？具体的にお書きいただけると、回答がスムーズです。"
          />
        </div>

        <p style={{ fontFamily: SANS, fontSize: 12, color: MUTED, lineHeight: 1.7, marginTop: 8 }}>
          送信ボタンを押すと、お使いのメールソフトが起動します。直接送信は{" "}
          <a href="mailto:s-yamanaka@tre-pro.co.jp" style={{ color: FOREST, textDecoration: "underline" }}>
            s-yamanaka@tre-pro.co.jp
          </a>{" "}
          まで。
          <br />
          ご相談内容は{" "}
          <a href="/privacy" style={{ color: FOREST, textDecoration: "underline" }}>
            プライバシーポリシー
          </a>{" "}
          に基づき適切に取り扱います。
        </p>

        <button
          type="submit"
          style={{
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFFFF",
            background: FOREST,
            border: "none",
            borderRadius: 8,
            padding: "16px 32px",
            cursor: "pointer",
            letterSpacing: "0.04em",
            marginTop: 8,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#162B22")}
          onMouseLeave={(e) => (e.currentTarget.style.background = FOREST)}
        >
          メールアプリを開いて送信
        </button>
      </form>

      <div
        style={{
          marginTop: 80,
          paddingTop: 40,
          borderTop: `1px solid ${RULE}`,
          fontFamily: SANS,
          fontSize: 13,
          color: MUTED,
          lineHeight: 1.8,
        }}
      >
        <p style={{ fontFamily: FRANK, fontSize: 18, color: INK, marginBottom: 16 }}>
          直接連絡したい方へ
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            Email：
            <a href="mailto:s-yamanaka@tre-pro.co.jp" style={{ color: FOREST }}>
              s-yamanaka@tre-pro.co.jp
            </a>
          </li>
          <li>所在地：東京都渋谷区神宮前六丁目23番4号</li>
          <li>営業時間：平日 10:00–19:00（メールは24時間受付）</li>
        </ul>
      </div>
    </section>
  );
}
