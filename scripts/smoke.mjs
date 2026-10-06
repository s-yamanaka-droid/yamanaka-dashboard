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
  assert.equal((await (await fetch(base + '/api/health')).json()).experience, 'cobalt-corporate', 'health identifies the current homepage');
  for (const path of ["/", "/works", ...projects.map(p=>`/works/${p.id}`), "/services", "/about", "/contact?topic=luna", "/atelier", "/changelog", "/privacy"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, path + " has one main");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + " has one heading");
    if (path === "/") {
      const csp=response.headers.get('content-security-policy')||'';
      assert.ok(csp.includes("frame-src 'self' https://luna-tech-public-site.vercel.app"), 'public preview origins permitted by CSP');
      assert.ok(csp.includes("frame-ancestors 'self'"), 'embedding this site remains restricted');
      assert.ok(html.includes('data-home="cobalt"') && !html.includes('factory-shell'), 'home renders the approved corporate direction');
      assert.ok(html.includes('頭はやわらかく。') && html.includes('つくるのは、しっかり。'), 'home has the approved headline');
      for (const label of ['業務改善・AI活用', 'CRM・業務アプリ', 'Webサイト・LP', '採用・人材支援']) assert.ok(html.includes(label), 'home states support: ' + label);
      assert.ok(html.includes('href="/contact#inquiry"') && html.includes('相談をはじめる'), 'home leads directly to the inquiry form');
      assert.ok(!html.includes('luna-management') && !html.includes('luna-receptionist'), 'home does not route visitors directly to unrelated Luna products');
      assert.ok(html.includes('メニューを開く') && html.includes('aria-controls="home-mobile-nav"'), 'home has accessible mobile navigation');
      assert.ok(!html.includes('<iframe') && !html.includes('<video') && !html.includes('<canvas'), 'home does not require media or WebGL to explain the company');
      const homeIds = [...html.matchAll(/data-selected-work="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(homeIds, ['now-on-air', 'luna-ai'], 'home displays only selected work');
      assert.ok(html.includes('自社メディア / Web制作') && html.includes('別ブランドのWeb制作'), 'home identifies the separate brands');
      for (const topic of ['ai-consult','crm','corp-site','placement']) assert.ok(html.includes('/contact?topic=' + topic + '#inquiry'), 'service inquiry preserves topic ' + topic);
      assert.ok(html.includes('フッターナビゲーション') && html.includes('href="/privacy"'), 'home retains company and privacy navigation');
      const ogUrl = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
      assert.ok(ogUrl, 'home exposes a share image');
      const og = await fetch(base + new URL(ogUrl).pathname);
      assert.equal(og.status, 200, 'current share image loads');
      assert.ok(og.headers.get('content-type')?.includes('image/png'), 'share image is PNG');
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
  assert.ok(contact.includes('一緒に、') && contact.includes('次の一歩を。') && !contact.includes('<canvas') && !contact.includes('lets-talk-orange.jpg'), 'inquiry page uses the corporate contact direction');
  const casePage = await (await fetch(base + '/works/central-medical')).text();
  assert.ok(casePage.includes('/services#digital') && casePage.includes('project=central-medical'), 'case study links to relevant support and contextual inquiry');
  const lunaCase = await (await fetch(base + '/works/luna-ai')).text();
  assert.ok(lunaCase.includes('LunaTechを別タブで開く'), 'case links to the separate brand website');
  assert.ok(casePage.includes('Central Medicalの作例を操作する'), 'approved origin has an inline preview');
  assert.ok(lunaCase.includes('https://luna-tech-public-site.vercel.app/'), 'case study retains stable public URL');
  const gallery = await (await fetch(base + '/works')).text();
  const galleryIds = [...gallery.matchAll(/data-live-work="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(galleryIds, ['now-on-air', 'luna-ai'], 'gallery publishes only the two selected works in curated order');
  assert.ok(gallery.includes('自社メディア / Web制作') && gallery.includes('別ブランドのWeb制作'), 'gallery distinguishes Lakkan media and the separate brand');
  assert.ok(!lunaCase.includes('data-live-work="central-medical"'), 'related work does not promote an excluded example');
  const nowCase = await (await fetch(base + '/works/now-on-air')).text();
  assert.ok(!lunaCase.includes('<iframe') && !nowCase.includes('<iframe'), 'selected works use stable screenshots without blocked or transient embeds');
  for (const asset of ['/works/now-on-air-current.jpg', '/works/lunatech-curated.jpg']) assert.equal((await fetch(base + asset)).status, 200, asset);
  console.log('PASS selected work, brand labels and current covers');
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
