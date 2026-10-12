// Pure helper + component-handler tests. No browser, real clipboard or email app.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const columns = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-columns.ts"), columns);
const goods = { exports: {} };
vm.runInNewContext(compile("../src/data/racco-goods.ts"), goods);
const helper = { exports: {}, URLSearchParams, require: name => {
  if (name === "@/data/racco-columns") return columns.exports;
  if (name === "@/data/racco-goods") return goods.exports;
  throw new Error(`Unexpected helper dependency: ${name}`);
} };
vm.runInNewContext(compile("../src/lib/racco-inquiry.ts"), helper);
const { buildRaccoInquiryHref, resolveRaccoInquiryContext } = helper.exports;
const article = columns.exports.raccoColumns[0];
const product = goods.exports.raccoGoods[0];
const approvedBoards = [
  ["lakkan-wordmark", "/brand-book/lakkan-wordmark-only-v1.png"],
  ["rakkan-seal", "/brand-book/rakkan-seal-only-v1.png"],
  ["racco-face", "/brand-book/racco-face-only-v1.png"],
];
assert.deepEqual(Array.from(goods.exports.raccoGoods, item => item.slug), [
  ...approvedBoards.map(([slug]) => slug), "glasses-sticker", "holo-sticker",
], "three approved single-mark designs lead the collection; both existing designs remain");
assert.equal(new Set(goods.exports.raccoGoods.map(item => item.slug)).size, 5, "every goods route is unique");
for (const item of goods.exports.raccoGoods) {
  assert.equal(item.statusLabel, "商品化準備中", item.slug + " is not an available product");
  const image = readFileSync(new URL("../public" + item.image, import.meta.url));
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", item.slug + " references a PNG");
  assert.equal(image.readUInt32BE(16), item.width, item.slug + " width matches the actual asset");
  assert.equal(image.readUInt32BE(20), item.height, item.slug + " height matches the actual asset");
  assert.match(item.imageAlt, /生成デザイン/, item.slug + " identifies the image as a design concept");
}
for (const [slug, image] of approvedBoards) {
  const item = goods.exports.raccoGoods.find(item => item.slug === slug);
  assert.equal(item.image, image, slug + " uses its own approved single-mark board");
  assert.equal(item.width, 1536);
  assert.equal(item.height, 1024);
  assert.equal(item.collectionHref, "/racco#gallery-apparel", slug + " returns to the apparel gallery");
}

for (const [source, intent, topic, label] of [
  ["racco-home", "ai", "ai-consult", "Raccoのホーム"],
  ["racco-column", "ai", "ai-consult", "Raccoのコラム"],
  ["racco-gallery", "design", "racco-design", "Raccoのギャラリー"],
  ["racco-goods", "goods", "racco-goods", "Raccoのグッズ"],
]) {
  const context = resolveRaccoInquiryContext({ source });
  assert.equal(context.intent, intent);
  assert.equal(context.topic, topic);
  assert.equal(context.sourceLabel, label);
  assert.match(context.initialMessage, /相談したいです。\n\n$/);
  assert.doesNotMatch(context.initialMessage, /AI・業務について|グッズについて|キャラクター・デザインについて/,
    "initial draft must stay neutral when the user switches inquiry topics");
  const href = new URL(buildRaccoInquiryHref({ source }), "https://example.test");
  assert.equal(href.pathname, "/racco/contact");
  assert.equal(href.hash, "#main", "incoming links show the approved hero before the form");
  assert.equal(href.searchParams.get("source"), source);
  assert.equal(href.searchParams.get("intent"), intent);
}

