"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BOOT_LINES = [
  "[init] vigil.kernel booted · v2.5.0",
  "[net]  tailscale link · 100.99.131.109 → 100.86.81.47 · 12ms",
  "[brain] vault indexed · 451 docs · 7 cortical regions",
  "[ai]   claude-code · gemma-3-12b · gemini-flash online",
  "[reg]  55 products · 6 companies · 32 skills synced",
  "[auth] awaiting principal — yamanaka.shuto@*",
];

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/products";
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"idle" | "auth" | "ok">("idle");
  const [bootIdx, setBootIdx] = useState(0);
  const [clock, setClock] = useState("");

  // ブートログ ストリーム演出
  useEffect(() => {
    if (bootIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIdx(i => i + 1), 220 + Math.random() * 180);
      return () => clearTimeout(t);
    }
  }, [bootIdx]);

  // 時計
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const z = (n: number) => String(n).padStart(2, "0");
      setClock(`${d.getFullYear()}.${z(d.getMonth()+1)}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStage("auth");
    // 演出のため少し待つ
    await new Promise(r => setTimeout(r, 700));
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) {
        setStage("ok");
        await new Promise(r => setTimeout(r, 500));
        router.push(next);
      } else {
        setError("vector mismatch — credential rejected");
        setStage("idle");
      }
    } catch {
      setError("connection severed");
      setStage("idle");
    }
  }

  const ink = "#0D0D0D";
  const accent = "#FF4F00";
  const lime = "#137333";

  return (
    <main style={{
      minHeight: "100vh",
      background: "#F5F5F0",
      color: ink,
      fontFamily: "'DM Sans', 'Noto Sans JP', sans-serif",
      padding: "0 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* グリッド背景 */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(#0d0d0d10 1px, transparent 1px),"
        + "linear-gradient(90deg, #0d0d0d10 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.4, pointerEvents: "none",
      }} />

      {/* トップバー */}
      <header style={{
        position: "relative", zIndex: 2,
        padding: "20px 4px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'DM Mono', 'SF Mono', monospace",
        fontSize: 11, letterSpacing: "0.12em",
        color: "#6B6860",
      }}>
        <div>
          <span style={{ color: ink, fontWeight: 700 }}>VIGIL</span>
          <span style={{ color: accent }}>.</span>
          <span style={{ marginLeft: 12, color: "#8A857A" }}>auth-gateway · v2.5.0</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{
            color: lime, background: ink,
            padding: "3px 10px", letterSpacing: "0.18em", fontSize: 10,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "#5CFF8C", animation: "pulse 1.8s infinite",
            }} /> NEURAL ONLINE
          </span>
          <span>{clock}</span>
        </div>
      </header>

      <div style={{
        position: "relative", zIndex: 2,
        display: "grid", gridTemplateColumns: "1.05fr 1fr",
        gap: 64, maxWidth: 1180, margin: "32px auto",
        alignItems: "stretch",
      }} className="login-grid">
        {/* 左：ブートログ */}
        <section style={{
          background: ink, color: "#E9E9E5",
          padding: "32px 28px",
          fontFamily: "'DM Mono', 'SF Mono', monospace",
          fontSize: 12.5, lineHeight: 1.85, letterSpacing: "0.01em",
          borderRadius: 4, minHeight: 520,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em", color: "#8A857A",
            textTransform: "uppercase", marginBottom: 18,
          }}>
            // boot sequence — local agent
          </div>
          <div style={{ flex: 1 }}>
            {BOOT_LINES.slice(0, bootIdx).map((line, i) => {
              const tag = line.match(/^\[(\w+)\]/)?.[1] || "";
              const tagColor: Record<string, string> = {
                init: "#8AB4FF", net: "#5CFF8C", brain: "#FFB37A",
                ai: "#FF9DD0", reg: "#C9A84C", auth: accent,
              };
              const rest = line.replace(/^\[\w+\]\s*/, "");
              return (
                <div key={i} style={{ marginBottom: 4, opacity: 0, animation: `fadein .4s forwards` }}>
                  <span style={{ color: tagColor[tag] || "#8A857A" }}>[{tag}]</span>
                  <span style={{ color: "#E9E9E5", marginLeft: 8 }}>{rest}</span>
                </div>
              );
            })}
            {bootIdx >= BOOT_LINES.length && stage === "idle" && (
              <div style={{ marginTop: 14, color: accent }}>
                $ awaiting passphrase
                <span style={{ animation: "blink 1s infinite" }}>▊</span>
              </div>
            )}
            {stage === "auth" && (
              <div style={{ marginTop: 14, color: "#FFB37A" }}>
                [auth] authenticating against neural vault…
              </div>
            )}
            {stage === "ok" && (
              <div style={{ marginTop: 14, color: "#5CFF8C" }}>
                [auth] ✓ principal verified — granting session (30d)
              </div>
            )}
          </div>
          <div style={{
            borderTop: "1px solid #2a2a2a",
            paddingTop: 14, marginTop: 18,
            fontSize: 10, color: "#6B6860",
            display: "flex", justifyContent: "space-between",
          }}>
            <span>region: tokyo-aqua · sandbox</span>
            <span>cipher: ed25519/cookie</span>
          </div>
        </section>

        {/* 右：認証フォーム */}
        <section style={{
          background: "#fff",
          padding: "44px 40px",
          border: "1px solid rgba(13,13,13,0.12)",
          borderRadius: 4,
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.22em", color: "#8A857A",
            textTransform: "uppercase",
          }}>
            <span style={{ width: 22, height: 1, background: accent }} />
            Restricted Cortex · 山中 only
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', 'Frank Ruhl Libre', serif",
            fontSize: 48, fontWeight: 900, lineHeight: 1.02,
            letterSpacing: "-0.02em", marginBottom: 12,
          }}>
            Enter the<br/>
            <em style={{ fontStyle: "italic", color: accent }}>Neural</em> Vault
          </h1>
          <p style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 13, color: "#5A554D", lineHeight: 1.75,
            marginBottom: 28, maxWidth: 380,
          }}>
            6社マルチハットの全プロダクトと、Vigil 脳の中枢へ。<br/>
            ここから先は山中の領域。
          </p>

          <form onSubmit={onSubmit}>
            <label style={{
              display: "block",
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: "0.2em", color: "#6B6860",
              marginBottom: 8, textTransform: "uppercase",
            }}>passphrase</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                fontFamily: "'DM Mono', monospace", fontSize: 14, color: accent,
              }}>$</span>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="•••••••••••••"
                autoFocus
                disabled={stage === "auth" || stage === "ok"}
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 34px",
                  fontSize: 15,
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.1em",
                  border: "1px solid rgba(13,13,13,0.2)",
                  borderRadius: 3,
                  background: "#FAFAF8",
                  outline: "none",
                }}
              />
            </div>
            {error && (
              <div style={{
                color: "#C0392B", fontSize: 12, marginTop: 12,
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
              }}>
                ✗ {error}
              </div>
            )}
            <button
              type="submit"
              disabled={!pw || stage !== "idle"}
              style={{
                marginTop: 22,
                width: "100%",
                padding: "14px 18px",
                background: stage === "ok" ? lime : ink,
                color: "#fff",
                border: "none",
                borderRadius: 3,
                fontSize: 12,
                letterSpacing: "0.2em",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                cursor: !pw || stage !== "idle" ? "not-allowed" : "pointer",
                opacity: !pw ? 0.35 : 1,
                transition: "background 0.2s",
              }}
            >
              {stage === "idle" && "▶ authenticate"}
              {stage === "auth" && "··· processing ···"}
              {stage === "ok" && "✓ access granted"}
            </button>
          </form>

          <div style={{
            marginTop: 28, paddingTop: 22,
            borderTop: "1px solid rgba(13,13,13,0.08)",
            display: "flex", justifyContent: "space-between",
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.1em", color: "#8A857A",
          }}>
            <span>session: 30d cookie</span>
            <span>fallback: <span style={{ color: ink }}>/api/login</span></span>
          </div>
        </section>
      </div>

      <footer style={{
        position: "relative", zIndex: 2,
        textAlign: "center", padding: "40px 0 24px",
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        letterSpacing: "0.2em", color: "#8A857A",
      }}>
        © 2026 · vigil-by-lakkan · operated by claude-code + gemma + gemini
      </footer>

      <style>{`
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes fadein { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @media (max-width: 880px) {
          .login-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
