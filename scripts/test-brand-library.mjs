// Component-handler and server-rendered content tests. No browser/layout or actual clipboard is used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const sharp = require("sharp");
const fuwafuwaCharacter = "/brand-book/fuwafuwa-character-v2.png";
const fuwafuwaScene = "/brand-book/racco-fuwafuwa-shop-v2.png";
const muchimuchiCharacter = "/brand-book/muchimuchi-cat-character-v1.png";
const muchimuchiScene = "/brand-book/racco-muchimuchi-shop-v1.png";
const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const dataContext = { exports: {} };
vm.runInNewContext(compile("../src/data/brand-book.ts"), dataContext);
const kitContext = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-kit.ts"), kitContext);
const worldContext = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-world.ts"), worldContext);
assert.deepEqual(Object.keys(worldContext.exports.characterBackgrounds).sort(), ["automation", "fuwafuwa", "muchimuchi", "practical", "racco"], "the shared world defines all five approved characters");
const columnsContext = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-columns.ts"), columnsContext);
const goodsContext = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-goods.ts"), goodsContext);
const inquiryContext = { exports: {}, URLSearchParams, require(name) {
  if (name === "@/data/racco-columns") return columnsContext.exports;
  if (name === "@/data/racco-goods") return goodsContext.exports;
  throw new Error(`Unexpected inquiry dependency: ${name}`);
} };
vm.runInNewContext(compile("../src/lib/racco-inquiry.ts"), inquiryContext);
const goodsComponent = { exports: {}, require(name) {
  if (name === "next/link") return "a";
  if (name === "next/image") return "img";
  if (name === "@/data/racco-goods") return goodsContext.exports;
  return require(name);
} };
vm.runInNewContext(compile("../src/components/brand/RaccoGoods.tsx"), goodsComponent);
assert.equal(goodsContext.exports.raccoGoods.length, 2);
assert.equal(new Set(goodsContext.exports.raccoGoods.map(item => item.slug)).size, 2);
assert.ok(!goodsContext.exports.raccoGoods.some(item => item.slug === "hina-sticker"), "withdrawn Hina design is not a published product");
for (const item of goodsContext.exports.raccoGoods) {
  assert.equal(item.statusLabel, "商品化準備中");
  const image = readFileSync(new URL("../public" + item.image, import.meta.url));
  assert.equal(image.readUInt32BE(16), item.width, item.slug + " actual image width");
  assert.equal(image.readUInt32BE(20), item.height, item.slug + " actual image height");
}
assert.equal(columnsContext.exports.raccoColumns.length, 3);
assert.equal(new Set(columnsContext.exports.raccoColumns.map(article => article.slug)).size, 3);
for (const article of columnsContext.exports.raccoColumns) {
  assert.equal(article.sections.length, 3, article.slug + " has a complete article, not just a teaser");
  assert.ok(article.prompt.length > 60 && article.takeaway.length > 20, article.slug + " has a usable prompt and next action");
  assert.ok(readFileSync(new URL("../public" + article.image, import.meta.url)).byteLength > 1000);
}
assert.equal(dataContext.exports.bookMarkdown, readFileSync(new URL("../public/brand-book/brand-book.md", import.meta.url), "utf8"), "downloadable manuscript stays in sync with shared content");
assert.equal(new Set(dataContext.exports.channels.map(channel => channel.subtitle)).size, 4, "each channel has a distinct editorial topic");
for (const phrase of ["知らない会社の自分", "そこだけ、ちょっと起きる", "距離が遠い。", "そこは起きてる。"]) {
  assert.ok(!dataContext.exports.bookMarkdown.includes(phrase), "rejected opaque copy stays out: " + phrase);
  assert.ok(!readFileSync(new URL("../src/components/brand/BrandBookPrint.tsx", import.meta.url), "utf8").includes(phrase), "print edition does not retain rejected copy: " + phrase);
}
for (const id of ["x", "instagram", "note"]) assert.match(dataContext.exports.channels.find(channel => channel.id === id).sample, /メモ.*次|次.*メモ|次.*貼る/s, id + " explains how a correction can be reused");
assert.equal(kitContext.exports.raccoCast.length, 3, "approved cast has three roles");
assert.deepEqual(Array.from(kitContext.exports.raccoCast, member => member.id), ["racco", "practical", "automation"], "Fuwafuwa does not replace any of the original three Racco roles");
assert.deepEqual(Array.from(kitContext.exports.raccoCast, member => [member.name, member.role]), [["Racco", "のんびり担当"], ["まず、ひとつ。", "テキパキ担当"], ["つい、凝っちゃう。", "自動化オタク担当"]], "original names and roles are unchanged");
assert.equal(kitContext.exports.raccoAssets.length, 29, "only the withdrawn Hina asset is excluded");
assert.equal(kitContext.exports.fuwafuwaAssets.length, 2, "standalone character and shared scene are defined once");
assert.deepEqual(Array.from(kitContext.exports.fuwafuwaAssets, asset => asset.src), [fuwafuwaCharacter, fuwafuwaScene]);
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "fuwafuwa").length, 2);
assert.equal(kitContext.exports.muchimuchiAssets.length, 2, "Muchimuchi has one standalone character and one shared scene");
assert.deepEqual(Array.from(kitContext.exports.muchimuchiAssets, asset => asset.src), [muchimuchiCharacter, muchimuchiScene]);
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "muchimuchi").length, 2);
assert.equal(kitContext.exports.assetGroups.find(group => group.id === "muchimuchi")?.label, "むちむち猫", "the approved name appears on the collection filter");
assert.equal(new Set(kitContext.exports.raccoAssets.map(asset => asset.src)).size, 29, "remaining assets are not duplicated in the combined collection");
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "stickers").length, 11);
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "hina" || asset.src.includes("racco-hina-")).length, 0, "withdrawn Hina asset is absent from public data");
assert.ok(!kitContext.exports.assetGroups.some(group => group.id === "hina"), "withdrawn Hina filter is absent");
assert.ok(!Object.hasOwn(kitContext.exports.assetDescriptions, "hina"), "withdrawn Hina description is absent");
for (const asset of kitContext.exports.raccoAssets) assert.ok(readFileSync(new URL("../public" + asset.src, import.meta.url)).byteLength > 1000, asset.src + " exists");
const characterPng = readFileSync(new URL("../public" + fuwafuwaCharacter, import.meta.url));
const characterInfo = await sharp(characterPng).metadata();
assert.equal(characterInfo.format, "png");
assert.deepEqual([characterInfo.width, characterInfo.height], [1254, 1254], "approved standalone Fuwafuwa has the supplied square dimensions");
assert.ok(characterInfo.hasAlpha, "standalone PNG has an alpha channel");
const characterAlpha = (await sharp(characterPng).stats()).channels.at(-1);
assert.equal(characterAlpha.min, 0, "standalone PNG contains actually transparent pixels, not an opaque background");
assert.ok(characterAlpha.max > 0, "standalone PNG also contains visible subject pixels");
const sceneInfo = await sharp(readFileSync(new URL("../public" + fuwafuwaScene, import.meta.url))).metadata();
assert.equal(sceneInfo.format, "png");
assert.deepEqual([sceneInfo.width, sceneInfo.height], [1672, 941], "shared scene retains the supplied landscape dimensions");
console.log("PASS Fuwafuwa assets: standalone PNG size and real transparency, landscape scene PNG");
const muchimuchiPng = readFileSync(new URL("../public" + muchimuchiCharacter, import.meta.url));
const muchimuchiInfo = await sharp(muchimuchiPng).metadata();
assert.equal(muchimuchiInfo.format, "png");
assert.deepEqual([muchimuchiInfo.width, muchimuchiInfo.height], [1254, 1254], "approved Muchimuchi standalone retains its supplied square dimensions");
assert.ok(muchimuchiInfo.hasAlpha, "Muchimuchi standalone has an alpha channel");
const muchimuchiAlpha = (await sharp(muchimuchiPng).stats()).channels.at(-1);
assert.equal(muchimuchiAlpha.min, 0, "Muchimuchi standalone contains actually transparent pixels");
assert.ok(muchimuchiAlpha.max > 0, "Muchimuchi standalone contains visible subject pixels");
const muchimuchiSceneInfo = await sharp(readFileSync(new URL("../public" + muchimuchiScene, import.meta.url))).metadata();
assert.equal(muchimuchiSceneInfo.format, "png");
assert.deepEqual([muchimuchiSceneInfo.width, muchimuchiSceneInfo.height], [1672, 941], "Muchimuchi shared scene retains its supplied landscape dimensions");
console.log("PASS Muchimuchi assets: standalone PNG size and real transparency, landscape scene PNG");
for (const path of ["../src/data/brand-book.ts", "../src/data/racco-kit.ts", "../src/components/brand/BrandLibrary.tsx", "../src/components/brand/BrandStudio.tsx", "../src/components/brand/BrandBookPrint.tsx", "../public/brand-book/brand-book.md"]) {
  assert.ok(!/本人用|本人のRacco|本人アバター|本人の分身|発信用アバター/.test(readFileSync(new URL(path, import.meta.url), "utf8")), "public brand content does not expose internal identity notes: " + path);
}
const compiled = compile("../src/components/brand/BrandLibrary.tsx");
const logoComponent = { exports: {}, require(name) {
  if (name.endsWith(".module.css")) return { logo: "logo", small: "small", default: "default", feature: "feature", inverse: "inverse" };
  return require(name);
} };
vm.runInNewContext(compile("../src/components/brand/LakkanLogo.tsx"), logoComponent);
assert.equal(logoComponent.exports.LakkanLogo({}).props["aria-label"], "Lakkan");
assert.equal(logoComponent.exports.LakkanLogo({ variant: "signature" }).props["aria-label"], "Lakkan 楽観");
const printComponent = { exports: {}, require(name) {
  if (name === "next/link") return "a";
  if (name === "next/image") return ({ unoptimized, ...props }) => { void unoptimized; return require("react").createElement("img", props); };
  if (name.endsWith(".css")) return {};
  if (name === "@/data/brand-book") return dataContext.exports;
  if (name === "@/data/racco-world") return worldContext.exports;
  if (name === "./LakkanLogo") return logoComponent.exports;
  return require(name);
} };
vm.runInNewContext(compile("../src/components/brand/BrandBookPrint.tsx"), printComponent);
const printHtml = require("react-dom/server").renderToStaticMarkup(require("react").createElement(printComponent.exports.BrandBookPrint));
assert.match(printHtml, /<h1 class="bp-logo">Racco<\/h1>/, "cover wordmark has no decorative navigation arrow");
assert.ok(!readFileSync(new URL("../src/components/brand/brand-print.css", import.meta.url), "utf8").includes(".bp-logo span"), "removed cover arrow has no leftover styles");
const guideSource = readFileSync(new URL("../src/components/brand/BrandStudio.tsx", import.meta.url), "utf8");
assert.match(guideSource, /className="bs-channel-path"><span>\{current\.cta\}<\/span><\/div>/, "noninteractive SNS explanation has no misleading trailing arrow");
assert.equal((printHtml.match(/<article /g) ?? []).length, 12, "brand book has exactly twelve pages");
for (let page = 1; page <= 12; page++) {
  assert.ok(printHtml.includes(`id="book-page-${page}"`), "stable page anchor " + page);
  assert.ok(printHtml.includes(`${String(page).padStart(2, "0")} / 12`), "correct page number " + page);
}
for (const page of [2, 3, 4, 5, 7, 11]) assert.ok(printHtml.includes(`href="#book-page-${page}"`), "contents target exists " + page);
for (const copy of [...Object.values(worldContext.exports.characterBackgrounds), ...Object.values(worldContext.exports.raccoWorld)]) assert.ok(printHtml.includes(copy), "print book uses shared character/world copy");
for (const source of [muchimuchiCharacter, fuwafuwaCharacter, muchimuchiScene, "/brand/lakkan-logo/lakkan-a3-wordmark.png", "/brand/lakkan-logo/lakkan-a3-signature.png"]) assert.ok(printHtml.includes(source), "current print asset " + source);
assert.ok(!/ひな|racco-hina|本人用|ラクする仕込み/.test(printHtml), "withdrawn characters and copy remain absent");
assert.ok(printHtml.includes("会社の顔と、いつもの顔。") && printHtml.includes("Raccoの英字はNunito"), "logo and type roles are explicit");
console.log("PASS brand book: twelve pages, contents, five characters, shared world and A3 logo variants");
for (const variant of ["wordmark", "signature"]) {
  const info = await sharp(new URL("../public/brand/lakkan-logo/lakkan-a3-" + variant + ".png", import.meta.url).pathname).metadata();
  assert.ok(info.hasAlpha, variant + " logo retains transparency");
  assert.deepEqual([info.width, info.height], [1983, 793]);
}
assert.match(readFileSync(new URL("../src/components/brand/BrandLibrary.tsx", import.meta.url), "utf8"), /className="bl-heading-phrase">いつもの風景も。/, "gallery heading keeps Japanese phrases together on narrow screens");

