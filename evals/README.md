# Rating evals

loot's main claim is that its rating says no to things that don't earn a
release. The original evals check that claim on 13 drops whose expected rarity
is known: a search that only checked the name, an edge argued from someone
else's README, proof that was only remembered, author enthusiasm, a documented
trick, and genuine Rare and Epic cases.

The separate `usefulness-cases.json` set checks the two axes independently:
Common/High for recurring documented fixes, Rare/Low for a novel one-off,
Unknown when workflow context is missing, and recorded versus merely reported
historical checks. These are synthetic evidence scenarios, not empirical
measurements of saved time or market novelty.

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

For the independent usefulness/historical-evidence set:

```bash
node evals/build-prompt.mjs evals/usefulness-cases.json > usefulness-prompt.txt
# Give that prompt to a fresh agent; save only its returned JSON.
node evals/score.mjs answers.json --cases evals/usefulness-cases.json --min 1
```

The scorer reports rarity and usefulness separately; `--min` applies to each
axis with expected labels. Original rarity-only fixtures and answers remain
supported. A missing usefulness answer is not silently scored as Low.

## Results

### 1.6.0 usefulness and historical-evidence evaluation

One fresh agent, given the generated prompt without expected answers, scored
**6/6 rarity and 6/6 usefulness**, with zero rarity overrates. Its raw answers
are in [usefulness-answers.json](usefulness-answers.json). This is one synthetic
run, not a reliability estimate across models or a comparative benchmark.

The same agent separately simulated default capture, `--auto` with a shipping
number, unattended full assessment, and ordinary journal review. It selected
no search/outside rater for capture and review, full assessment for explicit
`assess`, and journal-only writes for all auto modes. It preserved the
historical source's scope without claiming a new run. No real journal or
external publication was produced by those mode simulations.

The review identified and corrected an old example with an incorrect near-miss
label, inconsistent journal locations, and ambiguous usefulness wording for
session discovery. Capture now explicitly records missing evidence metadata
as unknown rather than reconstructing it.

### Historical rarity-only results

Fresh Claude Sonnet raters under the earlier rules, 2026-10-19:

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

The [historical head-to-head](head-to-head.md) compared the older workflow on
real sessions. That comparison has not been rerun for 1.6.0's lightweight
capture mode. The current unit suite covers the scanner, transcript reader,
prompt construction and independent-axis scoring; instruction-following is
evaluated through the separately documented fresh-agent exercise.
