import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url),'utf8'));
const server = process.env.SMOKE_BASE_URL ? null : spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", "3118"], { stdio: "ignore" });
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3118";
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(base + "/api/health")).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, "health endpoint is ready");
  for (const path of ["/", "/works", ...projects.map(p=>`/works/${p.id}`), "/services", "/about", "/contact?topic=luna", "/atelier", "/changelog", "/privacy"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, path + " has one main");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + " has one heading");
    if (path === "/") {
      assert.ok(html.includes('brand-hero') && html.includes('lakkan-orange-settled.jpg') && html.includes('water-assembly-film') && html.includes('site-header') && html.includes('<footer'), "Lakkan Blender assembly with static fallback and shared navigation");
      assert.ok(html.includes('/works/luna-ai') && html.includes('lunatech-current.jpg'), "LunaTech detail link and current cover");
      for (const id of ['central-medical','luna-ai','plime-recruit']) assert.ok(html.includes(`/works/${id}`), 'home links to detail: '+id);
      assert.ok(!html.includes('h0wy4l4x9'), "old Luna deployment URL is absent");
      assert.ok(!html.includes('楽観と、計画と。'), "invented brand phrase is absent");
      assert.match(html, /<img[^>]*class="water-sculpture-still"/, "logo image exists independently of WebGL");
    } else {
      assert.ok(html.includes('site-header') && html.includes('site-footer'), path + " shared navigation");
    }
    console.log("PASS", path);
  }
  const film = await fetch(base + "/brand/lakkan-water-horizontal.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(film.status, 206, "film supports byte-range playback");
  assert.ok(film.headers.get("content-type")?.includes("video/mp4"), "film MIME type");
  assert.equal((await fetch(base + "/brand/lakkan-water-horizontal-poster.jpg")).status, 200, "film poster");
  console.log("PASS Blender film range playback and poster");
  for (const asset of ["/brand/lakkan-orange.jpg", "/brand/lakkan-orange-settled.jpg", "/brand/lets-talk-orange.jpg", "/works/lunatech-current.jpg"]) assert.equal((await fetch(base + asset)).status, 200, asset);
  const assembly=await fetch(base+'/brand/lakkan-orange-assembly.mp4',{headers:{Range:'bytes=0-1023'}});
  assert.equal(assembly.status,206,'new Blender assembly supports range requests');
  assert.ok(assembly.headers.get('content-type')?.includes('video/mp4'),'assembly video MIME');
  const contact = await (await fetch(base + "/contact?topic=luna")).text();
  assert.ok(/value="luna" selected=""|selected="" value="luna"/.test(contact), "topic survives server rendering");
  const casePage = await (await fetch(base + '/works/central-medical')).text();
  assert.ok(casePage.includes('/services#digital') && casePage.includes('project=central-medical'), 'case study links to relevant support and contextual inquiry');
  const lunaCase = await (await fetch(base + '/works/luna-ai')).text();
  assert.ok(lunaCase.includes('https://luna-tech-public-site.vercel.app/'), 'case study retains stable public URL');
  const caseContact = await (await fetch(base + '/contact?topic=corp-site&project=central-medical')).text();
  assert.ok(caseContact.includes('Central Medicalの実績を見て相談したいです。'), 'project context reaches editable message');
  assert.ok(/value="corp-site" selected=""|selected="" value="corp-site"/.test(caseContact), 'case topic survives server rendering');
  const unknownContact=await (await fetch(base+'/contact?project=unknown-project')).text();
  assert.ok(!unknownContact.includes('unknown-projectの実績'), 'unknown projects do not enter inquiry text');
  assert.equal((await fetch(base+'/works/unknown-project')).status,404,'unknown case is not published');
  const sitemap=await (await fetch(base+'/sitemap.xml')).text();
  for(const p of projects) assert.ok(sitemap.includes('/works/'+p.id),'case present in sitemap');
  for (const name of ["particles","fluid","terrain","saas","portfolio","restaurant","leadform"]) {
    assert.equal((await fetch(base + "/atelier/" + name)).status, 200, name);
  }
  assert.equal((await fetch(base + "/missing-smoke-page")).status, 404);
  console.log("PASS topic selection, seven demos, 404");
} finally { server?.kill(); }
