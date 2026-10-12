import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const source = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const nav = source.match(/<nav className="poster-nav"[\s\S]*?<\/nav>/)?.[0];
assert.match(nav ?? "", /href="\/racco"[^>]*>Racco<\/Link>/, "Racco is directly available in the main navigation");
assert.match(source, /<Link href="\/racco" className="home-racco-link" aria-labelledby="home-racco-title home-racco-cta">/, "the entire character card is one named link");
assert.ok(source.indexOf('id="home-racco"') < source.indexOf('id="people"'), "the card appears before the long company introduction");
assert.match(source, /id="home-racco-cta">Raccoの世界へ/);
assert.ok(existsSync(new URL("../public/brand-book/racco-scenes/welcoming.png", import.meta.url)));
assert.ok(!source.includes('href="/racco#'), "the entrance should not skip the Racco introduction");
console.log("PASS homepage Racco: navigation, named full-card link, above-content placement, asset and destination");
