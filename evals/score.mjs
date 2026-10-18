#!/usr/bin/env node
// Score a rater's answers against evals/rating-cases.json.
// Usage: node evals/score.mjs answers.json [--cases cases.json] [--min 0.8]
// --min applies independently to both axes when usefulness expectations exist.
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
  const usefulnessGot = new Map(answers.map((a) => [a.id, norm(a.usefulness)]));
  const usefulnessRows = cases.filter((c) => c.expectedUsefulness !== undefined).map((c) => {
    const expected = norm(c.expectedUsefulness);
    const actual = usefulnessGot.get(c.id) || '(missing)';
    return {id:c.id,expected,got:actual,ok:actual===expected};
  });
  return { rows, correct: rows.filter((r) => r.ok).length, total: rows.length, overrated,
    usefulness: {rows:usefulnessRows,correct:usefulnessRows.filter((r)=>r.ok).length,total:usefulnessRows.length} };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const text = readFileSync(process.argv[2], 'utf8');
  const answers = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
  const casesIndex = process.argv.indexOf('--cases');
  const cases = JSON.parse(readFileSync(casesIndex > 0 ? process.argv[casesIndex + 1] : new URL('./rating-cases.json', import.meta.url), 'utf8'));
  const { rows, correct, total, overrated, usefulness } = score(answers, cases);
  for (const r of rows) console.log(`${r.ok ? 'pass' : 'FAIL'}  ${r.id.padEnd(26)} expected ${r.expected.padEnd(18)} got ${r.got}`);
  console.log(`\n${correct}/${total} correct, ${overrated} overrated`);
  for (const r of usefulness.rows) console.log(`${r.ok ? 'pass' : 'FAIL'}  usefulness ${r.id}: expected ${r.expected}, got ${r.got}`);
  if (usefulness.total) console.log(`${usefulness.correct}/${usefulness.total} usefulness correct`);
  const i = process.argv.indexOf('--min');
  if (i > 0 && (correct / total < Number(process.argv[i + 1]) || (usefulness.total > 0 && usefulness.correct / usefulness.total < Number(process.argv[i + 1])))) process.exit(1);
}