for (const allowed of [true, false]) {
  const state = [];
  let cursor = 0, copied = null;
  const context = { exports: {}, navigator: { clipboard: { async writeText(text) { if (!allowed) throw new Error("denied"); copied = text; } } }, require(name) {
    if (name === "react") return { useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], value => { state[i] = value; }]; } };
    return require(name);
  } };
  vm.runInNewContext(compile("../src/components/brand/ColumnPrompt.tsx"), context);
  const render = () => { cursor = 0; return context.exports.default({ text: "匿名化したメモを下書きに整理して。送信しない。" }); };
  await render().props.children[0].props.children[1].props.onClick();
  assert.equal(Boolean(copied), allowed, "copy success is based on actual write result");
  assert.equal(state[1], !allowed, "clipboard rejection enables manual selection");
  assert.equal(render().props.children[4]?.type === "textarea", !allowed);
}
console.log("PASS column prompt: clipboard success and manual fallback");

function nodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  return nodeText(node?.props?.children ?? "");
}

function fixture(brand, initialHash = "") {
  const state = [], history = [], focused = [], effects = [];
  const listeners = new Map();
  const location = { hash: initialHash };
  let cursor = 0, mounted = false;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], next => { state[i] = next; }]; },
    useRef(initial) { const i = cursor++; return state[i] ??= { current: initial }; },
    useEffect(callback) { if (!mounted) effects.push(callback); },
  };
  const context = {
    exports: {},
    require(name) {
      if (name === "react") return react;
      if (name === "next/link") return "a";
      if (name === "next/image") return "img";
      if (name.endsWith(".css")) return {};
      if (name === "@/data/brand-book") return dataContext.exports;
      if (name === "@/data/racco-kit") return kitContext.exports;
      if (name === "@/data/racco-world") return worldContext.exports;
      if (name === "@/data/racco-columns") return columnsContext.exports;
      if (name === "@/data/racco-goods") return goodsContext.exports;
      if (name === "@/lib/racco-inquiry") return inquiryContext.exports;
      if (name === "./RaccoGoods") return goodsComponent.exports;
      if (name === "./LakkanLogo") return logoComponent.exports;
      if (name === "./useBrandReducedMotion") return { useBrandReducedMotion: () => false };
      return require(name);
    },
    window: {
      history: { pushState: (...args) => history.push(args[2]), replaceState: (...args) => history.push(args[2]) },
      location,
      addEventListener: (name, callback) => listeners.set(name, callback),
      removeEventListener: name => listeners.delete(name),
    },
    document: { getElementById: id => ({ focus: () => focused.push(id) }) },
  };
  vm.runInNewContext(compiled, context);
  const render = () => { cursor = 0; const result = context.exports.default({ brand }); mounted = true; return result; };
  render();
  effects[0]();
  const find = predicate => {
    function visit(node) {
      if (!node || typeof node !== "object") return [];
      if (Array.isArray(node)) return node.flatMap(visit);
      if (node.type === goodsComponent.exports.default || node.type === logoComponent.exports.LakkanLogo) return visit(node.type(node.props));
      return [...(predicate(node) ? [node] : []), ...visit(node.props?.children)];
    }
    return visit(render());
  };
  const event = props => ({ prevented: false, preventDefault() { this.prevented = true; }, ...props });
  const setHash = hash => { location.hash = hash; listeners.get("hashchange")?.(); };
  return { find, state, history, focused, event, setHash };
}

