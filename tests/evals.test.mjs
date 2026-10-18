import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPrompt, raterSection, usefulnessSection } from '../evals/build-prompt.mjs';
import { score } from '../evals/score.mjs';

const cases = JSON.parse(readFileSync(new URL('../evals/rating-cases.json', import.meta.url), 'utf8'));
const usefulnessCases = JSON.parse(readFileSync(new URL('../evals/usefulness-cases.json', import.meta.url), 'utf8'));

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

test('the rater receives the independent usefulness rubric without expected labels', () => {
  const section = usefulnessSection();
  assert.match(section, /recurring need/);
  assert.match(section, /Common never lowers/);
  const prompt = buildPrompt([{id:'fixture',evidence:'A recurring export fix.',expected:'COMMON',expectedUsefulness:'High',why:'A hidden grading rationale.'}]);
  assert.ok(prompt.includes(section));
  assert.match(prompt, /"usefulness"/);
  assert.ok(!prompt.includes('expectedUsefulness'));
  assert.ok(!prompt.includes('hidden grading rationale'));
});

test('usefulness is scored separately from rarity and missing context stays Unknown', () => {
  const fixtures=[{id:'recurring',expected:'COMMON',expectedUsefulness:'High'},{id:'unknown',expected:'RARE',expectedUsefulness:'Unknown'}];
  const result=score([{id:'recurring',rating:'COMMON',usefulness:'[high]'},{id:'unknown',rating:'COMMON',usefulness:'unknown'}],fixtures);
  assert.equal(result.correct,1);assert.equal(result.usefulness.correct,2);assert.equal(result.usefulness.total,2);
  assert.equal(score([{id:'recurring',rating:'COMMON'}],fixtures).usefulness.rows[0].got,'(missing)');
  assert.equal(score([],cases.slice(0,1)).usefulness.total,0);
});

test('dual-axis fixtures are distinct and use supported labels without answer leakage', () => {
  assert.equal(new Set(usefulnessCases.map(c=>c.id)).size,usefulnessCases.length);
  const prompt=buildPrompt(usefulnessCases);
  for(const c of usefulnessCases){
    assert.ok(['High','Medium','Low','Unknown'].includes(c.expectedUsefulness));
    assert.ok(prompt.includes(c.evidence));assert.ok(!prompt.includes(c.why));
  }
});
