#!/usr/bin/env node
// Score a rater's answers against evals/rating-cases.json.
// Usage: node evals/score.mjs answers.json [--min 0.8]   (exit 1 below --min)
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const norm = (r) => String(r ?? '').replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();

export function score(answers, cases) {
  const got = new Map(answers.map((a) => [a.id, norm(a.rating)]));
  const rows = cases.map((c) => ({ id: c.id, expected: norm(c.expected), got: got.get(c.id) ?? '(missing)' }));
  rows.forEach((r) => { r.ok = r.got === r.expected; });
  // Overrating is the failure loot exists to prevent, so count it separately.
  const rank = (r) => ['COMMON', 'COMMON, NEAR RARE', 'RARE', 'RARE, NEAR EPIC', 'EPIC'].indexOf(r);
  const overrated = rows.filter((r) => rank(r.got) > rank(r.expected)).length;
  return { rows, correct: rows.filter((r) => r.ok).length, total: rows.length, overrated };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const text = readFileSync(process.argv[2], 'utf8');
  const answers = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
  const cases = JSON.parse(readFileSync(new URL('./rating-cases.json', import.meta.url), 'utf8'));
  const { rows, correct, total, overrated } = score(answers, cases);
  for (const r of rows) console.log(`${r.ok ? 'pass' : 'FAIL'}  ${r.id.padEnd(26)} expected ${r.expected.padEnd(18)} got ${r.got}`);
  console.log(`\n${correct}/${total} correct, ${overrated} overrated`);
  const i = process.argv.indexOf('--min');
  if (i > 0 && correct / total < Number(process.argv[i + 1])) process.exit(1);
}
