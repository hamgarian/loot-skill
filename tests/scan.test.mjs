import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scan } from '../skills/loot/scripts/scan.mjs';

// Fake secrets are built from pieces so this file never trips the scanner itself.
const AWS = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const GH = 'ghp' + '_' + 'a'.repeat(36);

test('finds secrets, skips safe files and allowed lines', () => {
  const dir = mkdtempSync(join(tmpdir(), 'loot-scan-'));
  writeFileSync(join(dir, 'clean.js'), 'const x = 1;\n');
  writeFileSync(join(dir, 'config.js'), `const a = 1;\nconst key = "${AWS}";\n`);
  writeFileSync(join(dir, 'allowed.md'), `example: ${GH} loot:allow\n`);
  writeFileSync(join(dir, '.env'), 'X=1\n');
  writeFileSync(join(dir, '.env.example'), 'X=\n');
  mkdirSync(join(dir, 'node_modules'));
  writeFileSync(join(dir, 'node_modules', 'dep.js'), `"${GH}"\n`);
  mkdirSync(join(dir, 'sub'));
  writeFileSync(join(dir, 'sub', 'db.txt'), 'postgres://admin:hunter22@db.internal/app\n');

  const found = scan(dir).map((f) => `${f.file}:${f.line}:${f.kind}`).sort();
  assert.deepEqual(found, [
    '.env:0:secret-bearing file',
    'config.js:2:AWS access key',
    'sub/db.txt:1:URL with password',
  ]);
});

test('the published skill folder is clean', () => {
  assert.deepEqual(scan(new URL('../', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), []);
});
