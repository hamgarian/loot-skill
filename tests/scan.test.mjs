import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scan } from '../skills/loot/scripts/scan.mjs';

// Fake secrets are built from pieces so this file never trips the scanner itself.
const AWS = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const GH = 'ghp' + '_' + 'a'.repeat(36);

test('finds secrets, skips safe files and allowed lines', () => {
  const dir = mkdtempSync(join(tmpdir(), 'loot-scan-'));
  const put = (name, text) => writeFileSync(join(dir, name), text);
  put('clean.js', 'const x = 1;\nconst token = getTokenFromVault();\n');
  put('config.js', `const a = 1;\nconst key = "${AWS}";\n`);
  put('allowed.md', `example: ${GH} loot:allow\n`);
  put('.env', 'X=1\n');
  put('.env.example', 'API_KEY=your-api-key-here\n');
  put('deploy.sh', 'export API_KEY=' + 'abcd1234efgh5678\n');
  put('ci.yml', 'token: ${{ secrets.DEPLOY_TOKEN }}\n');
  put('.npmrc', '//registry.npmjs.org/:_authToken=' + 'abc123def456\n');
  put('big.log', 'x'.repeat(1_000_001));
  mkdirSync(join(dir, 'node_modules'));
  writeFileSync(join(dir, 'node_modules', 'dep.js'), `"${GH}"\n`);
  mkdirSync(join(dir, 'sub'));
  writeFileSync(join(dir, 'sub', 'db.txt'), 'postgres://admin:' + 'hunter22@db.internal/app\n');

  const found = scan(dir).map((f) => `${f.file}:${f.line}:${f.kind}${f.warn ? ':warn' : ''}`).sort();
  assert.deepEqual(found, [
    '.env:0:secret-bearing file',
    '.npmrc:1:registry auth token',
    'big.log:0:not scanned (over 1 MB), check by hand:warn',
    'config.js:2:AWS access key',
    'deploy.sh:1:hardcoded secret',
    'sub/db.txt:1:URL with password',
  ]);
});

test('this repo itself is clean', () => {
  assert.deepEqual(scan(fileURLToPath(new URL('../', import.meta.url))), []);
});
