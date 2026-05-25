"use client";

import { useEffect, useState } from "react";
import { SANS } from "@/lib/design-tokens";

const SOURCE = `const lakkan = {
  optimism: true,
  planning: true,
  built_with: "Claude Code",
  since: 2026,
};
// → ✓ deployed`;

// Tokens for syntax highlighting (very lightweight, line-based)
const COLOR = {
  keyword: "#7C3AED",
  string:  "#1C3BCC",
  bool:    "#3A8C5C",
  number:  "#B8362E",
  comment: "rgba(13,13,13,0.45)",
  punct:   "rgba(13,13,13,0.7)",
  ident:   "#0D0D0D",
};

function colorFor(token: string): string {
  if (/^\/\//.test(token)) return COLOR.comment;
  if (/^"[^"]*"$/.test(token)) return COLOR.string;
  if (token === "true" || token === "false") return COLOR.bool;
  if (/^\d+$/.test(token)) return COLOR.number;
  if (token === "const" || token === "let" || token === "var") return COLOR.keyword;
  if (/^[{},;:=]$/.test(token)) return COLOR.punct;
  return COLOR.ident;
}

function tokenize(line: string): { text: string; color: string }[] {
  // Whole-line comment
  if (line.trim().startsWith("//")) {
    return [{ text: line, color: COLOR.comment }];
  }
  // Match identifiers, strings, numbers, punct, whitespace
  const re = /("[^"]*")|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|(\d+)|(\s+)|([{},;:=])/g;
  const out: { text: string; color: string }[] = [];
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), color: COLOR.ident });
    out.push({ text: m[0], color: /\s+/.test(m[0]) ? "transparent" : colorFor(m[0]) });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), color: COLOR.ident });
  return out;
}

export function CodeMantra() {
  const lines = SOURCE.split("\n");
  const [shown, setShown] = useState(0); // chars typed
  const total = SOURCE.length;

  useEffect(() => {
    let i = 0;
    let raf: number;
    const speed = 22; // ms per char
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      const advance = Math.max(1, Math.floor(dt / speed));
      i = Math.min(i + advance, total);
      setShown(i);
      last = t;
      if (i < total) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => { i = 0; setShown(0); raf = requestAnimationFrame(tick); }, 3500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // Compute per-line offsets once
  const offsets = lines.reduce<number[]>((acc, l, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + lines[i - 1].length + 1);
    return acc;
  }, []);
  const renderedLines = lines.map((line, idx) => {
    const consumed = offsets[idx];
    const lineEndIdx = consumed + line.length;
    if (shown >= lineEndIdx) return line;
    if (shown <= consumed) return "";
    return line.slice(0, shown - consumed);
  });
  const activeLineIdx = lines.findIndex((line, idx) => {
    const consumed = offsets[idx];
    return shown >= consumed && shown < consumed + line.length + 1;
  });

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(13,13,13,0.18)",
        borderRadius: 8,
        boxShadow: "0 24px 60px -30px rgba(13,13,13,0.35)",
        backdropFilter: "blur(6px)",
        maxWidth: "min(720px, 90vw)",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        borderBottom: "1px solid rgba(13,13,13,0.1)",
        background: "rgba(13,13,13,0.04)",
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F4541A" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#B07D00" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3A8C5C" }} />
        <span style={{
          marginLeft: 12, fontFamily: SANS, fontSize: 11, fontWeight: 600,
          letterSpacing: "0.18em", color: "#0D0D0D", opacity: 0.6, textTransform: "uppercase",
        }}>
          mantra.ts
        </span>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: "20px 22px",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "clamp(13px, 1.2vw, 16px)",
          lineHeight: 1.7,
          color: "#0D0D0D",
          textAlign: "left",
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >
        {renderedLines.map((line, i) => {
          const tokens = tokenize(line);
          const isLast = i === lines.length - 1;
          const isDeployed = isLast && shown >= total;
          return (
            <div
              key={i}
              style={{
                opacity: isLast ? (isDeployed ? 1 : 0) : 1,
                color: isLast ? "#3A8C5C" : "#0D0D0D",
                transition: "opacity 0.6s ease",
                fontWeight: isLast ? 600 : 400,
              }}
            >
              {isLast ? line : tokens.map((tk, j) => (
                <span key={j} style={{ color: tk.color }}>{tk.text}</span>
              ))}
              {/* Cursor at typing position */}
              {!isLast && i === activeLineIdx && (
                <span style={{
                  display: "inline-block", width: 8, height: "1em",
                  background: "#0D0D0D", verticalAlign: "-2px", marginLeft: 1,
                  animation: "lakkan-cursor 1s steps(2) infinite",
                }} />
              )}
            </div>
          );
        })}
      </pre>
      <style>{`@keyframes lakkan-cursor { 50% { opacity: 0 } }`}</style>
    </div>
  );
}
