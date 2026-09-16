import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const server = process.env.SMOKE_BASE_URL ? null : spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", "3118"], { stdio: "ignore" });
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3118";
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base + "/api/health")).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, "health endpoint is ready");
  for (const path of ["/", "/works", "/services", "/about", "/contact?topic=luna", "/atelier", "/changelog", "/privacy"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, path + " has one main");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + " has one heading");
    if (path === "/") {
      assert.ok(html.includes('brand-hero') && html.includes('/brand/possibility.mp4') && html.includes('site-header') && html.includes('<footer'), "Blender film homepage and shared navigation");
    } else {
      assert.ok(html.includes('site-header') && html.includes('site-footer'), path + " shared navigation");
    }
    console.log("PASS", path);
  }
  const film = await fetch(base + "/brand/possibility.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(film.status, 206, "film supports byte-range playback");
  assert.ok(film.headers.get("content-type")?.includes("video/mp4"), "film MIME type");
  assert.equal((await fetch(base + "/brand/possibility-poster.jpg")).status, 200, "film poster");
  console.log("PASS Blender film range playback and poster");
  const contact = await (await fetch(base + "/contact?topic=luna")).text();
  assert.ok(/value="luna" selected=""|selected="" value="luna"/.test(contact), "topic survives server rendering");
  for (const name of ["particles","fluid","terrain","saas","portfolio","restaurant","leadform"]) {
    assert.equal((await fetch(base + "/atelier/" + name)).status, 200, name);
  }
  assert.equal((await fetch(base + "/missing-smoke-page")).status, 404);
  console.log("PASS topic selection, seven demos, 404");
} finally { server?.kill(); }