for (const item of columns.exports.raccoColumns) {
  const input = { source: "racco-column", article: item.slug, intent: "ai" };
  const context = resolveRaccoInquiryContext(input);
  assert.equal(context.article.title, item.title);
  assert.ok(context.initialMessage.includes(item.title));
  assert.ok(context.bodyLines.includes(`見ていた記事：${item.title}`));
  const parsed = Object.fromEntries(new URL(buildRaccoInquiryHref(input), "https://example.test").searchParams);
  assert.equal(resolveRaccoInquiryContext(parsed).article.title, item.title);
}
for (const item of goods.exports.raccoGoods) {
  const input = { source: "racco-goods", product: item.slug, intent: "goods" };
  const context = resolveRaccoInquiryContext(input);
  assert.equal(context.product.slug, item.slug);
  assert.equal(context.product.title, item.title);
  assert.ok(context.initialMessage.includes(item.title));
  assert.ok(context.bodyLines.includes(`見ていたグッズ：${item.title}`));
  const href = new URL(buildRaccoInquiryHref(input), "https://example.test");
  assert.equal(href.pathname, "/racco/contact");
  assert.equal(href.hash, "#main");
  assert.equal(href.searchParams.get("product"), item.slug);
  const roundTrip = resolveRaccoInquiryContext(Object.fromEntries(href.searchParams));
  assert.equal(roundTrip.source, "racco-goods");
  assert.equal(roundTrip.intent, "goods");
  assert.equal(roundTrip.topic, "racco-goods");
  assert.equal(roundTrip.product.slug, item.slug);
  assert.equal(roundTrip.product.title, item.title);
  assert.equal(roundTrip.initialMessage, context.initialMessage);
  assert.ok(roundTrip.bodyLines.includes(`見ていたグッズ：${item.title}`));
}
assert.equal(resolveRaccoInquiryContext({ source: "racco-home", intent: "design" }).topic, "racco-design");
assert.equal(resolveRaccoInquiryContext({ source: "racco-goods", intent: "ai" }).topic, "ai-consult");

for (const invalid of [undefined, null, {}, [], { source: ["racco-home"] }, { source: "unknown" }, { source: "constructor" }, { source: "__proto__" }, { source: "racco-home\nInjected" }, { source: "javascript:alert(1)" }, { source: "https://example.invalid" }, { source: "//example.invalid" }]) {
  assert.equal(resolveRaccoInquiryContext(invalid), undefined);
  assert.equal(buildRaccoInquiryHref(invalid), "/racco/contact#main");
}
for (const value of [[article.slug], "not-an-article", "from-bookmark-to-work%0AInjected", "line one\nline two", {}, 123]) {
  const context = resolveRaccoInquiryContext({ source: "racco-column", article: value, intent: ["design"] });
  assert.equal(context.article, undefined);
  assert.equal(context.intent, "ai");
  assert.equal(context.bodyLines.length, 1);
  assert.equal(buildRaccoInquiryHref({ source: "racco-column", article: value }).includes("article="), false);
}
for (const value of [[product.slug], "not-a-product", "hina-sticker", "holo-sticker%0AInjected", "<script>bad</script>", {}, 123]) {
  const context = resolveRaccoInquiryContext({ source: "racco-goods", product: value, intent: "constructor" });
  assert.equal(context.product, undefined);
  assert.equal(context.intent, "goods");
  assert.equal(context.bodyLines.length, 1);
  assert.equal(buildRaccoInquiryHref({ source: "racco-goods", product: value }).includes("product="), false);
}
assert.equal(resolveRaccoInquiryContext({ source: "racco-home", article: article.slug, product: product.slug }).article, undefined);
assert.equal(resolveRaccoInquiryContext({ source: "racco-column", article: article.slug, product: product.slug }).product, undefined);
const sanitizedHref = new URL(buildRaccoInquiryHref({
  source: "racco-goods", product: product.slug, intent: "goods", article: article.slug,
  topic: "javascript:alert(1)", project: "not-a-project", next: "https://example.invalid", redirect: "//example.invalid",
}), "https://example.test");
assert.equal(sanitizedHref.origin, "https://example.test");
assert.deepEqual([...sanitizedHref.searchParams.keys()].sort(), ["intent", "product", "source"], "only the allowlisted route context is encoded");
assert.ok(!sanitizedHref.href.includes("example.invalid"));
console.log("PASS inquiry helper: five goods in approved order, PNG attributes, dedicated route, product round trips, sources, intent mapping, invalid arrays, URL schemes and unknown/encoded references");

