"use client";

import { useEffect, useState } from "react";

const COOKIE_KEY = "lakkan-cookie-consent";
const SANS = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      const consent = localStorage.getItem(COOKIE_KEY);
      if (!consent) setShow(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: true, ts: Date.now() }));
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ accepted: false, ts: Date.now() }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        maxWidth: 560,
        margin: "0 auto",
        zIndex: 9999,
        background: "#132126",
        color: "#F8F9F6",
        padding: "20px 24px",
        borderRadius: 10,
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        fontFamily: SANS,
        fontSize: 14,
        lineHeight: 1.6,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <p style={{ margin: 0 }}>
        当サイトはサイトの利用状況分析のため Cookie を使用します。詳細は{" "}
        <a
          href="/privacy"
          style={{
            color: "#F8F9F6",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >
          プライバシーポリシー
        </a>{" "}
        をご確認ください。
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          className="cookie-consent-button"
          onClick={reject}
          style={{
            fontFamily: SANS,
            fontSize: 12,
            color: "rgba(247,244,238,0.7)",
            background: "transparent",
            border: "1px solid rgba(247,244,238,0.3)",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          拒否
        </button>
        <button
          className="cookie-consent-button"
          onClick={accept}
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            color: "#132126",
            background: "#F8F9F6",
            border: "1px solid #F8F9F6",
            borderRadius: 6,
            padding: "8px 18px",
            cursor: "pointer",
          }}
        >
          同意する
        </button>
      </div>
    </div>
  );
}
