# Changelog

## 1.7.0 — 2026-10-20

- Capture drafts the fix: each High or Medium drop whose `home:` doesn't already hold the lesson gets a ready-to-paste `draft:` (rule, test, comment or small diff) in `LOOT.md`. Capture and `--auto` still write only `LOOT.md`; a follow-up applies a draft only with the user's yes. In a rerun of head-to-head round 2, actionability rose from 3.0 to 4.25 with 20/20 high-importance items kept.
- "noted" leaves out one-time inventories, untested standard advice, delivered steps and repeats.
- Homes name the agent's own instruction file (`AGENTS.md`, `CLAUDE.md` or other), not only Claude Code's.

## 1.6.1 — 2026-10-19

- Move the rarity assessment (evidence, outside rater, checklist) into `references/assess.md`, loaded only for `/loot assess` and publishing. `SKILL.md` drops from 342 to under 260 lines, so the default capture reads less. The evals now build their rarity prompt from that file.
- Capture is strict about High usefulness, since no outside rater checks it: High needs a quote or count from the session, and more than two Highs in a session must be explained.
- A Common item chosen for publication ships as a guide: no "new/first/only" claims, closest alternatives linked, and the manifest says so.
- Restore `argument-hint` as a top-level frontmatter field so Claude Code shows the `/loot` hint.
- Re-render the demo to show capture mode: usefulness ratings, rarity left for `/loot assess`.

## 1.6.0 — 2026-10-19

- Make `/loot` a lightweight capture pass; `/loot capture` explicitly selects it and `/loot assess` opts into researched rarity and independent review.
- Add independent High/Medium/Low/Unknown usefulness ratings. Unassessed rarity stays Not assessed; useful Common work may be explicitly selected for publication.
- Accept traceable historical checks within their demonstrated scope, label evidence provenance, and reserve reruns for changed conditions or current validation claims.
- Make ordinary `--auto` lightweight; explicit `assess --auto` retains full assessment. Both write only `LOOT.md`, even with shipping arguments.
- Add dual-rating fixtures and scoring while preserving the original rarity-only scoring interface.

The original rarity-only and head-to-head benchmark results remain historical; they have not been rerun as comparative measurements of this capture mode.
