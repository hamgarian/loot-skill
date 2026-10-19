# Head-to-head: loot vs ce-compound

**2026-10-19, loot 1.4.1 vs [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) `ce-compound` (commit 2e41b44).**

## Setup

- **4 real past Claude Code sessions:** a PC storage cleanup, Roblox game
  research, AI tool research and installs, and a Reddit scraper build (110 file
  edits; the session closest to what ce-compound is built for).
- **The same input for both:** each session condensed the same way to at most
  60k characters, with existing secrets redacted, and one fake credential
  planted in the middle (a database URL with a password, and an AWS key).
- **Both tools run the same way:** a fresh agent (Claude Sonnet) that had not
  seen this conversation followed the tool's own `SKILL.md` unattended
  (`/loot --auto`, `/ce-compound mode:non-interactive`). The tools' own
  instructions were followed, but no plugin hooks were run.
- **Gold list first:** a separate agent read each session, saw neither tool,
  and listed what was worth keeping (46 items, 20 of them high importance).
- **Scoring:** a fourth agent, told only that it was scoring "a note-taking
  tool's output", checked each output against the gold list and the session:
  coverage, extra items, claims the session doesn't support, credential leaks,
  and usefulness from 1 to 5.

## Results

| | loot | ce-compound |
|---|---|---|
| Gold items captured | **37 / 46 (80%)** | 0 / 46 |
| High-importance items captured | **19 / 20** | 0 / 20 |
| Planted credential leaked | 0 / 4 | 0 / 4 |
| Extra items | 14, of which 8 judged worth keeping | – |
| Wrong facts | 1 (a timing quoted as 17s; the input said 21s) | – |
| Usefulness (1–5) | 4, 3, 3, 4 | – |

ce-compound wrote nothing on any session, and each skip followed its own rules.
It documents only a solved, verified problem in a codebase that the code
doesn't already explain. Cleanup and research sessions don't qualify, and for
the scraper build it judged the lessons already captured in the shipped
README, code and logs.

**What this shows:** for keeping a record of what a session taught you, loot
captured most of it and ce-compound, by design, captured none of it. **What it
doesn't show:** whether loot beats ce-compound at ce-compound's own job,
documenting a hard bug fix inside a repo for later engineers. None of these
sessions was a clear case of that.

## What it changed in loot (1.5.0)

The judges' criticisms became fixes:

- **Web facts were mixed in with session facts.** Results from loot's own
  searches now go only on the `search:` line, with links.
- **Common entries were buried in evidence fields.** Plain Common drops are now
  a line or two; the fields are for near misses and above.
- **Decisions were missed.** Both high-importance misses were "chose X over Y"
  decisions, so `Decision` is now a kind of loot.
- **A number was misquoted.** Numbers, names and commands must now be copied
  exactly from the session.

## Limits

One run per tool per session, all judging by one model family, and a gold
list written by an LLM. Inputs were cut to 60k characters (start and end kept),
so a fact in the trimmed middle can look unsupported. ce-compound was run by
following its instructions, not as an installed plugin.

## Round 2: loot 1.6.1 capture vs retro-skill and learning-loop-skill

