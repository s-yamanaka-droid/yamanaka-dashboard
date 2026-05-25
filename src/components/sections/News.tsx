"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FRANK, INSTRUMENT, SANS, EASE, ACCENT } from "@/lib/design-tokens";

type Article = {
  id: string;
  title: string;
  category: string | null;
  source: string | null;
  lede: string | null;
  link: string;
  image: string | null;
  publishedAt?: string | null;
};
type Payload = {
  generatedAt: string;
  total: number;
  source: string;
  articles: Article[];
};

const CAT_COLOR: Record<string, string> = {
  業界動向: ACCENT.vermillion,
  新モデル発表: ACCENT.blue,
  ツール更新: "#3A8C5C",
  研究: "#7C3AED",
  投資: ACCENT.orange,
  ポリシー: "#B07D00",
};
const colorFor = (c: string | null) => (c && CAT_COLOR[c]) || "#6B6860";

export function News() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/now-on-air/index.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Payload) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const articles = data?.articles?.slice(0, 6) || [];

  return (
    <section
      id="news"
      style={{
        background: "#F5F3EE",
        padding: "96px 56px",
        borderTop: "1px solid rgba(13,13,13,0.08)",
        borderBottom: "1px solid rgba(13,13,13,0.08)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header row */}
        <div
          data-mobile-stack="news-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                letterSpacing: "0.22em",
                color: ACCENT.vermillion,
                textTransform: "uppercase",
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: ACCENT.vermillion,
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "pulse 1.6s ease-in-out infinite",
                }}
              />
              Now On Air · Live
            </div>
            <h2
              style={{
                fontFamily: INSTRUMENT,
                fontSize: "clamp(44px,7vw,104px)",
                fontWeight: 400,
                lineHeight: 0.96,
                color: "#0D0D0D",
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              AI Morning <em style={{ fontStyle: "italic" }}>Dispatch.</em>
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 11,
                color: "#6B6860",
                letterSpacing: "0.14em",
                marginBottom: 8,
              }}
            >
              {data && (
                <>
                  {data.total} STORIES · UPDATED{" "}
                  {new Date(data.generatedAt).toLocaleString("ja-JP", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
            </div>
            <a
              href="https://s-yamanaka-droid.github.io/nowonair/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 600,
                color: ACCENT.vermillion,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                letterSpacing: "0.06em",
              }}
            >
              FULL ARCHIVE <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Subhead */}
        <p
          style={{
            fontFamily: FRANK,
            fontSize: 17,
            fontWeight: 300,
            color: "#5A554D",
            lineHeight: 1.7,
            maxWidth: 640,
            margin: "0 0 56px",
            fontStyle: "italic",
          }}
        >
          山中秀斗が毎朝整理するAI業界のモーニングディスパッチ。
          <br />
          ビジネスに使える視点と、明日からできるアクションを。
        </p>

        {/* Articles grid */}
        {loading && (
          <div style={{ fontFamily: SANS, color: "#6B6860" }}>Loading…</div>
        )}
        {!loading && articles.length === 0 && (
          <div style={{ fontFamily: SANS, color: "#6B6860" }}>
            ニュースが取得できませんでした。
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 0,
            borderTop: "1px solid rgba(13,13,13,0.08)",
          }}
        >
          {articles.map((a, i) => (
            <motion.a
              key={a.id}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              style={{
                display: "block",
                padding: "32px 32px 32px 0",
                paddingLeft: i % 3 === 0 ? 0 : 32,
                borderBottom: "1px solid rgba(13,13,13,0.08)",
                borderRight:
                  (i + 1) % 3 !== 0 ? "1px solid rgba(13,13,13,0.08)" : "none",
                textDecoration: "none",
                color: "#0D0D0D",
                position: "relative",
              }}
              className="news-card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: colorFor(a.category),
                  }}
                />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: colorFor(a.category),
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {a.category || "News"}
                </span>
                {a.source && (
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      color: "#B0ADA6",
                      marginLeft: "auto",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {a.source}
                  </span>
                )}
              </div>
              <h3
                style={{
                  fontFamily: INSTRUMENT,
                  fontSize: 22,
                  fontWeight: 400,
                  lineHeight: 1.32,
                  margin: "0 0 14px",
                  letterSpacing: "-0.005em",
                  color: "#0D0D0D",
                }}
              >
                {a.title}
              </h3>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: "#5A554D",
                  lineHeight: 1.65,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {a.lede}
              </p>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  color: ACCENT.vermillion,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                READ <ArrowUpRight size={11} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        .news-card:hover h3 {
          color: ${ACCENT.vermillion};
        }
      `}</style>
    </section>
  );
}
