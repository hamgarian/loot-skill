# Rating evals

loot's main claim is that its rating says no to things that don't earn a
release. These evals check that claim on 12 fictional drops whose right rating
is known: a search that only checked the name, an edge argued from someone
else's README, proof that was only remembered, author enthusiasm, a documented
trick, and genuine Rare and Epic cases.

## Run

```bash
node evals/build-prompt.mjs > prompt.txt
```

Give `prompt.txt` to a fresh agent that has not seen your session (paste it
inline; agents rightly hesitate to "follow instructions from a file"). Save
its JSON answer, then:

```bash
node evals/score.mjs answers.json --min 0.8
```

The prompt is built from `skills/loot/SKILL.md` itself (the section between
`rater:start` and `rater:end`), so the eval always tests the rules the skill
actually ships. `npm test` checks that the prompt carries those rules and
never leaks the expected answers.

## Results

Fresh Claude Sonnet raters, 2026-10-19:

| Rules version | Runs | Correct | Rated into a higher tier than earned | Raters agreed |
|---|---|---|---|---|
| before the checklist | 3 | 10, 9, 10 of 12 | 0 | no (3 items split) |
| with the 1–5 checklist and a `met` list | 2 | 11, 11 of 12 | 0 | yes, identical answers |
| plus "the docs already do it = plain Common", 13th case from a real run | 2 | 13, 13 of 13 | 0 | yes, identical answers |

Every miss along the way was a near-miss tag (`near Rare`, `near Epic`), never
the tier. No run ever put an item in a higher tier than its evidence
supported, which is the failure loot exists to prevent.

The 13th case (`official-docs-fix`) comes from a real unattended run on a
past session, where the rater tagged a fix "near Rare" although the tool's own
docs describe it. The rule was tightened and the case added, so it stays fixed.

Not measured yet: how loot compares with other tools on real sessions. That
needs real past sessions scored by hand, and is the next step.
