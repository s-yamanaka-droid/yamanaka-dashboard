// Component-handler tests only. No browser, layout, clipboard or actual DOM is used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const dataContext = { exports: {} };
vm.runInNewContext(compile("../src/data/brand-book.ts"), dataContext);
const kitContext = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-kit.ts"), kitContext);
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
assert.equal(goodsContext.exports.raccoGoods.length, 3);
assert.equal(new Set(goodsContext.exports.raccoGoods.map(item => item.slug)).size, 3);
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
assert.equal(kitContext.exports.raccoAssets.length, 26, "existing 14 assets plus 11 stickers and Hina are available");
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "stickers").length, 11);
assert.equal(kitContext.exports.raccoAssets.filter(asset => asset.group === "hina").length, 1);
for (const asset of kitContext.exports.raccoAssets) assert.ok(readFileSync(new URL("../public" + asset.src, import.meta.url)).byteLength > 1000, asset.src + " exists");
for (const path of ["../src/data/brand-book.ts", "../src/data/racco-kit.ts", "../src/components/brand/BrandLibrary.tsx", "../src/components/brand/BrandStudio.tsx", "../src/components/brand/BrandBookPrint.tsx", "../public/brand-book/brand-book.md"]) {
  assert.ok(!/本人用|本人のRacco|本人アバター|本人の分身|発信用アバター/.test(readFileSync(new URL(path, import.meta.url), "utf8")), "public brand content does not expose internal identity notes: " + path);
}
const compiled = compile("../src/components/brand/BrandLibrary.tsx");
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
      if (name === "@/data/racco-columns") return columnsContext.exports;
      if (name === "@/data/racco-goods") return goodsContext.exports;
      if (name === "@/lib/racco-inquiry") return inquiryContext.exports;
      if (name === "./RaccoGoods") return goodsComponent.exports;
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
      if (node.type === goodsComponent.exports.default) return visit(node.type(node.props));
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
    assert.equal(app.find(n => n.props?.className === "bl-goods-card").length, 3, "goods tab renders the real reusable component");
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
    assert.equal(app.find(n => n.props?.className === "bl-cast-roles").length, 1);
    assert.equal(app.find(n => n.type === "article").length, 3, "three distinct approved roles are present");
    app.setHash("#assets-cast");
    assert.equal(app.state[0], "assets");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 2, "cast filter contains the approved scene and cast sheet");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "SNSの画像")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 7, "SNS reference assets can be selected separately");
    app.find(n => n.type === "button" && n.props?.children?.[0] === "ホロシール")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 11, "all sticker designs are selectable");
    assert.equal(app.history.at(-1), "#assets-stickers");
    assert.equal(app.find(n => n.type === "a" && n.props?.download && n.props.href.includes("racco-sticker-")).length, 11);
    app.find(n => n.type === "button" && n.props?.children?.[0] === "ひなラッコ")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 1);
    assert.equal(app.history.at(-1), "#assets-hina");
    assert.ok(app.find(n => n.type === "a" && n.props?.href === "/brand-book/racco-hina-sticker.png" && n.props.download).length);
    app.find(n => n.type === "button" && n.props?.children?.[0] === "すべて")[0].props.onClick();
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 26, "all filter does not hide older work");
    app.setHash("#gallery-stickers");
    assert.equal(app.state[0], "visual", "legacy collection hash opens the gallery");
    assert.equal(app.find(n => n.props?.className === "bl-card").length, 11);
    app.find(n => n.type === "button" && n.props?.["aria-label"] === "だるい天才を拡大")[0].props.onClick();
    assert.ok(app.find(n => n.type === "a" && n.props?.href === "/racco/goods/holo-sticker").length, "gallery preview leads to its matching goods design");
    app.setHash("#goods");
    assert.equal(app.find(n => n.props?.className === "bl-goods-card").length, 3, "direct goods hash opens the complete collection");
  }
  console.log(`PASS ${brand}: handler state, native modified click, tab keys, landmark, dialog names, pause`);
}