function fixture({ raccoContext, projectName, initialTopic, variant, clipboard = "success", valid = true } = {}) {
  const state = [];
  let cursor = 0, copied, validationCalls = 0;
  const values = { name: "確認用テスト", email: "test@example.invalid", company: variant === "racco" ? undefined : "架空の所属", message: "一行目 & 記号 ? # = + %\n二行目：編集した相談内容\n三行目" };
  const form = { reportValidity: () => { validationCalls++; return valid; }, reset: () => { throw new Error("Inputs must not be reset"); } };
  const location = { href: "" };
  const context = {
    exports: {},
    require: name => {
      if (name === "react") return {
        useRef() { const i = cursor++; state[i] ??= { current: form }; return state[i]; },
        useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], next => { state[i] = next; }]; },
      };
      if (name === "next/link") return "a";
      if (name === "next/image") return "img";
      if (name.endsWith(".css")) return {};
      return require(name);
    },
    FormData: class { get(key) { return values[key] ?? null; } },
    navigator: clipboard === "unavailable" ? {} : { clipboard: { writeText: async text => {
      if (clipboard === "reject") throw new Error("Copy denied");
      copied = text;
    } } },
    window: { location },
  };
  vm.runInNewContext(compile("../src/app/contact/ContactForm.tsx"), context);
  const render = () => { cursor = 0; return context.exports.ContactForm({ raccoContext, projectName, initialTopic, variant }); };
  const find = predicate => {
    function visit(node) {
      if (!node || typeof node !== "object") return [];
      if (Array.isArray(node)) return node.flatMap(visit);
      return [...(predicate(node) ? [node] : []), ...visit(node.props?.children)];
    }
    return visit(render());
  };
  return { find, values, location, getCopied: () => copied, validations: () => validationCalls };
}

const raccoContext = resolveRaccoInquiryContext({ source: "racco-column", article: article.slug });
const formApp = fixture({ raccoContext, initialTopic: raccoContext.topic });
assert.equal(formApp.find(node => node.props?.id === "message")[0].props.defaultValue, raccoContext.initialMessage);
assert.ok(formApp.find(node => node.type === "strong" && node.props.children === article.title).length);
const editedMessage = formApp.values.message;
formApp.find(node => node.type === "form")[0].props.onSubmit({ preventDefault() {}, currentTarget: {} });
const mailto = new URL(formApp.location.href);
assert.equal(mailto.protocol, "mailto:");
assert.equal(mailto.pathname, "s-yamanaka@tre-pro.co.jp", "existing recipient stays unchanged");
assert.equal(mailto.searchParams.get("subject"), "[Lakkan] AI・業務のご相談");
assert.ok(mailto.searchParams.get("body").includes(`見ていた記事：${article.title}`));
assert.ok(mailto.searchParams.get("body").endsWith(editedMessage), "encoded multi-line message survives intact");
assert.equal(formApp.values.message, editedMessage, "opening mailto does not reset inputs");
assert.match(formApp.find(node => node.props?.role === "status")[0].props.children, /まだ送信されていません/);

for (const variant of [undefined, "racco", "poster"]) for (const clipboard of ["success", "reject", "unavailable"]) {
  const app = fixture({ raccoContext, initialTopic: raccoContext.topic, variant, clipboard });
  await app.find(node => node.type === "button" && node.props.type === "button")[0].props.onClick();
  assert.equal(app.validations(), 1);
  assert.equal(app.values.message, editedMessage, "copying/failing does not reset inputs");
  assert.equal(app.location.href, "", "copy never opens or sends email");
  const manual = app.find(node => node.props?.id === "manual-draft");
  if (clipboard === "success") {
    assert.ok(app.getCopied().includes(editedMessage));
    assert.equal(manual.length, 0);
  } else {
    assert.equal(manual.length, 1);
    assert.ok(manual[0].props.value.includes(editedMessage));
    let selected = false;
    manual[0].props.onFocus({ currentTarget: { select() { selected = true; } } });
    assert.equal(selected, true);
  }
  assert.match(app.find(node => node.props?.role === "status")[0].props.children, /まだ送信されていません/);
  app.find(node => node.type === "form")[0].props.onChange();
  assert.equal(app.find(node => node.props?.id === "manual-draft").length, 0, "editing invalidates an old draft snapshot");
}
const invalidForm = fixture({ valid: false });
await invalidForm.find(node => node.type === "button" && node.props.type === "button")[0].props.onClick();
assert.equal(invalidForm.getCopied(), undefined, "copy respects required fields");
const existingProject = fixture({ projectName: "公開実績のテスト", initialTopic: "unknown" });
assert.equal(existingProject.find(node => node.props?.id === "topic")[0].props.value, "ai-consult");
assert.match(existingProject.find(node => node.props?.id === "message")[0].props.defaultValue, /公開実績のテストの実績/);
assert.equal(existingProject.find(node => node.type === "input" && node.props.type === "radio").length, 0, "corporate form keeps its select");

