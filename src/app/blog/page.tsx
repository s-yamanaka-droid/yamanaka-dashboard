"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FRANK = "var(--font-frank), 'Frank Ruhl Libre', Georgia, serif";
const SANS  = "var(--font-display), 'Space Grotesk', system-ui, sans-serif";

// WordPress REST API endpoint — set your WP site here
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "";

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    "wp:term"?: { name: string; taxonomy: string }[][];
  };
};

const HR = () => <div style={{ height: 1, background: "#0D0D0D", opacity: 0.1 }} />;

const fmtDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim();

export default function BlogPage() {
  const [posts, setPosts]   = useState<WPPost[]>([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(false);
  const [updated, setUpdated] = useState("");

  const fetchPosts = async () => {
    if (!WP_URL) { setLoad(false); return; }
    try {
      const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/posts?per_page=20&_embed&orderby=date&order=desc`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) { setError(true); setLoad(false); return; }
      const data: WPPost[] = await res.json();
      setPosts(data);
      setUpdated(new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setError(true);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const iv = setInterval(fetchPosts, 300_000); // 5分ごと
    return () => clearInterval(iv);
  }, []);

  const noWP = !WP_URL;

  return (
    <div style={{ background: "#F7F4EE", minHeight: "100vh", color: "#0D0D0D" }}>

      {/* ── Nav ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(247,244,238,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(13,13,13,0.1)", padding: "0 56px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <Link href="/" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700,
            color: "#0D0D0D", textDecoration: "none", letterSpacing: "0.05em" }}>YAMANAKA SHUTO</Link>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[["Works", "/#works"], ["Skills", "/skills"], ["Lab", "/lab"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500,
                color: "#0D0D0D", textDecoration: "none", opacity: 0.55 }}>{l}</Link>
            ))}
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "#0D0D0D" }}>Blog</span>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding: "120px 56px 64px", borderBottom: "1px solid rgba(13,13,13,0.12)",
        position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -16, right: 40, fontFamily: FRANK,
          fontSize: "clamp(120px,18vw,240px)", fontWeight: 400, color: "transparent",
          WebkitTextStroke: "1px rgba(13,13,13,0.06)", lineHeight: 1, pointerEvents: "none",
          letterSpacing: "-0.03em", userSelect: "none" }}>
          writing/
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em",
            color: "#0D0D0D", opacity: 0.4, marginBottom: 20 }}>
            {updated ? `LAST SYNC — ${updated}` : "WRITING & THINKING"}
          </div>

          <div style={{ fontFamily: FRANK, fontSize: "clamp(56px,9vw,128px)", fontWeight: 400,
            lineHeight: 0.88, letterSpacing: "-0.02em", color: "#0D0D0D", marginBottom: 40 }}>
            Blog<br />
            <span style={{ opacity: 0.28 }}>& Notes</span>
          </div>

          <HR />

          <div style={{ display: "flex", gap: 56, marginTop: 28, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: FRANK, fontSize: "clamp(32px,5vw,56px)", fontWeight: 400, color: "#0D0D0D" }}>
                {posts.length || "—"}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: "0.2em", color: "#0D0D0D", opacity: 0.38, marginTop: 6 }}>POSTS</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "0 56px 120px" }}>
        <div style={{ marginTop: 56 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em",
            color: "#0D0D0D", opacity: 0.35, marginBottom: 24 }}>LATEST POSTS</div>
          <HR />

          {/* WordPress not connected */}
          {noWP && (
            <div style={{ padding: "64px 0" }}>
              <div style={{ fontFamily: FRANK, fontSize: 28, color: "#0D0D0D", opacity: 0.5, marginBottom: 16 }}>
                WordPress接続待ち
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: "#0D0D0D", opacity: 0.45, lineHeight: 1.8, maxWidth: 520 }}>
                WordPress.comまたはWordPress.orgのサイトを作成後、<br />
                環境変数 <code style={{ background: "rgba(13,13,13,0.08)", padding: "2px 6px", borderRadius: 2 }}>NEXT_PUBLIC_WP_URL</code> にサイトURLを設定することで自動連携されます。<br /><br />
                例: <code style={{ background: "rgba(13,13,13,0.08)", padding: "2px 6px", borderRadius: 2 }}>NEXT_PUBLIC_WP_URL=https://yamanaka.wordpress.com</code>
              </div>
              <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
                <a href="https://wordpress.com/start" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D", opacity: 0.55,
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                    border: "1px solid rgba(13,13,13,0.2)", padding: "8px 16px" }}>
                  WordPress.comを開く <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          )}

          {/* Loading */}
          {!noWP && loading && (
            <div style={{ padding: "48px 0", fontFamily: SANS, fontSize: 13, color: "#0D0D0D", opacity: 0.3 }}>
              記事を読み込み中...
            </div>
          )}

          {/* Error */}
          {!noWP && error && !loading && (
            <div style={{ padding: "48px 0", fontFamily: SANS, fontSize: 13, color: "#E8694A", opacity: 0.7 }}>
              WordPress APIへの接続に失敗しました。URLを確認してください。
            </div>
          )}

          {/* Posts list */}
          {posts.map((post, i) => {
            const terms = post._embedded?.["wp:term"]?.flat() ?? [];
            const catNames = terms.filter(t => t.taxonomy === "category").map(t => t.name).filter(n => n !== "Uncategorized");
            const excerpt = stripHtml(post.excerpt.rendered).slice(0, 120);

            return (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                style={{ borderBottom: "1px solid rgba(13,13,13,0.07)" }}>
                <a href={post.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px",
                    gap: 24, padding: "24px 0", textDecoration: "none",
                    color: "#0D0D0D", alignItems: "start" }}>

                  {/* Date */}
                  <div style={{ fontFamily: SANS, fontSize: 10, color: "#0D0D0D",
                    opacity: 0.38, letterSpacing: "0.05em", paddingTop: 3 }}>
                    {fmtDate(post.date)}
                  </div>

                  {/* Title + excerpt */}
                  <div>
                    <div style={{ fontFamily: FRANK, fontSize: 20, fontWeight: 400,
                      color: "#0D0D0D", marginBottom: 8, lineHeight: 1.3 }}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    {excerpt && (
                      <div style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D",
                        opacity: 0.5, lineHeight: 1.6 }}>{excerpt}...</div>
                    )}
                    {catNames.length > 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                        {catNames.map(n => (
                          <span key={n} style={{ fontFamily: SANS, fontSize: 9,
                            letterSpacing: "0.1em", color: "#0D0D0D",
                            border: "1px solid rgba(13,13,13,0.2)", borderRadius: 2,
                            padding: "2px 7px", opacity: 0.6 }}>{n}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 3 }}>
                    <span style={{ fontFamily: SANS, fontSize: 10, color: "#0D0D0D",
                      opacity: 0.3, display: "flex", alignItems: "center", gap: 2 }}>
                      Read <ArrowUpRight size={9} />
                    </span>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 80 }}>
          <HR />
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", paddingTop: 20 }}>
            <span style={{ fontFamily: FRANK, fontSize: 13, color: "#0D0D0D", opacity: 0.32 }}>
              (powered by WordPress REST API)
            </span>
            <Link href="/" style={{ fontFamily: SANS, fontSize: 12, color: "#0D0D0D",
              opacity: 0.45, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
