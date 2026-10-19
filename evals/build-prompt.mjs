#!/usr/bin/env node
// Build the rating eval prompt from SKILL.md's own rater section, so the eval can't drift from the skill.
// Usage: node evals/build-prompt.mjs > prompt.txt   then give prompt.txt to a fresh agent with no other context.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const here = (p) => new URL(p, import.meta.url);

// The rarity rules live in references/assess.md (loaded only for /loot assess); usefulness stays in SKILL.md.
export function raterSection(skill = readFileSync(here('../skills/loot/references/assess.md'), 'utf8')) {
  const m = skill.match(/<!-- rater:start[^>]*-->([\s\S]*?)<!-- rater:end -->/);
  if (!m) throw new Error('references/assess.md has no rater:start/rater:end section');
  return m[1].trim();
}

export function usefulnessSection(skill = readFileSync(here('../skills/loot/SKILL.md'), 'utf8')) {
  const m = skill.match(/<!-- usefulness:start -->([\s\S]*?)<!-- usefulness:end -->/);
  if (!m) throw new Error('SKILL.md has no usefulness:start/usefulness:end section');
  return m[1].trim();
}

export function buildPrompt(cases = JSON.parse(readFileSync(here('./rating-cases.json'), 'utf8'))) {
  const items = cases.map((c) => `- id: ${c.id}\n  ${c.evidence}`).join('\n');
  return `You are the outside rater described below. You have not seen the session these items came from.
Rate every item using only its evidence. Do not use any tools.

${raterSection()}

USEFULNESS RUBRIC (independent of rarity)
${usefulnessSection()}

ITEMS
${items}

Answer with one JSON array and nothing else, one object per item:
[{"id": "...", "met": [1, 3], "rating": "COMMON | COMMON, near Rare | RARE | RARE, near Epic | EPIC", "usefulness": "High | Medium | Low | Unknown"}]
`;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const cases = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : undefined;
  process.stdout.write(buildPrompt(cases));
}
