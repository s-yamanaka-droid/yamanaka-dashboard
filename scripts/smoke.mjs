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
  assert.equal((await (await fetch(base + '/api/health')).json()).experience, 'interactive-workshop', 'health identifies the current homepage');
  for (const path of ["/", "/works", ...projects.map(p=>`/works/${p.id}`), "/services", "/about", "/contact?topic=luna", "/atelier", "/changelog", "/privacy", "/racco", "/concept", "/brand-book", "/brand-guide"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, path + " has one main");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + " has one heading");
    if (path === "/") {
      const csp=response.headers.get('content-security-policy')||'';
      assert.ok(csp.includes("frame-src 'self' https://luna-tech-public-site.vercel.app"), 'public preview origins permitted by CSP');
      assert.ok(csp.includes("frame-ancestors 'self'"), 'embedding this site remains restricted');
      assert.ok(html.includes('data-home="motion"') && html.includes('factory-shell'), 'home renders the actual interactive workshop');
      assert.ok(html.includes('人と仕事の課題を、') && html.includes('整理から実装まで。'), 'company context remains available before WebGL');
      assert.ok(html.includes('href="/contact?topic=other#inquiry"') && html.includes('相談する'), 'home leads directly to the inquiry form');
      assert.ok(!html.includes('luna-management') && !html.includes('luna-receptionist'), 'home does not route visitors directly to unrelated Luna products');
      assert.ok(html.includes('Menuを開く') && html.includes('aria-haspopup="dialog"'), 'home has accessible fallback navigation');
      assert.ok(html.includes('制作・運用例') && html.includes('探索する') && html.includes('動きを一時停止'), 'work, exploration and playback controls are present');
      assert.ok(html.includes('id="scene"') && !html.includes('<video'), 'home mounts the procedural renderer rather than a film');
      const ogUrl = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
      assert.ok(ogUrl, 'home exposes a share image');
      const og = await fetch(base + new URL(ogUrl).pathname);
      assert.equal(og.status, 200, 'current share image loads');
      assert.ok(og.headers.get('content-type')?.includes('image/png'), 'share image is PNG');
    } else if (["/racco", "/concept", "/brand-book", "/brand-guide"].includes(path)) {
      assert.ok(html.includes(path === "/brand-book" ? 'brand-print-route' : path === "/brand-guide" ? 'brand-studio' : 'brand-library'), path + " renders the appropriate brand edition");
      if (["/racco", "/concept"].includes(path)) {
        for (const tab of ["concept", "visual", "posts", "assets"]) assert.ok(html.includes(`id="bl-tab-${tab}"`), path + " has " + tab + " navigation");
        assert.ok(!html.includes('class="bs-sidebar"'), path + " uses a compact top navigation, not the full guide sidebar");
        assert.ok(html.includes('href="/brand-guide"') && html.includes('href="/brand-book"'), path + " keeps the complete guide and print edition accessible");
        assert.ok(html.includes('aria-label="Lakkanのキャラクター"'), path + " identifies Racco within Lakkan");
        for (const destination of ['/works', '/services', '/contact?topic=other#inquiry']) assert.ok(html.includes(`href="${destination}"`), path + " exposes " + destination);
        assert.ok(html.includes('ほんとの最終、どれ。') && html.includes('そのコピペ、明日もあるの。'), path + " offers concrete story headlines rather than asset metadata");
        assert.ok(!html.includes('class="bl-hero-art is-workshop"'), path + " avoids the cropped baked-in Lakkan lettering");
        if (path === '/racco') {
          assert.ok(html.includes('ひとりごとを読む') && html.includes('LakkanのRacco'), 'Racco introduces its affiliation and reading entry');
          assert.ok(html.includes('だいたい、眠い。') && html.includes('自己紹介をコピー'), 'the self-portrait edition has real text and a useful profile action');
          assert.ok(html.includes('racco-self-morning.png') && html.includes('racco-self-avatar.png'), 'new identity is present in the server-rendered page');
        }
      }
      assert.ok(!html.includes('class="site-header') && !html.includes('class="site-footer'), path + " has no overlapping corporate shell");
      assert.ok(html.includes('name="robots" content="noindex'), path + " remains a non-indexed candidate");
    } else {
      assert.ok(html.includes('site-header') && html.includes('site-footer'), path + " shared navigation");
    }
    console.log("PASS", path);
  }
  for (const width of [640, 1080, 1920]) {
    const optimized = await fetch(base + `/_next/image?url=%2Fbrand-book%2Fracco-library-hero.png&w=${width}&q=90`, { headers: { Accept: "image/webp" } });
    assert.equal(optimized.status, 200, `Racco image at ${width}px`);
    assert.ok(optimized.headers.get("content-type")?.startsWith("image/"), "optimized hero is an image");
    assert.ok((await optimized.arrayBuffer()).byteLength > 1000, "optimized image has content");
  }
  console.log("PASS responsive hero image delivery at quality 90");
  const film = await fetch(base + "/brand/lakkan-water-horizontal.mp4", { headers: { Range: "bytes=0-1023" } });
  assert.equal(film.status, 206, "film supports byte-range playback");
  assert.ok(film.headers.get("content-type")?.includes("video/mp4"), "film MIME type");
  assert.equal((await fetch(base + "/brand/lakkan-water-horizontal-poster.jpg")).status, 200, "film poster");
  console.log("PASS Blender film range playback and poster");
  for (const asset of ["/brand/lakkan-orange.jpg", "/brand/lakkan-orange-settled.jpg", "/brand/lets-talk-orange.jpg", "/works/lunatech-current.jpg"]) assert.equal((await fetch(base + asset)).status, 200, asset);
  for (const asset of ["/brand-book/racco-library-hero.png", "/brand-book/racco-post-wide.png", "/brand-book/racco-banner.png", "/brand-book/lakkan-cover.png"]) assert.equal((await fetch(base + asset)).status, 200, asset);
  for (const name of ['morning', 'cafe', 'avatar', 'merch', 'sticker']) {
    const response = await fetch(base + `/brand-book/racco-self-${name}.png`);
    assert.equal(response.status, 200, `self-portrait ${name}`);
    assert.ok(response.headers.get('content-type')?.includes('image/png'), `download MIME ${name}`);
  }
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
