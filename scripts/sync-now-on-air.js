#!/usr/bin/env node
/**
 * Now On AIr (https://nowonair.vercel.app/) のhealth.jsonから最新号を特定し、
 * 公開記事JSONを public/now-on-air/index.json に同期する。
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
      .setTimeout(15000, function () { this.destroy(new Error("News fetch timed out")); })
      .on("error", reject);
  });
}

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const health = JSON.parse(await fetchUrl(new URL("health.json", NOWONAIR)));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(health.latest_issue)) throw new Error("Invalid issue date");
    const date = health.latest_issue;
    const raw = JSON.parse(await fetchUrl(new URL("news/" + date + "/articles.json", NOWONAIR)));
    const articles = raw.map((a, i) => ({
      id: date + "-" + (i + 1), title: a.title, category: a.category, source: a.source,
      lede: a.lede, keypoints: a.keypoints || [], pull: a.pull || "",
      bizapp: a.bizapp || null, quickstart: a.quickstart || null,
      link: new URL("news/" + date + "/#topic-" + (i + 1), NOWONAIR).toString(),
      image: ["research", "infrastructure"].includes(a.image) ? new URL("assets/newspaper/" + a.image + ".png", NOWONAIR).toString() : "",
      publishedAt: a.published_at || date,
    }));
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
