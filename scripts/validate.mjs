#!/usr/bin/env node
// Checks every stack folder and stacks.json. Node 18+, no dependencies.
// Usage: node scripts/validate.mjs            (empty slots allowed)
//        node scripts/validate.mjs --strict   (all 10 slots must be filled: use before launch)
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REQUIRED_FILES = ["README.md", "stack.json"];
const REQUIRED_KEYS = ["schema", "slug", "title", "summary", "models", "tools", "env", "limits", "data", "human_approval"];
const SECRET = /(sk-[A-Za-z0-9_-]{16,}|sk-ant-[A-Za-z0-9_-]{16,}|AIza[0-9A-Za-z_-]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|xox[abpr]-[A-Za-z0-9-]{10,}|rk_live_[A-Za-z0-9]{10,}|sk_live_[A-Za-z0-9]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;

function readJson(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch (e) { err(`${rel(path)}: invalid JSON (${e.message})`); return null; }
}
const rel = (p) => p.slice(ROOT.length + 1);

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules") continue;
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

// 1) every JSON file parses; no file holds something that looks like a real key
for (const f of walk(ROOT)) {
  if (f.endsWith(".json")) readJson(f);
  if (/\.(md|json|ya?ml|txt|js|mjs|ts|py|toml|env|example)$/.test(f) && SECRET.test(readFileSync(f, "utf8")))
    err(`${rel(f)}: looks like it contains a real API key or token. Use the variable name only.`);
}

// 2) manifest
const manifest = readJson(join(ROOT, "stacks.json"));
const listed = new Set();
if (manifest) {
  if (!Array.isArray(manifest.stacks)) err("stacks.json: needs a \"stacks\" array");
  else {
    if (manifest.stacks.length !== 10) warn(`stacks.json: ${manifest.stacks.length} entries (10 planned)`);
    for (const [i, s] of manifest.stacks.entries()) {
      const at = `stacks.json entry ${i + 1}`;
      if (s.status === "slot") { if (STRICT) err(`${at}: empty slot (--strict needs every stack filled)`); continue; }
      if (s.status !== "ready") { err(`${at}: status must be "slot" or "ready"`); continue; }
      if (!s.slug || !SLUG.test(s.slug)) { err(`${at}: bad slug ${JSON.stringify(s.slug)}`); continue; }
      if (!s.title) err(`${at}: missing title`);
      if (listed.has(s.slug)) err(`${at}: duplicate slug ${s.slug}`);
      listed.add(s.slug);
      if (!existsSync(join(ROOT, "stacks", s.slug))) err(`${at}: folder stacks/${s.slug}/ is missing`);
    }
  }
}

// 3) each stack folder
const dirs = readdirSync(join(ROOT, "stacks")).filter((n) => statSync(join(ROOT, "stacks", n)).isDirectory());
for (const d of dirs) {
  const base = join(ROOT, "stacks", d), at = `stacks/${d}`;
  const isTemplate = d === "_template";
  if (!isTemplate && !SLUG.test(d)) err(`${at}: folder name must be lowercase letters, numbers and dashes`);
  if (!isTemplate && !listed.has(d)) err(`${at}: not listed as "ready" in stacks.json`);
  for (const f of REQUIRED_FILES) if (!existsSync(join(base, f))) err(`${at}: missing ${f}`);
  if (existsSync(join(base, "README.md")) && readFileSync(join(base, "README.md"), "utf8").trim().length < 40)
    err(`${at}/README.md: too short`);
  if (!existsSync(join(base, "stack.json"))) continue;
  const s = readJson(join(base, "stack.json"));
  if (!s) continue;
  for (const k of REQUIRED_KEYS) if (!(k in s)) err(`${at}/stack.json: missing "${k}"`);
  if (s.schema && s.schema !== "weekstart.stack.v1") err(`${at}/stack.json: schema must be weekstart.stack.v1`);
  if (s.slug !== d) err(`${at}/stack.json: slug "${s.slug}" must match the folder name`);
  if (!Array.isArray(s.models) || !s.models.length) err(`${at}/stack.json: models must be a non-empty list`);
  else for (const m of s.models) {
    if (!m.provider || !m.model) err(`${at}/stack.json: each model needs provider and model`);
    else if (/latest|preview$/i.test(m.model)) warn(`${at}/stack.json: model "${m.model}" is not pinned`);
  }
  if (!Array.isArray(s.tools)) err(`${at}/stack.json: tools must be a list`);
  else for (const t of s.tools) if (!t.name || !/^https:\/\//.test(t.docs || "")) err(`${at}/stack.json: each tool needs a name and an https docs link`);
  if (!Array.isArray(s.env) || s.env.some((e) => typeof e !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(e)))
    err(`${at}/stack.json: env must be a list of variable NAMES (like OPENAI_API_KEY), never values`);
  const L = s.limits || {};
  for (const k of ["max_steps", "timeout_seconds", "retries"]) if (typeof L[k] !== "number") err(`${at}/stack.json: limits.${k} must be a number`);
  if (!("monthly_budget_usd" in L)) warn(`${at}/stack.json: no limits.monthly_budget_usd`);
  if (!s.data || typeof s.data.stores_prompts !== "boolean" || !s.data.retention) err(`${at}/stack.json: data needs stores_prompts (true/false) and retention`);
  if (!Array.isArray(s.human_approval)) err(`${at}/stack.json: human_approval must be a list`);
  else if (s.tools?.some?.((t) => t.can_write) && !s.human_approval.length) err(`${at}/stack.json: a tool can write, so human_approval can't be empty`);
}

const ready = listed.size;
for (const w of warnings) console.log("warn  " + w);
for (const e of errors) console.log("FAIL  " + e);
if (errors.length) { console.log(`\n${errors.length} problem(s). Fix them and run again.`); process.exit(1); }
console.log(`OK  ${ready} stack(s) ready, ${dirs.length - (dirs.includes("_template") ? 1 : 0)} folder(s) checked, ${10 - ready} slot(s) open${STRICT ? " (strict)" : ""}`);
