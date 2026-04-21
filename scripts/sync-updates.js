#!/usr/bin/env node
/**
 * sync-updates.js
 * 各 ~/apps/ プロジェクトの git log 最終コミット日時を読んで
 * projects.json の updatedAt を自動同期する。
 * npm run build の前に自動実行される (package.json "prebuild" に設定済み)
 */
const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const APPS_DIR      = path.join(process.env.HOME, "apps");
const PROJECTS_JSON = path.join(__dirname, "../src/data/projects.json");

function gitLastCommit(dir) {
  try {
    const out = execSync(`git -C "${dir}" log -1 --format="%ai"`, {
      encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], timeout: 5000,
    }).trim();
    return out ? out.split(" ")[0] : null; // YYYY-MM-DD
  } catch { return null; }
}

function findAppDir(project) {
  const candidates = [
    project.id,
    project.id.replace(/-/g, "_"),
    project.name.toLowerCase().replace(/\s+/g, "-"),
  ];
  for (const c of candidates) {
    const p = path.join(APPS_DIR, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function getVercelUrl(appDir) {
  const cfg = path.join(appDir, ".vercel", "project.json");
  if (!fs.existsSync(cfg)) return null;
  try {
    const { projectName, name } = JSON.parse(fs.readFileSync(cfg, "utf8"));
    const n = projectName || name;
    return n ? `https://${n}.vercel.app` : null;
  } catch { return null; }
}

function main() {
  // Vercel / CI 環境では ~/apps/ が存在しないのでスキップ
  if (!fs.existsSync(APPS_DIR)) {
    console.log("ℹ  APPS_DIR not found — skipping sync (Vercel/CI environment).");
    return;
  }
  const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, "utf8"));
  let updated = 0;

  for (const p of projects) {
    const dir = findAppDir(p);
    if (!dir) continue;

    // Sync updatedAt from git
    const date = gitLastCommit(dir);
    if (date && date !== p.updatedAt) {
      console.log(`↑ ${p.id}: updatedAt ${p.updatedAt} → ${date}`);
      p.updatedAt = date;
      updated++;
    }

    // Sync url from .vercel if missing
    if (!p.url) {
      const url = getVercelUrl(dir);
      if (url) {
        console.log(`🔗 ${p.id}: url → ${url}`);
        p.url = url;
        updated++;
      }
    }
  }

  // Scan for NEW apps not in projects.json
  const existingIds = new Set(projects.map(p => p.id));
  const dirs = fs.readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("."))
    .map(d => d.name);

  for (const dir of dirs) {
    if (existingIds.has(dir) || dir === "yamanaka-dashboard") continue;
    const appPath = path.join(APPS_DIR, dir);
    const url = getVercelUrl(appPath);
    const lastCommit = gitLastCommit(appPath);
    if (url || lastCommit) {
      console.log(`⚠ NEW app not in projects.json: ${dir} (url=${url ?? "none"}, last=${lastCommit ?? "?"})`);
    }
  }

  if (updated > 0) {
    fs.writeFileSync(PROJECTS_JSON, JSON.stringify(projects, null, 2) + "\n");
    console.log(`\n✅ ${updated} field(s) synced.`);
  } else {
    console.log("✅ All up to date.");
  }
}

main();
