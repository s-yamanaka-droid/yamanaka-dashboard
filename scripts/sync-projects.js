#!/usr/bin/env node
/**
 * sync-projects.js
 * ~/apps/ 配下の全プロジェクトをスキャンし、.vercel/project.json からURLを自動取得して
 * src/data/projects.json の url フィールドを更新する。
 *
 * 使い方: node scripts/sync-projects.js
 */

const fs = require("fs");
const path = require("path");

const APPS_DIR = path.join(process.env.HOME, "apps");
const PROJECTS_JSON = path.join(__dirname, "../src/data/projects.json");

function getVercelUrl(appDir) {
  const vercelConfig = path.join(appDir, ".vercel", "project.json");
  if (!fs.existsSync(vercelConfig)) return null;
  try {
    const config = JSON.parse(fs.readFileSync(vercelConfig, "utf8"));
    const projectName = config.projectName || config.name;
    if (projectName) return `https://${projectName}.vercel.app`;
  } catch {}
  return null;
}

function main() {
  const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON, "utf8"));

  // Get all app directories
  const appDirs = fs.readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let updated = 0;

  for (const project of projects) {
    if (project.url) continue; // already has URL, skip

    // Try to find matching app directory by id
    const candidates = [
      project.id,
      project.id.replace(/-/g, "_"),
      project.name.toLowerCase().replace(/\s+/g, "-"),
    ];

    for (const candidate of candidates) {
      const appPath = path.join(APPS_DIR, candidate);
      if (fs.existsSync(appPath)) {
        const url = getVercelUrl(appPath);
        if (url) {
          console.log(`✓ ${project.id}: ${url}`);
          project.url = url;
          project.updatedAt = new Date().toISOString().split("T")[0];
          updated++;
          break;
        }
      }
    }
  }

  // Also scan all app dirs and report ones not in projects.json
  const projectIds = new Set(projects.map(p => p.id));
  for (const dir of appDirs) {
    if (dir === "yamanaka-dashboard" || dir.startsWith(".")) continue;
    const appPath = path.join(APPS_DIR, dir);
    const url = getVercelUrl(appPath);
    if (url) {
      // Check if any project references this
      const matches = projects.filter(p =>
        p.id === dir ||
        p.url === url ||
        url.includes(p.id)
      );
      if (matches.length === 0) {
        console.log(`⚠ NEW (not in projects.json): ${dir} → ${url}`);
      }
    }
  }

  if (updated > 0) {
    fs.writeFileSync(PROJECTS_JSON, JSON.stringify(projects, null, 2) + "\n");
    console.log(`\n✅ ${updated} project(s) updated.`);
  } else {
    console.log("\n✅ No updates needed — all projects already have URLs or no new .vercel configs found.");
  }
}

main();
