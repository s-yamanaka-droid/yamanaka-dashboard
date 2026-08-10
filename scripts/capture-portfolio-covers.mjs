import { spawn } from "node:child_process";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = "/Users/yamanakashuto/apps/yamanaka-dashboard";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const projects = JSON.parse(await readFile(join(root, "src/data/projects.json"), "utf8"));
const outputDir = join(root, "public/works");

function run(command, args, timeoutMs = 24000) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Timed out: ${command}`));
    }, timeoutMs);
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}

await mkdir(outputDir, { recursive: true });
const report = [];

for (const project of projects) {
  const pngPath = join(outputDir, `${project.id}.capture.png`);
  const jpgPath = join(outputDir, `${project.id}.jpg`);
  const startedAt = Date.now();
  try {
    await run(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--force-device-scale-factor=1",
      "--window-size=1440,960",
      "--virtual-time-budget=6500",
      `--screenshot=${pngPath}`,
      project.url,
    ]);
    await run("/usr/bin/sips", [
      "-s", "format", "jpeg",
      "-s", "formatOptions", "82",
      pngPath,
      "--out", jpgPath,
    ], 12000);
    await rm(pngPath, { force: true });
    const file = await stat(jpgPath);
    const item = {
      id: project.id,
      url: project.url,
      status: "captured",
      width: 1440,
      height: 960,
      bytes: file.size,
      elapsedMs: Date.now() - startedAt,
    };
    report.push(item);
    process.stdout.write(`${project.id}: ${file.size} bytes\n`);
  } catch (error) {
    await rm(pngPath, { force: true });
    const item = {
      id: project.id,
      url: project.url,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
      elapsedMs: Date.now() - startedAt,
    };
    report.push(item);
    process.stderr.write(`${project.id}: ${item.error}\n`);
  }
}

await writeFile(join(outputDir, "capture-report.json"), `${JSON.stringify(report, null, 2)}\n`);
if (report.some((item) => item.status === "failed")) process.exitCode = 1;
