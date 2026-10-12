import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

// HTTP-only: use an existing server; never start a browser or a server here.
const base = new URL(process.env.SMOKE_BASE_URL || "http://127.0.0.1:3118");
const site = "https://lakkan-inc.vercel.app";
const share = "/brand/browser/lakkan-racco-share-v1.png";
const originalFaviconSha256 = "2b8ad2d33455a8f736fc3a8ebf8f0bdea8848ad4c0db48a2833bd0f9cd775932";
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, entity => ({
  "&amp;": "&", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">",
})[entity]);
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([raw]) =>
  Object.fromEntries([...raw.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, key, double, single]) => [key.toLowerCase(), decode(double ?? single)])));
const pages = new Map();
const checkedShareUrls = new Set();

async function get(path) {
  const url = new URL(path, base);
  assert.equal(url.origin, base.origin, "HTTP checks must stay on the configured local server");
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "error" });
  assert.equal(response.status, 200, `${path}: HTTP status`);
  return response;
}
async function page(path) {
  if (!pages.has(path)) {
    const html = await (await get(path)).text();
    pages.set(path, { html, meta: tags(html, "meta"), links: tags(html, "link") });
  }
  return pages.get(path);
}
function meta(document, name) {
  const values = document.meta.filter(tag => tag.property === name || tag.name === name).map(tag => tag.content);
  assert.equal(values.length, 1, `${name}: expected one metadata value, got ${JSON.stringify(values)}`);
  return values[0];
}
function canonical(document, path) {
  assert.deepEqual(document.links.filter(tag => tag.rel === "canonical").map(tag => tag.href), [site + path], `${path}: self canonical`);
}
function robots(document, index, follow) {
  const values = meta(document, "robots").split(",").map(value => value.trim());
  assert(values.includes(index ? "index" : "noindex"), "robots index policy changed");
  assert(values.includes(follow ? "follow" : "nofollow"), "robots follow policy changed");
  assert(!values.includes(index ? "noindex" : "index"), "conflicting index policy");
  assert(!values.includes(follow ? "nofollow" : "follow"), "conflicting follow policy");
}
function imageMetadata(document, path) {
  for (const name of ["og:image", "twitter:image"]) {
    assert.equal(meta(document, name), site + path, `${name}: absolute branded/own image URL`);
  }
  assert.equal(meta(document, "twitter:card"), "summary_large_image");
}
async function sharedImageMetadata(document) {
  const og = new URL(meta(document, "og:image"));
  assert.equal(og.origin, site, "og:image: absolute production URL");
  assert([share, "/opengraph-image"].includes(og.pathname), "og:image: common PNG or compatible file-based route");
  assert.equal(og.hash, "", "og:image: no fragment");
  const localPath = og.pathname + og.search;
  if (!checkedShareUrls.has(localPath)) {
    // Preserve the hash query, but never fetch the advertised production origin.
    const response = await get(localPath);
    assert.match(response.headers.get("content-type") || "", /^image\/png\b/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(bytes, await readFile(new URL(`../public${share}`, import.meta.url)), `${localPath}: exact common PNG bytes`);
    checkedShareUrls.add(localPath);
  }
  assert.equal(meta(document, "twitter:image"), site + share, "twitter:image: absolute static common PNG URL");
  assert.equal(meta(document, "twitter:card"), "summary_large_image");
}
async function png(path, width, height) {
  // Request the local path, not the production URL advertised in metadata.
  const response = await get(path);
  assert.match(response.headers.get("content-type") || "", /^image\/png\b/);
  const bytes = Buffer.from(await response.arrayBuffer());
  const info = await sharp(bytes).metadata();
  assert.equal(info.format, "png", `${path}: PNG format`);
  assert.equal(info.width, width, `${path}: width`);
  assert.equal(info.height, height, `${path}: height`);
  assert.deepEqual(bytes, await readFile(new URL(`../public${path}`, import.meta.url)), `${path}: served bytes match workspace`);
}
function icons(document, brand, path) {
  const icon = `/brand/browser/${brand}-icon-v1.png`;
  const apple = `/brand/browser/${brand}-apple-v1.png`;
  const pathname = href => new URL(href, base).pathname;
  for (const [rel, expected] of [["icon", icon], ["shortcut icon", icon], ["apple-touch-icon", apple]]) {
    const links = document.links.filter(tag => tag.rel === rel);
    assert(links.some(tag => pathname(tag.href) === expected), `${path}: missing ${brand} ${rel}`);
    assert(!links.some(tag => /\/brand\/browser\//.test(pathname(tag.href)) && pathname(tag.href) !== expected), `${path}: mixed brand ${rel}`);
  }
}

for (const path of ["/", "/about", "/services", "/contact", "/privacy", "/concept"]) {
  icons(await page(path), "lakkan", path);
}
for (const path of ["/", "/contact", "/racco", "/racco/contact", "/racco/studio"]) {
  await sharedImageMetadata(await page(path));
}
for (const [path, index, follow] of [["/racco", true, true], ["/racco/contact", false, true], ["/racco/studio", false, false]]) {
  const document = await page(path);
  icons(document, "racco", path);
  canonical(document, path);
  robots(document, index, follow);
}

// Independent fixtures protect article/product-specific metadata from layout inheritance.
const articles = [
  ["from-bookmark-to-work", "AIのすごい投稿、保存したままになってない？", "/brand-book/racco-self-morning.png"],
  ["make-it-sound-like-you", "その文章、俺はそんな言い方しない。", "/brand-book/racco-self-cafe.png"],
  ["draft-before-automation", "いきなり自動化しない。まず、下書きだけ。", "/brand-book/racco-trio.png"],
];
const goods = [
  ["glasses-sticker", "いつものRacco ステッカー", "/brand-book/racco-self-sticker.png"],
  ["holo-sticker", "だるい天才 ホロシール", "/brand-book/racco-sticker-lazy-genius.png"],
];
for (const [kind, fixtures] of [["columns", articles], ["goods", goods]]) {
  for (const [slug, title, ownImage] of fixtures) {
    const path = `/racco/${kind}/${slug}`;
    const document = await page(path);
    icons(document, "racco", path);
    canonical(document, path);
    robots(document, kind === "columns", kind === "columns");
    imageMetadata(document, ownImage);
    assert.equal(meta(document, "og:type"), kind === "columns" ? "article" : "website");
    assert(meta(document, "og:title").includes(title), `${path}: article/product title retained`);
    const headings = [...document.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map(([, heading]) => decode(heading.replace(/<[^>]*>/g, "")));
    assert(headings.includes(title), `${path}: visible heading retained`);
  }
}

const sentinelQuery = "message=BROWSER_BRAND_QUERY_SENTINEL&name=BROWSER_BRAND_QUERY_SENTINEL";
const raccoQuery = `?source=racco-column&article=from-bookmark-to-work&intent=ai&${sentinelQuery}`;
function queryIndependentMetadata(plain, contextual, path) {
  const shareTags = document => document.meta.filter(tag => /^(og:|twitter:)/.test(tag.property || tag.name || ""));
  assert.deepEqual(shareTags(contextual), shareTags(plain), `${path}: query must not change share metadata`);
  assert(!JSON.stringify(shareTags(contextual)).includes("BROWSER_BRAND_QUERY_SENTINEL"), `${path}: query value leak`);
  assert.deepEqual(contextual.links.filter(tag => tag.rel === "canonical"), plain.links.filter(tag => tag.rel === "canonical"), `${path}: query must not change canonical`);
}
for (const [path, query] of [["/contact", `?topic=luna&${sentinelQuery}`], ["/racco/contact", raccoQuery]]) {
  const plain = await page(path);
  const contextual = await page(path + query);
  queryIndependentMetadata(plain, contextual, path);
  if (path === "/racco/contact") canonical(contextual, path);
}
// Legacy Racco inquiries deliberately migrate out of the corporate form.
// Inspect the redirect before following it, so no external origin is fetched.
const migration = await fetch(new URL("/contact" + raccoQuery, base), {
  signal: AbortSignal.timeout(15000), redirect: "manual",
});
assert.equal(migration.status, 307, "legacy Racco contact: temporary redirect");
const location = migration.headers.get("location");
assert(location, "legacy Racco contact: redirect Location is present");
const destination = new URL(location, base);
assert.equal(destination.origin, base.origin, "legacy Racco contact: local redirect only");
assert.equal(destination.href, new URL("/racco/contact?source=racco-column&intent=ai&article=from-bookmark-to-work#main", base).href, "legacy Racco contact: validated context and main anchor retained");
const redirectedContact = await page(destination.pathname + destination.search);
queryIndependentMetadata(await page("/racco/contact"), redirectedContact, "legacy Racco contact destination");
canonical(redirectedContact, "/racco/contact");

await png(share, 1200, 630);
for (const brand of ["lakkan", "racco"]) {
  await png(`/brand/browser/${brand}-icon-v1.png`, 256, 256);
  await png(`/brand/browser/${brand}-apple-v1.png`, 180, 180);
}
const favicon = Buffer.from(await (await get("/favicon.ico")).arrayBuffer());
assert(favicon.length >= 22, "favicon: ICO directory present");
assert.equal(favicon.readUInt16LE(0), 0, "favicon: reserved ICO header");
assert.equal(favicon.readUInt16LE(2), 1, "favicon: ICO type");
assert(favicon.readUInt16LE(4) > 0, "favicon: at least one image");
assert.notEqual(createHash("sha256").update(favicon).digest("hex"), originalFaviconSha256, "favicon: original Next icon must be replaced");
assert.deepEqual(favicon, await readFile(new URL("../src/app/favicon.ico", import.meta.url)), "favicon: served bytes match workspace");
console.log(`PASS browser-brand HTTP contracts (${pages.size} pages, 5 PNGs, favicon). Visual appearance and client navigation are not evaluated.`);
