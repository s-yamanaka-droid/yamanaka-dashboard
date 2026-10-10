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
  const href = new URL(buildRaccoInquiryHref({ source }), "https://example.test");
  assert.equal(href.pathname, "/contact");
  assert.equal(href.hash, "#inquiry");
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
  assert.equal(context.product.title, item.title);
  assert.ok(context.initialMessage.includes(item.title));
  assert.ok(context.bodyLines.includes(`見ていたグッズ：${item.title}`));
  assert.equal(new URL(buildRaccoInquiryHref(input), "https://example.test").searchParams.get("product"), item.slug);
}
assert.equal(resolveRaccoInquiryContext({ source: "racco-home", intent: "design" }).topic, "racco-design");
assert.equal(resolveRaccoInquiryContext({ source: "racco-goods", intent: "ai" }).topic, "ai-consult");

for (const invalid of [undefined, null, {}, [], { source: ["racco-home"] }, { source: "unknown" }, { source: "constructor" }, { source: "__proto__" }, { source: "racco-home\nInjected" }]) {
  assert.equal(resolveRaccoInquiryContext(invalid), undefined);
  assert.equal(buildRaccoInquiryHref(invalid), "/contact#inquiry");
}
for (const value of [[article.slug], "not-an-article", "from-bookmark-to-work%0AInjected", "line one\nline two", {}, 123]) {
  const context = resolveRaccoInquiryContext({ source: "racco-column", article: value, intent: ["design"] });
  assert.equal(context.article, undefined);
  assert.equal(context.intent, "ai");
  assert.equal(context.bodyLines.length, 1);
  assert.equal(buildRaccoInquiryHref({ source: "racco-column", article: value }).includes("article="), false);
}
for (const value of [[product.slug], "not-a-product", "holo-sticker%0AInjected", "<script>bad</script>", {}, 123]) {
  const context = resolveRaccoInquiryContext({ source: "racco-goods", product: value, intent: "constructor" });
  assert.equal(context.product, undefined);
  assert.equal(context.intent, "goods");
  assert.equal(context.bodyLines.length, 1);
  assert.equal(buildRaccoInquiryHref({ source: "racco-goods", product: value }).includes("product="), false);
}
assert.equal(resolveRaccoInquiryContext({ source: "racco-home", article: article.slug, product: product.slug }).article, undefined);
assert.equal(resolveRaccoInquiryContext({ source: "racco-column", article: article.slug, product: product.slug }).product, undefined);
console.log("PASS inquiry helper: sources, intent mapping, all public references, round trips, invalid arrays and unknown/encoded references");

function fixture({ raccoContext, projectName, initialTopic, clipboard = "success", valid = true } = {}) {
  const state = [];
  let cursor = 0, copied, validationCalls = 0;
  const values = { name: "確認用テスト", email: "test@example.invalid", company: "架空の所属", message: "一行目 & 記号 ? # = + %\n二行目：編集した相談内容\n三行目" };
  const form = { reportValidity: () => { validationCalls++; return valid; } };
  const location = { href: "" };
  const context = {
    exports: {},
    require: name => {
      if (name === "react") return {
        useRef() { const i = cursor++; state[i] ??= { current: form }; return state[i]; },
        useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], next => { state[i] = next; }]; },
      };
      if (name === "next/link") return "a";
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
  const render = () => { cursor = 0; return context.exports.ContactForm({ raccoContext, projectName, initialTopic }); };
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

for (const clipboard of ["success", "reject", "unavailable"]) {
  const app = fixture({ raccoContext, initialTopic: raccoContext.topic, clipboard });
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
console.log("PASS contact handlers: editable context, encoded mailto, unchanged recipient, not-sent status, clipboard fallback, input preservation and existing projects");
