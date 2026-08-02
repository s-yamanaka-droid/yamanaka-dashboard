#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Now On AIr (https://nowonair.vercel.app/) のトップHTMLを取得し、
 * data-* 属性からカードをパースして public/now-on-air.json に保存する。
 *
 * 実行: node scripts/sync-now-on-air.js
 * 失敗してもビルドは止めない（exit 0）。
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const NOWONAIR = "https://nowonair.vercel.app/";
const OUT_DIR = path.resolve(__dirname, "../public/now-on-air");
const OUT_FILE = path.join(OUT_DIR, "index.json");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function decodeHtml(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

function attr(card, name) {
  const m = card.match(new RegExp(`${name}="([^"]*)"`));
  return m ? decodeHtml(m[1]) : null;
}

function jsonAttr(card, name) {
  const raw = attr(card, name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseArticles(html) {
  const re = /<div\s+class="[^"]*(?:ig-featured|ig-card)[^"]*"[^>]*?data-title="[^>]*?>/g;
  const matches = html.match(re) || [];
  const articles = [];
  for (const card of matches) {
    const title = attr(card, "data-title");
    const link = attr(card, "data-link");
    if (!title || !link) continue;
    const fullLink = link.startsWith("./") ? new URL(link.slice(2), NOWONAIR).toString() : link;
    const slide = attr(card, "data-slide") || attr(card, "data-src");
    const image = slide && slide.startsWith("./") ? new URL(slide.slice(2), NOWONAIR).toString() : slide;
    articles.push({
      id: link.replace(/^\.\//, "").replace(/[^\w\-]/g, "_"),
      title,
      category: attr(card, "data-category"),
      source: attr(card, "data-source"),
      lede: attr(card, "data-lede"),
      keypoints: jsonAttr(card, "data-keypoints"),
      pull: attr(card, "data-pull"),
      bizapp: jsonAttr(card, "data-bizapp"),
      quickstart: jsonAttr(card, "data-quickstart"),
      link: fullLink,
      image,
      publishedAt: attr(card, "data-date") || null,
    });
  }
  return articles;
}

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const html = await fetchUrl(NOWONAIR);
    const articles = parseArticles(html);
    if (articles.length === 0) {
      console.warn("[now-on-air] 0 articles parsed — check page structure");
      process.exit(0);
    }
    const payload = { generatedAt: new Date().toISOString(), total: articles.length, source: NOWONAIR, articles };
    fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2));
    console.log(`[now-on-air] wrote ${articles.length} articles → ${OUT_FILE}`);
  } catch (e) {
    console.warn(`[now-on-air] sync failed (continue build): ${e.message}`);
    process.exit(0);
  }
})();
