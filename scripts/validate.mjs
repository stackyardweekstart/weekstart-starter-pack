#!/usr/bin/env node
// Checks stacks.json and every stack folder. Node 18+, no dependencies.
// Usage: node scripts/validate.mjs            (fewer than 10 stacks is a warning)
//        node scripts/validate.mjs --strict   (exactly 10 stacks, warnings fail too)
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const rel = (p) => p.slice(ROOT.length + 1);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ENTRY_KEYS = ["slug", "title", "what_it_is", "what_it_does", "path"];
const SECRET = /(\bsk-[A-Za-z0-9_-]{16,}|\bsk-ant-[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|xox[abpr]-[A-Za-z0-9-]{10,}|[rs]k_live_[A-Za-z0-9]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

function readJson(p) {
  try { return JSON.parse(readFileSync(p, "utf8")); }
  catch (e) { err(`${rel(p)}: invalid JSON (${e.message})`); return null; }
}
function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules") continue;
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

// 1) every JSON file parses; nothing looks like a real key
for (const f of walk(ROOT)) {
  if (f.endsWith(".json")) readJson(f);
  if (!f.endsWith("validate.mjs") && (/NOTES-for-review|review[-_ ]?notes|(^|\/)REVIEW-[^/]*\.md$|STAMP-NOTES/i.test(rel(f)) || /members\//.test(readFileSync(f, "utf8"))))
    err(`${rel(f)}: internal review notes or member paths must not ship`);
  if (/\.(md|json|ya?ml|txt|js|mjs|ts|py|sh|toml|env|example)$/.test(f) && SECRET.test(readFileSync(f, "utf8")))
    err(`${rel(f)}: looks like it contains a real API key or token. Use the variable name only.`);
}

// 1b) optional private blocklist: --deny <file> (one regex per line). Nothing matching may appear in the repo.
const di = process.argv.indexOf("--deny");
if (di > 0) {
  const pats = readFileSync(process.argv[di + 1], "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  for (const f of walk(ROOT)) if (!f.endsWith("validate.mjs")) {
    const t = readFileSync(f, "utf8");
    for (const p of pats) if (new RegExp(p, "i").test(t)) err(`${rel(f)}: matches a blocked term`);
  }
}

// 2) manifest
const manifest = readJson(join(ROOT, "stacks.json"));
const listed = new Set();
if (manifest) {
  if (!Array.isArray(manifest.stacks)) err('stacks.json: needs a "stacks" array');
  else {
    const n = manifest.stacks.length;
    if (n !== 10) (STRICT ? err : warn)(`stacks.json: ${n} stacks (10 planned)`);
    manifest.stacks.forEach((s, i) => {
      const at = `stacks.json entry ${i + 1}`;
      for (const k of ENTRY_KEYS) if (typeof s[k] !== "string" || !s[k].trim()) err(`${at}: missing "${k}"`);
      for (const k of Object.keys(s)) if (!ENTRY_KEYS.includes(k)) err(`${at}: unexpected field "${k}"`);
      if (!SLUG.test(s.slug || "")) return err(`${at}: bad slug ${JSON.stringify(s.slug)}`);
      if (listed.has(s.slug)) err(`${at}: duplicate slug ${s.slug}`);
      listed.add(s.slug);
      if (s.path !== `stacks/${s.slug}/`) err(`${at}: path must be "stacks/${s.slug}/"`);
      if (!existsSync(join(ROOT, "stacks", s.slug))) err(`${at}: folder stacks/${s.slug}/ is missing`);
    });
  }
}

// 3) each stack folder
for (const d of readdirSync(join(ROOT, "stacks"))) {
  const base = join(ROOT, "stacks", d), at = `stacks/${d}`;
  if (!statSync(base).isDirectory()) continue;
  if (d === "_template") continue;
  if (!SLUG.test(d)) err(`${at}: folder name must be lowercase letters, numbers and dashes`);
  if (!listed.has(d)) err(`${at}: not listed in stacks.json`);
  const readme = join(base, "README.md");
  if (!existsSync(readme)) { err(`${at}: missing README.md`); continue; }
  const text = readFileSync(readme, "utf8");
  if (!/^# \S/m.test(text)) err(`${at}/README.md: needs a "# Title" line`);
  if (!/\*\*What it fixes:\*\*/.test(text) || !/\*\*Who it's for:\*\*/.test(text) || !/^## Example/m.test(text))
    err(`${at}/README.md: needs "**What it fixes:**", "**Who it's for:**" and "## Example"`);
  for (const h of ["Steps", "Copy-paste"]) if (!new RegExp(`^## ${h}`, "m").test(text)) err(`${at}/README.md: needs a "## ${h}" section`);
  // every snippet file the README names must exist, and every snippet must be named
  const files = readdirSync(base).filter((f) => f !== "README.md");
  for (const f of files) if (!text.includes(f)) warn(`${at}: ${f} is not mentioned in README.md`);
  for (const m of text.matchAll(/`([\w.-]+\.(?:py|sh|js|mjs|ts))`/g))
    if (!existsSync(join(base, m[1]))) err(`${at}/README.md: names ${m[1]} but the file is missing`);
}

for (const w of warnings) console.log("WARN ", w);
for (const e of errors) console.log("ERROR", e);
if (errors.length || (STRICT && warnings.length)) {
  console.log(`\nFAILED: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`OK  ${listed.size} stack(s) checked${warnings.length ? `, ${warnings.length} warning(s)` : ""}`);