for (const brand of ["racco", "lakkan"]) {
  const app = fixture(brand);
  assert.equal(app.find(n => n.props?.["data-lakkan-logo"] === "signature").length, brand === "lakkan" ? 1 : 0, "signature is restricted to Lakkan company concept");
  assert.ok(app.find(n => n.props?.["data-lakkan-logo"] === "wordmark").length >= 2, "navigation and footer use English only");
  assert.ok(!nodeText(app.find(n => n.props?.className === "brand-library")[0]).includes("Lakkanの、のんびり担当。"), "repeated assigned-role headline is removed");
  assert.equal(app.find(n => n.type === "img" && n.props.src === "/brand-book/racco-hina-sticker.png").length, 0, "home does not promote the withdrawn Hina design");
  const publicTabs = app.find(n => n.props?.role === "tab" && n.props.id?.startsWith("bl-tab-"));
  assert.deepEqual(publicTabs.map(n => n.props.id), (brand === "racco" ? ["concept", "columns", "members", "visual", "goods"] : ["concept", "columns", "members", "visual", "posts", "assets"]).map(id => `bl-tab-${id}`), brand + " has the intended public navigation");
  const hero = app.find(n => n.type === "img" && n.props?.preload)[0];
  assert.equal(hero.props.quality, 90, "hero retains details with the configured quality");
  assert.equal(hero.props.sizes, brand === "racco" ? "(max-width: 600px) 100vw, 1100px" : "(max-width: 600px) calc(170vw - 17px), 1100px", "image supply matches each brand's crop width");
  if (brand === "racco") {
    assert.equal(hero.props.src, "/brand-book/racco-self-morning.png", "own thick-glasses Racco leads the website");
    assert.equal(hero.props.width, 1672);
    assert.equal(hero.props.height, 941);
    assert.equal(app.find(n => n.props?.className === "bl-self").length, 1, "a usable self introduction is present");
    assert.deepEqual(publicTabs.map(nodeText), ["はじめに", "読みもの", "なかま", "ギャラリー", "グッズ"]);
    assert.equal(app.find(n => n.props?.className === "bl-story").length, 0, "unpublished social drafts are not home reading cards");
    assert.equal(app.find(n => n.props?.className === "bl-social-card").length, 0, "home does not render social drafts");
    assert.equal(app.find(n => n.type === "button" && nodeText(n).includes("自己紹介をコピー")).length, 0, "consumer home does not lead with asset production tools");
    for (const [label, section] of [["読みものを見る", "columns"], ["グッズを見る", "goods"], ["ギャラリーを見る", "visual"]]) {
      app.find(n => n.type === "button" && nodeText(n) === label)[0].props.onClick();
      assert.equal(app.state[0], section, label + " opens its actual destination");
      app.find(n => n.props?.id === "bl-tab-concept")[0].props.onClick();
    }
    const productionDetails = app.find(n => n.type === "details" && /SNS/.test(nodeText(n)) && /素材/.test(nodeText(n)));
    assert.ok(productionDetails.length >= 2, "desktop footer and mobile menu retain production tools inside details");
    assert.ok(productionDetails.every(n => !n.props.open), "production tools are collapsed by default");
  } else {
    assert.equal(hero.props.src, "/brand-book/racco-library-hero.png", "the Lakkan concept keeps its existing hero");
    assert.equal(app.find(n => n.props?.className === "bl-story").length, 2, "Lakkan retains its existing story entries");
  }
  const tab = id => app.find(n => n.props?.id === `bl-tab-${id}`)[0];
  tab("columns").props.onClick();
  assert.equal(app.history.at(-1), "#columns");
  assert.equal(app.find(n => n.props?.className === "bl-column-card").length, 3, "all articles have a reading entry");
  for (const article of columnsContext.exports.raccoColumns) assert.ok(app.find(n => n.props?.href === `/racco/columns/${article.slug}`).length);
  tab("visual").props.onClick();
  assert.equal(app.state[0], "visual");
  assert.equal(app.history.at(-1), "#visual");
  const home = app.find(n => brand === "racco" ? n.props?.className?.startsWith("bl-brand ") : n.props?.className === "bl-label")[0];
  const modified = app.event({ ctrlKey: true }); home.props.onClick(modified);
  assert.equal(modified.prevented, false, "modified clicks keep native navigation");
  assert.equal(app.state[0], "visual");
  app.find(n => n.props?.className === "bl-menu-button")[0].props.onClick();
  assert.equal(app.state[3], true);
  const click = app.event(); home.props.onClick(click);
  assert.equal(click.prevented, true);
  assert.equal(app.state[0], "concept", "same-page brand link resets the visible section");
  assert.equal(app.state[3], false, "same-page brand link closes the menu");
  assert.equal(app.history.at(-1), "#concept");
  tab("concept").props.onKeyDown(app.event({ key: "ArrowLeft" }));
  assert.equal(app.state[0], brand === "racco" ? "goods" : "assets");
  assert.equal(app.focused.at(-1), brand === "racco" ? "bl-tab-goods" : "bl-tab-assets");
  if (brand === "racco") {
    assert.equal(app.find(n => n.props?.className === "bl-goods-card").length, 2, "goods tab renders the two remaining designs");
    for (const item of goodsContext.exports.raccoGoods) {
      assert.ok(app.find(n => n.type === "a" && n.props.href === `/racco/goods/${item.slug}`).length, item.slug + " has a real detail route");
      assert.ok(app.find(n => n.type === "h3" && nodeText(n) === item.title).length);
    }
  }
  assert.equal(app.find(n => n.type === "main" && !n.props.role).length, 1, "main retains its landmark");
  assert.equal(app.find(n => n.type === "dialog" && n.props["aria-label"]).length, 3, "all dialogs have accessible names");
  const pause = app.find(n => n.type === "button" && n.props["aria-label"] === "動きを停止")[0];
  pause.props.onClick();
  assert.equal(app.find(n => n.props?.className === "brand-library")[0].props["data-motion"], "off");
  if (brand === "racco") {
    home.props.onClick(app.event());
    app.setHash("#sns-x");
    assert.equal(app.state[0], "posts"); assert.equal(app.state[1], "x");
    assert.equal(app.find(n => n.props?.className === "bl-social-card").length, 1, "legacy social hashes still open the draft workspace");
    tab("members").props.onClick();
    assert.equal(app.state[0], "members");
    assert.equal(app.history.at(-1), "#members");
    const worldIntro = app.find(n => n.props?.className === "bl-world-intro");
    assert.equal(worldIntro.length, 1, "members introduce the shared shop world once");
    assert.equal(nodeText(worldIntro[0].props.children[0]), worldContext.exports.raccoWorld.title, "members use the shared world title");
    for (const key of ["intro", "tone"]) {
      assert.ok(nodeText(worldIntro[0]).includes(worldContext.exports.raccoWorld[key]), "members show the shared world " + key);
    }
    const castRoles = app.find(n => n.props?.className === "bl-cast-roles");
    assert.equal(castRoles.length, 1);
    assert.equal(castRoles[0].props.children.filter(node => node.type === "article").length, 3, "the original three role cards remain together");
    for (const member of kitContext.exports.raccoCast) {
      assert.ok(nodeText(castRoles[0]).includes(member.name) && nodeText(castRoles[0]).includes(member.role), member.id + " retains its original name and role");
      const roleCard = castRoles[0].props.children.find(node => node.type === "article" && node.key === member.id);
      assert.ok(nodeText(roleCard).includes(worldContext.exports.characterBackgrounds[member.id]), member.id + " displays its shared character background");
    }
    assert.ok(app.find(n => n.type === "img" && n.props.src === "/brand-book/racco-trio.png").length, "original three-person scene remains available in members");
    assert.ok(app.find(n => n.type === "h1" && nodeText(n) === "Raccoと、なかまたち。").length, "members heading includes the expanded cast");
    const fuwafuwa = app.find(n => n.props?.id === "bl-fuwafuwa");
    assert.equal(fuwafuwa.length, 1, "new member has its own named section");
    assert.ok(nodeText(fuwafuwa[0]).includes("ふわふわさん"));
    assert.ok(nodeText(fuwafuwa[0]).includes(worldContext.exports.characterBackgrounds.fuwafuwa), "Fuwafuwa displays its shared character background");
    function assertDownloadableMemberImage(src, width, height) {
      const image = app.find(n => n.type === "img" && n.props.src === src)[0];
      assert.ok(image, src + " is shown in the member view or its preview");
      assert.equal(image.props.width, width);
      assert.equal(image.props.height, height);
      assert.ok(image.props.alt, src + " has alternative text");
      assert.ok(app.find(n => n.type === "a" && n.props.href === src && n.props.download != null && n.props.download !== false).length, src + " has a direct PNG download link");
    }
    assertDownloadableMemberImage(fuwafuwaCharacter, 1254, 1254);
    app.find(n => n.type === "button" && nodeText(n) === "ふたりの風景を見る")[0].props.onClick();
    assertDownloadableMemberImage(fuwafuwaScene, 1672, 941);
    app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props.onClose();
    assert.equal(app.find(n => n.type === "img" && n.props.src === fuwafuwaScene).length, 0, "closing the shared scene preview clears it");
    const muchimuchi = app.find(n => n.props?.id === "bl-muchimuchi");
    assert.equal(muchimuchi.length, 1, "Muchimuchi has a separate named member section");
    assert.ok(nodeText(muchimuchi[0]).includes(worldContext.exports.characterBackgrounds.muchimuchi), "Muchimuchi displays its shared character background");
    assert.ok(app.find(n => n.type === "h2" && nodeText(n) === "むちむち猫").length, "member heading uses the approved name");
    assertDownloadableMemberImage(muchimuchiCharacter, 1254, 1254);
    const muchimuchiDownload = app.find(n => n.type === "a" && n.props.href === muchimuchiCharacter && n.props.download === "muchimuchi-cat.png");
    assert.equal(muchimuchiDownload.length, 1, "standalone member download has a clear filename");
    assert.ok(nodeText(muchimuchiDownload[0]).includes("むちむち猫の画像を保存"));
    app.find(n => n.type === "button" && n.props["aria-label"] === "むちむち猫を拡大")[0].props.onClick();
    assert.equal(app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props["aria-label"], "むちむち猫のプレビュー", "member portrait opens its standalone preview");
    assertDownloadableMemberImage(muchimuchiCharacter, 1254, 1254);
    app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props.onClose();
    assert.equal(app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props["aria-label"], "画像のプレビュー", "closing the standalone preview clears selection");
    app.find(n => n.type === "button" && nodeText(n) === "みんなの風景を見る")[0].props.onClick();
    assertDownloadableMemberImage(muchimuchiScene, 1672, 941);
    app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props.onClose();
    assert.equal(app.find(n => n.type === "img" && n.props.src === muchimuchiScene).length, 0, "closing the Muchimuchi shared scene preview clears it");
    app.setHash("#assets-cast");
    assert.equal(app.state[0], "assets");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 2, "cast filter contains the approved scene and cast sheet");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "SNSの画像")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 7, "SNS reference assets can be selected separately");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "ホロシール")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 11, "all sticker designs are selectable");
    assert.equal(app.history.at(-1), "#assets-stickers");
    assert.equal(app.find(n => n.type === "a" && n.props?.download && n.props.href.includes("racco-sticker-")).length, 11);
    assert.equal(app.find(n => n.type === "button" && n.props?.children?.[0] === "ひなラッコ").length, 0, "withdrawn Hina filter is not offered");
    assert.equal(app.find(n => n.type === "a" && n.props?.href === "/brand-book/racco-hina-sticker.png" && n.props.download).length, 0, "withdrawn Hina asset has no download entry");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "ふわふわさん")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 2, "Fuwafuwa filter contains the standalone and shared scene only");
    assert.equal(app.history.at(-1), "#assets-fuwafuwa");
    for (const src of [fuwafuwaCharacter, fuwafuwaScene]) assert.ok(app.find(n => n.type === "a" && n.props.href === src && n.props.download).length, src + " can also be saved from the asset filter");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "むちむち猫")[0].props.onClick();
    assert.equal(app.history.at(-1), "#assets-muchimuchi");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 2, "Muchimuchi filter contains the standalone and shared scene only");
    for (const src of [muchimuchiCharacter, muchimuchiScene]) assert.ok(app.find(n => n.type === "a" && n.props.href === src && n.props.download).length, src + " can be saved from the asset filter");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "すべて")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 29, "all filter includes all remaining assets");
    app.setHash("#gallery-muchimuchi");
    assert.equal(app.state[0], "visual", "Muchimuchi collection hash opens the gallery");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 2);
    app.find(n => n.type === "button" && n.props?.["aria-label"] === "むちむち猫を拡大")[0].props.onClick();
    assertDownloadableMemberImage(muchimuchiCharacter, 1254, 1254);
    app.find(n => n.type === "dialog" && n.props.id === "bl-preview")[0].props.onClose();
    for (const [hash, section] of [["#gallery-muchimuchi", "visual"], ["#assets-muchimuchi", "assets"]]) {
      const direct = fixture("racco", hash);
      assert.equal(direct.state[0], section, hash + " works on initial arrival");
      assert.equal(direct.find(n => n.props?.className === "bl-card").length, 2, hash + " selects the two Muchimuchi assets");
    }
    app.setHash("#gallery-stickers");
    assert.equal(app.state[0], "visual", "legacy collection hash opens the gallery");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 11);
    app.find(n => n.type === "button" && n.props?.["aria-label"] === "だるい天才を拡大")[0].props.onClick();
    assert.ok(app.find(n => n.type === "a" && n.props?.href === "/racco/goods/holo-sticker").length, "gallery preview leads to its matching goods design");
    app.setHash("#goods");
    assert.equal(app.find(n => n.props?.className === "bl-goods-card").length, 2, "direct goods hash opens the two remaining designs");
  }
  console.log(`PASS ${brand}: handler state, native modified click, tab keys, landmark, dialog names, pause`);
}