for (const item of goods.exports.raccoGoods) {
  const href = new URL(buildRaccoInquiryHref({ source: "racco-goods", product: item.slug, intent: "goods" }), "https://example.test");
  const context = resolveRaccoInquiryContext(Object.fromEntries(href.searchParams));
  const app = fixture({ raccoContext: context, initialTopic: context.topic, variant: "racco" });
  assert.equal(app.find(node => node.props?.id === "message")[0].props.defaultValue, context.initialMessage);
  assert.ok(app.find(node => node.type === "strong" && node.props.children === item.title).length, item.slug + " is identified in the form");
  app.find(node => node.type === "form")[0].props.onSubmit({ preventDefault() {}, currentTarget: {} });
  const draft = new URL(app.location.href);
  assert.equal(draft.protocol, "mailto:");
  assert.equal(draft.pathname, "s-yamanaka@tre-pro.co.jp");
  assert.equal(draft.searchParams.get("subject"), "[Lakkan] グッズについて");
  assert.ok(draft.searchParams.get("body").includes(`見ていたグッズ：${item.title}`), item.slug + " remains in the email draft");
  assert.ok(draft.searchParams.get("body").endsWith(app.values.message), item.slug + " preserves the edited message");
  assert.match(app.find(node => node.props?.role === "status")[0].props.children, /まだ送信されていません/);
}

const goodsContext = resolveRaccoInquiryContext({ source: "racco-goods", product: product.slug, intent: "goods" });
const raccoApp = fixture({ raccoContext: goodsContext, initialTopic: goodsContext.topic, variant: "racco" });
const radios = () => raccoApp.find(node => node.type === "input" && node.props.type === "radio");
assert.deepEqual(radios().map(node => node.props.value).sort(), ["ai-consult", "racco-design", "racco-goods"]);
assert.ok(radios().every(node => node.props.name === "topic"), "topic cards form one radio group");
assert.equal(radios().find(node => node.props.checked)?.props.value, "racco-goods");
assert.equal(raccoApp.find(node => node.type === "select").length, 0, "Racco uses three topic cards instead of the corporate select");
assert.equal(raccoApp.find(node => node.props?.id === "message")[0].props.defaultValue, goodsContext.initialMessage);
for (const [topic, label] of [["racco-design", "キャラクター・デザインの相談"], ["ai-consult", "AI・業務のご相談"], ["racco-goods", "グッズについて"]]) {
  radios().find(node => node.props.value === topic).props.onChange({ target: { value: topic } });
  raccoApp.find(node => node.type === "form")[0].props.onChange();
  assert.equal(radios().find(node => node.props.checked)?.props.value, topic);
  assert.equal(raccoApp.values.message, editedMessage, "changing a topic does not clear edited content");
  raccoApp.find(node => node.type === "form")[0].props.onSubmit({ preventDefault() {}, currentTarget: {} });
  const draft = new URL(raccoApp.location.href);
  assert.equal(draft.protocol, "mailto:");
  assert.equal(draft.pathname, "s-yamanaka@tre-pro.co.jp");
  assert.equal(draft.searchParams.get("subject"), `[Lakkan] ${label}`);
  assert.ok(!draft.searchParams.get("body").includes("undefined") && !draft.searchParams.get("body").includes("null"), "omitted optional fields do not leak placeholder values");
  assert.ok(draft.searchParams.get("body").includes(`見ていたグッズ：${product.title}`));
  assert.ok(draft.searchParams.get("body").endsWith(editedMessage), "topic change preserves the edited multiline message in the generated email");
  assert.match(raccoApp.find(node => node.props?.role === "status")[0].props.children, /まだ送信されていません/);
}
console.log("PASS contact handlers: all five goods preserve their context through email drafts, corporate select and Racco radio cards, topic switching preserves text, encoded mailto, unchanged recipient, not-sent status, clipboard fallback and existing projects");
