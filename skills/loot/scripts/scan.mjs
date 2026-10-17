#!/usr/bin/env node
// Secret scan run before anything goes public. Exit code 1 when something looks like a secret.
// Usage: node scan.mjs <folder>   (add `loot:allow` to a line to accept a false positive)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const PATTERNS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}|\bgithub_pat_[A-Za-z0-9_]{50,}/],
  ['Anthropic key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI-style key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Stripe live key', /\b[rs]k_live_[A-Za-z0-9]{20,}/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['URL with password', /[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:[^\s@/]{3,}@/i],
  ['hardcoded secret', /\b(?:api[_-]?key|secret|token|passw(?:or)?d|client[_-]?secret)\b["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'out', '.next', '.venv', 'venv', '__pycache__']);
const RISKY_FILE = /^(\.env(\.(?!example$|sample$|template$)[^.]+)?|id_rsa|id_ed25519|id_ecdsa|credentials(\.json)?|.*\.(pem|p12|pfx|key|keystore))$/i;
const MAX_BYTES = 1_000_000;

export function scan(root) {
  const findings = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(path);
        continue;
      }
      const file = relative(root, path).replaceAll('\\', '/');
      if (RISKY_FILE.test(entry.name)) findings.push({ file, line: 0, kind: 'secret-bearing file' });
      if (statSync(path).size > MAX_BYTES) continue;
      const text = readFileSync(path, 'utf8');
      if (text.includes('\0')) continue; // binary
      text.split(/\r?\n/).forEach((content, i) => {
        if (content.includes('loot:allow')) return;
        const hit = PATTERNS.find(([, re]) => re.test(content));
        if (hit) findings.push({ file, line: i + 1, kind: hit[0] });
      });
    }
  };
  walk(root);
  return findings;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = process.argv[2] ?? '.';
  const findings = scan(root);
  // Never print the matched value: the report itself may end up in a log or chat.
  for (const f of findings) console.log(`${f.file}${f.line ? `:${f.line}` : ''}  ${f.kind}`);
  console.log(findings.length ? `\n${findings.length} possible secret(s). Fix them or mark false positives with loot:allow.` : 'clean: no secrets found');
  process.exit(findings.length ? 1 : 0);
}
