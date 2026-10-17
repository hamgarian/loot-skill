#!/usr/bin/env node
// Secret scan run before anything goes public. Exit code 1 when something looks like a secret.
// Usage: node scan.mjs <folder>   (add `loot:allow` to a line to accept a false positive)
// A basic safety net, not a replacement for gitleaks: it does not scan git history or entropy.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PATTERNS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{50,}/],
  ['Anthropic key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI-style key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Stripe live key', /\b[rs]k_live_[A-Za-z0-9]{20,}/],
  ['npm token', /\bnpm_[A-Za-z0-9]{36}\b/],
  ['registry auth token', /_auth(?:Token)?\s*=\s*[^\s$]{8,}/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['URL with password', /[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:[^\s@/]{3,}@/i],
  ['hardcoded secret', /\b(?:api[_-]?key|secret|token|passw(?:or)?d|client[_-]?secret)\b["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];
// Unquoted `KEY=value` lines only mean something in config files; in code they're usually function calls.
const CONFIG_FILE = /^(\.env.*|Dockerfile.*|.*\.(sh|bash|zsh|ini|cfg|conf|toml|properties|ya?ml))$/i;
const CONFIG_SECRET = /\b[\w.-]*(?:api[_-]?key|apikey|secret|token|passw(?:or)?d)[\w.-]*\s*[:=]\s*(?!\$|\{\{)(?![^\s]*(?:your|xxx|example|changeme|placeholder|<))[^\s"'#]{12,}/i;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'out', '.next', '.venv', 'venv', '__pycache__']);
const RISKY_FILE = /^(\.env(\.(?!example$|sample$|template$)[^.]+)?|id_rsa|id_ed25519|id_ecdsa|credentials(\.json)?|.*\.(pem|p12|pfx|key|keystore|tfstate))$/i;
const MAX_BYTES = 1_000_000;

// Returns [{ file, line, kind, warn? }]. `warn` entries need a human look but don't fail the scan.
export function scan(root) {
  const findings = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(path);
        continue;
      }
      if (!entry.isFile()) continue; // symlinks, sockets: never follow out of the folder
      const file = relative(root, path).replaceAll('\\', '/');
      if (RISKY_FILE.test(entry.name)) findings.push({ file, line: 0, kind: 'secret-bearing file' });
      if (statSync(path).size > MAX_BYTES) {
        findings.push({ file, line: 0, kind: 'not scanned (over 1 MB), check by hand', warn: true });
        continue;
      }
      const text = readFileSync(path, 'utf8');
      if (text.includes('\0')) continue; // binary
      const isConfig = CONFIG_FILE.test(entry.name);
      text.split(/\r?\n/).forEach((content, i) => {
        if (content.includes('loot:allow')) return;
        const hit = PATTERNS.find(([, re]) => re.test(content));
        if (hit) findings.push({ file, line: i + 1, kind: hit[0] });
        else if (isConfig && CONFIG_SECRET.test(content)) findings.push({ file, line: i + 1, kind: 'hardcoded secret' });
      });
    }
  };
  walk(root);
  return findings;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const findings = scan(process.argv[2] ?? '.');
  // Never print the matched value: the report itself may end up in a log or chat.
  for (const f of findings) console.log(`${f.warn ? 'warn ' : ''}${f.file}${f.line ? `:${f.line}` : ''}  ${f.kind}`);
  const failures = findings.filter((f) => !f.warn).length;
  console.log(failures ? `\n${failures} possible secret(s). Fix them or mark false positives with loot:allow.` : 'clean: no secrets found');
  process.exit(failures ? 1 : 0);
}
