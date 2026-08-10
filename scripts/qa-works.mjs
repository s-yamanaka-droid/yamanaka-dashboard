import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = "/Users/yamanakashuto/apps/yamanaka-dashboard";
const outputDir = join(root, "docs/studio/lakkan-portfolio/screenshots");
const pageUrl = "http://localhost:3107/works";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9343;
const profile = await mkdtemp(join(tmpdir(), "lakkan-works-qa-"));
const chrome = spawn(chromePath, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;

try {
  let debuggerUrl;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      debuggerUrl = pages.find((page) => page.type === "page")?.webSocketDebuggerUrl;
      if (debuggerUrl) break;
    } catch {}
    await sleep(250);
  }
  if (!debuggerUrl) throw new Error("Chrome DevTools endpoint did not start");

  socket = new WebSocket(debuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const browserErrors = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.text);
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") browserErrors.push(message.params.entry.text);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) {
      const detail = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
      throw new Error(detail);
    }
    return result.result.value;
  };
  const capture = async (name) => {
    const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    await writeFile(join(outputDir, name), Buffer.from(result.data, "base64"));
  };

  await mkdir(outputDir, { recursive: true });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Network.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      localStorage.setItem('lakkan-cookie-consent', JSON.stringify({ accepted: true, ts: Date.now() }));
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = 'nextjs-portal { display: none !important; }';
        document.head.appendChild(style);
      }, { once: true });
    `,
  });

  const checks = [];
  for (const viewport of [
    { width: 1440, height: 1100, mobile: false },
    { width: 1024, height: 1000, mobile: false },
    { width: 768, height: 1000, mobile: false },
    { width: 390, height: 844, mobile: true },
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile,
      screenWidth: viewport.width, screenHeight: viewport.height,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: viewport.mobile, maxTouchPoints: viewport.mobile ? 5 : 1 });
    await send("Page.navigate", { url: pageUrl });
    await sleep(3000);
    await evaluate(`new Promise((resolve) => {
      document.documentElement.style.scrollBehavior = 'auto';
      const images = [...document.images].filter((image) => image.getAttribute('src'));
      images.forEach((image) => { image.loading = 'eager'; });
      Promise.all(images.map((image) => image.complete ? Promise.resolve() : new Promise((done) => {
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      }))).then(resolve);
      setTimeout(resolve, 5000);
    })`);

    const metrics = await evaluate(`({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      images: [...document.images].length,
      brokenImages: [...document.images].filter((image) => image.getAttribute('src') && (!image.complete || image.naturalWidth === 0)).map((image) => image.src),
      cards: document.querySelectorAll('[data-work-card]').length,
      title: document.title
    })`);
    checks.push({ viewport: viewport.width, ...metrics });

    await evaluate("window.scrollTo(0, 0)");
    await capture(`works-${viewport.width}-hero.png`);
    for (const section of ["selected", "archive", "process", "closing", "page-footer"]) {
      await evaluate(`window.scrollTo(0, document.querySelector('#${section}').offsetTop)`);
      await sleep(250);
      await capture(`works-${viewport.width}-${section}.png`);
    }
  }

  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false, screenWidth: 1440, screenHeight: 1000 });
  await send("Page.navigate", { url: pageUrl });
  await sleep(2500);
  await evaluate("document.querySelector('[data-work-filter=\"client\"]').click()");
  await sleep(300);
  const filterCheck = await evaluate(`({
    pressed: document.querySelector('[data-work-filter="client"]').getAttribute('aria-pressed'),
    cards: document.querySelectorAll('[data-work-card]').length
  })`);
  await evaluate("document.querySelector('[data-work-card]').click()");
  await evaluate(`new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const waitForDialog = () => {
      const dialog = document.querySelector('[data-work-dialog]');
      if (dialog?.open) return resolve(true);
      if (Date.now() - startedAt > 3000) return reject(new Error('Desktop dialog did not open'));
      requestAnimationFrame(waitForDialog);
    };
    waitForDialog();
  })`);
  const dialogCheck = await evaluate(`({
    open: document.querySelector('[data-work-dialog]').open,
    title: document.querySelector('#work-dialog-title').textContent,
    width: Math.round(document.querySelector('[data-work-dialog]').getBoundingClientRect().width)
  })`);
  await capture("works-1440-dialog.png");

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, screenWidth: 390, screenHeight: 844 });
  await send("Page.navigate", { url: pageUrl });
  await sleep(2200);
  await evaluate("document.querySelector('[data-work-card]').click()");
  await evaluate(`new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const waitForDialog = () => {
      const dialog = document.querySelector('[data-work-dialog]');
      if (dialog?.open) return resolve(true);
      if (Date.now() - startedAt > 3000) return reject(new Error('Mobile dialog did not open'));
      requestAnimationFrame(waitForDialog);
    };
    waitForDialog();
  })`);
  const mobileDialogCheck = await evaluate(`({
    open: document.querySelector('[data-work-dialog]').open,
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    width: Math.round(document.querySelector('[data-work-dialog]').getBoundingClientRect().width)
  })`);
  await capture("works-390-dialog.png");

  const report = { checks, filterCheck, dialogCheck, mobileDialogCheck, browserErrors };
  await writeFile(join(outputDir, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} finally {
  if (socket) socket.close();
  if (chrome.exitCode === null) {
    chrome.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => chrome.once("exit", resolve)),
      sleep(3000),
    ]);
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
