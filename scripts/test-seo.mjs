import assert from "node:assert/strict";

const base = process.env.SEO_BASE_URL || "http://127.0.0.1:3126";
const origin = "https://lakkan-inc.vercel.app";
const decode = s => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"');
function tags(html, tag, key, value, attribute) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))]
    .map(m => Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])])) )
    .filter(t => t[key] === value).map(t => t[attribute]);
}
function graphs(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap(m => { const j = JSON.parse(m[1]); return j["@graph"] || [j]; });
}
const failures = [];
async function check(label, run) {
  try { await run(); console.log("PASS", label); }
  catch (error) { failures.push(label); console.error("FAIL", label, error.message); }
}
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
await check("sitemap: unique public URLs and source-backed dates", () => {
  assert.equal(new Set(urls).size, urls.length, "sitemap must not repeat URLs");
  assert.ok(urls.every(url => url.startsWith(origin + "/")));
  assert.ok(!urls.some(url => /\/racco\/(studio|goods|contact)|\/brand-book|\/concept/.test(url)));
});
const pages = new Map();
for (const url of urls) {
  const path = new URL(url).pathname;
  const response = await fetch(`${base}${path}`);
  const html = await response.text(); pages.set(path, html);
  await check(`search/share identity ${path}`, () => {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.deepEqual(tags(html, "link", "rel", "canonical", "href").map(value => new URL(value).href), [new URL(url).href]);
    assert.deepEqual(tags(html, "meta", "property", "og:url", "content").map(value => new URL(value).href), [new URL(url).href]);
    assert.ok(tags(html,"meta","name","description","content")[0]?.length > 15);
    assert.ok(tags(html,"meta","name","twitter:description","content")[0]?.length > 15);
    assert.ok(tags(html,"meta","property","og:image","content")[0]?.startsWith("https://"));
    assert.ok(!tags(html,"meta","name","robots","content").join().includes("noindex"));
  });
}
await check("corporate and representative entities match public facts", () => {
  const entities = graphs(pages.get("/"));
  const org = entities.find(x => x["@type"] === "Organization");
  const website = entities.find(x => x["@type"] === "WebSite");
  const person = entities.find(x => x["@type"] === "Person");
  assert.equal(org.legalName, "株式会社Lakkan");
  assert.equal(website.name, "Lakkan");
  assert.ok(website.alternateName.includes("ラッカン"));
  assert.equal(person.name, "山中秀斗");
  assert.equal(person.jobTitle, "代表取締役");
  assert.equal(person.worksFor["@id"], org["@id"]);
  assert.ok(pages.get("/about").includes(person.name));
});
await check("all four services are HTML text before JavaScript runs", () => {
  const html = pages.get("/services");
  const content = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  for (const id of ["ai-operations", "crm", "digital", "people"]) {
    assert.ok(content.includes(`id="service-panel-${id}"`), `${id} needs an SSR panel`);
    assert.ok(content.includes(`aria-controls="service-panel-${id}"`));
  }
  assert.ok(content.includes("人材紹介について相談する"));
  assert.ok(content.includes("SNSマーケティング"));
  const catalog = graphs(html).find(x => x["@type"] === "ItemList");
  assert.equal(catalog.itemListElement.length, 4);
  assert.ok(catalog.itemListElement.every(x => x.item.provider["@id"] === `${origin}/#org`));
});
await check("Lakkan partner and LunaTech product-provider links", () => {
  const about = pages.get("/about");
  assert.ok(about.includes("LunaTech 認定パートナー"));
  assert.ok(about.includes('href="https://ai.lunatech-inc.com/luna-ai/"'));
  assert.ok(about.includes('href="https://call.lunatech-inc.com/"'));
  assert.ok(about.includes("提供元：株式会社LunaTech"));
});
await check("canonical removes inquiry tracking parameters", async () => {
  const html = await (await fetch(`${base}/contact?topic=placement`)).text();
  assert.deepEqual(tags(html,"link","rel","canonical","href"), [`${origin}/contact`]);
});
for (const path of ["/concept", "/brand-book", "/brand-guide", "/racco/studio", "/racco/contact"]) {
  await check(`private production materials retain noindex ${path}`, async () => {
    const html = await (await fetch(base + path)).text();
    assert.ok(tags(html,"meta","name","robots","content").join().includes("noindex"));
  });
}
await check("Google verification file remains reachable", async () => {
  const response = await fetch(`${base}/google04a8441484888ee2.html`);
  assert.equal(response.status, 200);
  assert.equal((await response.text()).trim(), "google-site-verification: google04a8441484888ee2.html");
});
assert.equal(failures.length, 0, `SEO regressions: ${failures.join(", ")}`);
