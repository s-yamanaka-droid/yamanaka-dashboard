#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const projectsPath = path.join(ROOT, "src/data/projects.json");
const changelogPath = path.join(ROOT, "src/data/changelog.json");

const forbiddenPaths = [
  ".audit-scores.json",
  "FACTS.md",
  "src/data/products.full.json",
  "src/data/vault_stats.json",
  "src/app/products/page.tsx",
  "src/app/login/page.tsx",
  "src/app/lab/page.tsx",
  "src/app/evolution/page.tsx",
  "src/app/showcase/page.tsx",
  "src/app/vigil/page.tsx",
  "src/lib/supabase.ts",
  "scripts/sync-projects.js",
  "scripts/sync-updates.js",
];

const forbiddenSourcePatterns = [
  ["publishable key", /sb_publishable_/i],
  ["Supabase REST endpoint", /supabase\.co\/rest\/v1/i],
  ["legacy Vigil dashboard", /vigil-vert-gamma\.vercel\.app/i],
  ["internal Shoot Agent dashboard", /shoot-agent-v45\.vercel\.app/i],
  ["internal products password", /PRODUCTS_PASSWORD/],
];

const failures = [];
const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
const changelog = JSON.parse(fs.readFileSync(changelogPath, "utf8"));

if (!Array.isArray(projects) || projects.length === 0) failures.push("projects.json must contain public work");

const ids = new Set();
for (const project of projects) {
  if (ids.has(project.id)) failures.push(`duplicate project id: ${project.id}`);
  ids.add(project.id);
  if (project.status !== "live") failures.push(`${project.id}: status must be live`);
  if (project.category === "internal") failures.push(`${project.id}: internal category is forbidden`);
  if (!/^https:\/\//.test(project.url || "")) failures.push(`${project.id}: public https URL is required`);
  const text = JSON.stringify(project);
  if (/PRE-LAUNCH|WORKTREE|ARCHIVED|passphrase|password|access code/i.test(text)) {
    failures.push(`${project.id}: non-public marker found`);
  }
}

for (const rel of forbiddenPaths) {
  if (fs.existsSync(path.join(ROOT, rel))) failures.push(`forbidden public-repo path exists: ${rel}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(?:ts|tsx|js|json|css)$/.test(entry.name) ? [full] : [];
  });
}

for (const file of [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "scripts"))]) {
  if (file === changelogPath || file === __filename) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const [label, pattern] of forbiddenSourcePatterns) {
    if (pattern.test(source)) failures.push(`${path.relative(ROOT, file)}: ${label}`);
  }
}

const changelogText = JSON.stringify(changelog);
for (const [label, pattern] of forbiddenSourcePatterns) {
  if (pattern.test(changelogText)) failures.push(`src/data/changelog.json: ${label}`);
}

if (failures.length) {
  console.error("Public-data gate failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public-data gate passed: ${projects.length} live works, no internal source paths.`);
