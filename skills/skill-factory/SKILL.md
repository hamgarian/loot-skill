---
name: skill-factory
description: Turn a skill idea into a finished, tested, reviewed and released agent skill in one run - spec, tests first, an independent review against a release checklist, and a release that waits for the user's yes. Use for "skill factory", "/skill-factory", "build and ship a skill for X", "make this a skill and release it", or when loot hands over a drop whose form is a skill.
---

# skill-factory

Builds a skill the way a careful maintainer would, then holds the release until
the user approves it. Works in any agent; each step names the best tool and a
fallback that always works.

Input: a skill idea, or a drop handed over by loot with its evidence (query,
search results, proof, edge). Target folder: where the user says, else
`../<slug>` outside the current repo's history.

## 1. Spec
Write `SPEC.md`: goal, inputs and outputs, and an acceptance checklist where
every line can be tested. Under a page. If loot handed the item over, reuse its
evidence instead of searching again. Ask the user only when two readings of the
idea would produce different skills.

## 2. Build, tests first
- If the agent has a skill-authoring helper (in Claude Code:
  `anthropic-skills:skill-creator`), use it for the skill and its evals.
- Otherwise write `SKILL.md` yourself: frontmatter with `name` (kebab-case)
  and a `description` that says what it does and when to trigger, then the
  steps.
- Scripts get tests before code (`node:test` or pytest). Implement until they
  pass. Write files with your file-editing tool, not shell heredocs.
- Run every test and eval. Keep the exact command and its output for step 4.

## 3. Independent review
The builder doesn't grade its own work.
- **Best:** start a subagent that has not seen this conversation. Give it only
  the target folder and `references/release-checklist.md` with this brief:
  "Review the skill in <folder> against the checklist. Answer PASS or FAIL per
  item with file:line evidence. When unsure, FAIL. Flag any claim the tests or
  evals don't prove."
- **Fallback:** no subagents: for each checklist item, write the strongest case
  that it FAILS before deciding.

Fix every FAIL, rerun tests, review again. Stop when all items pass, or when an
item is blocked on the user (say which and why).

## 4. Release gate
Scan for secrets: `node <loot skill folder>/scripts/scan.mjs <folder>`, plus
`gitleaks dir <folder>` if installed. Then show the user a manifest and stop
for a clear yes:
- repo name, public or private
- version and changelog line
- the files to publish
- test and eval results (command + pass count), the review verdict
- anything skipped

A yes covers exactly that manifest. Then publish from a fresh `git init`:
commit `release vX.Y.Z`, tag, `gh repo create` and push, and install the skill
where the user's agent loads skills. No `gh` or not signed in: print the
commands. Never ask for, type or store credentials.

## 5. Report
One short message in plain language: links, test results, review result, and
what's left for the user.