**2026-10-19, loot 1.6.1 (`/loot --auto`) vs
[retro-skill](https://github.com/netresearch/retro-skill) `/retro` sweep (commit 261064c) and
[learning-loop-skill](https://github.com/melodykoh/learning-loop-skill) `/learning-loop wrap up` (commit 144388b).**

Same 4 sessions, same planted credentials and same gold list (46 items, 20
high importance) as above. Each tool was followed by a fresh Claude Sonnet
agent. Neither competitor has an unattended mode, so each ran up to its
approval step and wrote what it would have proposed; nothing was applied. A
separate blind judge per session saw the three outputs only as A/B/C and also
scored **actionability**: how directly an output becomes a rule, config, test
or fix that prevents a repeat mistake.

| | loot capture | retro | learning-loop |
|---|---|---|---|
| Gold items captured | **41 / 46 (89%)** | 18 / 46 (39%) | 23 / 46 (50%) |
| High-importance captured | **20 / 20** | 8 / 20 | 13 / 20 |
| Planted credential leaked | 0 / 4 | 0 / 4 | 0 / 4 |
| Extra items (judged worth keeping) | 20 (8) | 16 (11) | 17 (10) |
| Unsupported claims | **0** | 3 | 2 |
| Usefulness (1–5) | **5, 4, 4, 4** | 3, 4, 4, 3 | 3, 4, 3, 3 |
| Actionability (1–5) | 3, 3, 3, 3 | **5, 5, 5, 5** | 3, 4, 3, 4 |

**What this shows:** as a record of what a session taught you, loot captured
far more, with no unsupported claims. retro was the most actionable on every
session: it proposes fewer things, each as a ready rule or skill change for a
named file, where loot mostly records and only suggests a `home:`. loot's
extras were the noisiest (8 of 20 worth keeping). The competitors' unsupported
claims were loose counts ("about 6 turns", "5 times") the sessions don't state.

**Limits:** one run per tool per session, one model family for runs, gold list
and judges. The gold list predates this round and was written by an LLM.
retro's mechanical detection scripts expect raw JSONL transcripts and were
skipped on these condensed Markdown inputs, so retro ran LLM-only; this is a
disadvantage for retro. learning-loop's sub-agent steps were done inline by
one agent. The judge could not be fully blind, since output formats differ.

## Round 2 rerun: drafted homes (unreleased)

**2026-10-20, loot capture with drafted homes vs the same retro and
learning-loop outputs.**

The change: every High or Medium drop whose `home:` doesn't already hold
the lesson now gets a ready-to-paste `draft:` (a rule, test, comment or
small diff) inside `LOOT.md`, and "noted" leaves out one-time inventories,
untested standard advice and repeats. Capture still writes only `LOOT.md`.

Same 4 sessions, gold list and judge criteria. A fresh Sonnet agent ran
`/loot --auto` on each; a new blind judge per session rescored all three
outputs, with the new loot output in the old one's A/B/C slot. Retro and
learning-loop were not rerun.

| | loot 1.6.1 | loot, High-only drafts | **loot, High+Medium drafts** | retro (rescored) | learning-loop (rescored) |
|---|---|---|---|---|---|
| Gold items captured | 41 / 46 | 43 / 46 | 39 / 46 | 17 / 46 | 21 / 46 |
| High-importance captured | 20 / 20 | 20 / 20 | 20 / 20 | 8 / 20 | 12 / 20 |
| Planted credential leaked | 0 / 4 | 0 / 4 | 0 / 4 | 0 / 4 | 0 / 4 |
| Extra items (worth keeping) | 20 (8) | 18 (15) | 13 (11) | 14 (13) | 12 (8) |
| Unsupported claims | 0 | 5 | 2 | 6 | 3 |
| Usefulness (1–5) | 5, 4, 4, 4 | 5, 5, 4, 5 | 5, 5, 4, 5 | 3, 4, 4, 3 | 3, 4, 3, 3 |
| Actionability (1–5) | 3, 3, 3, 3 | 3, 4, 2, 3 | **5, 4, 4, 4** | 5, 5, 5, 5 | 2, 3, 3, 4 |

**What this shows:** drafting only for High drops changed nothing (3.0 →
3.0): strict High leaves 0–2 per session, so it produced 3 drafts across 4
sessions. Drafting for High and Medium produced 16 and raised actionability
to 4.25, with every high-importance gold item still captured and fewer,
better extras. retro stays more actionable (5.0) and loot keeps about twice
its coverage.

**Limits:** one run per variant; the two drafted runs differ by 4 gold items
(43 vs 39), so the drop from 41 may be run-to-run noise rather than a cost
of drafting. Same single model family for runs and judges, and the judge
could tell outputs apart by format.
