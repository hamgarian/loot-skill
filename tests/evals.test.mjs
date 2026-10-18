import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPrompt, raterSection } from '../evals/build-prompt.mjs';
import { score } from '../evals/score.mjs';

const cases = JSON.parse(readFileSync(new URL('../evals/rating-cases.json', import.meta.url), 'utf8'));

test('the eval prompt carries the skill\'s own rater rules and never the answers', () => {
  const section = raterSection();
  assert.match(section, /Rate it somewhere else/);
  assert.match(section, /Near misses get a next step/);
  const prompt = buildPrompt(cases);
  assert.ok(prompt.includes(section));
  for (const c of cases) {
    assert.ok(prompt.includes(c.id));
    assert.ok(!prompt.includes(c.why), `leaks the reason for ${c.id}`);
  }
});

test('every case has a valid expected rating and a unique id', () => {
  const valid = ['COMMON', 'COMMON, near Rare', 'RARE', 'RARE, near Epic', 'EPIC'];
  assert.equal(new Set(cases.map((c) => c.id)).size, cases.length);
  for (const c of cases) assert.ok(valid.includes(c.expected), `${c.id}: ${c.expected}`);
});

test('scoring normalizes labels and counts overrating separately', () => {
  const two = cases.slice(0, 2); // near Rare, Common
  const result = score([{ id: two[0].id, rating: '[common,  near rare]' }, { id: two[1].id, rating: 'RARE' }], two);
  assert.equal(result.correct, 1);
  assert.equal(result.overrated, 1);
  assert.equal(score([], two).rows[0].got, '(missing)');
});
