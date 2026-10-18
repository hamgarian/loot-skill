---
name: loot
description: >
  Find everything worth keeping from this AI session (the main build, side
  discoveries, techniques, the feedback the user taught you), rate each by
  usefulness separately from rarity, save them to LOOT.md with a lightweight
  capture pass, and turn a selected item
  into finished public work: a GitHub repo with docs and a logo, an agent
  skill, a blog post, a gist, a demo video. Also reads past Claude Code and
  Codex sessions. Use when the user says "loot", "/loot", "what's worth
  shipping from this", or "turn this into a repo / skill / blog post".
metadata:
  argument-hint: "[capture | assess | number | all | \"topic\" | review | --auto | --list | <session file>]"
license: MIT
---

# loot

Every session drops loot. Most of it dies in the chat log. Your job: find it,
write it down, judge its usefulness separately from its public novelty, and
ship a selected piece after the user says yes. A familiar technique can still
be worth preserving or publishing; rarity is not a verdict on its usefulness.

Most of loot's value is `LOOT.md`: a running record of everything the user
figured out. Publishing is the exception.

Loot is **any valuable part** of the session, not only side discoveries:

| Kind | What it looks like | Usual form |
|---|---|---|
| **Build** | the app, tool or script the session was about | repo |
| **Component** | a piece that works outside this project (a hook, a parser, a config, a prompt) | repo or gist |
| **Technique** | a trick, fix or method (made X 4× faster, got Y to work locally) | post + gist or repo |
| **Know-how** | corrections and feedback the user gave you that made the output good | skill |
| **Story** | the path from problem to result, dead ends included | post |
| **Data** | benchmarks, comparisons, measurements | post or repo README |
| **Decision** | what was chosen over what, and why (tool A over B, approach X dropped) | `LOOT.md`, or the post that explains it |

One session often holds several items. A single item often deserves several
forms (repo + post + demo).

## Modes

| Command | Does |
|---|---|
| `/loot`, `/loot capture` | lightweight: scan, rate usefulness, save to `LOOT.md`, then stop; no web search or outside rater |
| `/loot "<topic>"` | capture one thing only: "the ffmpeg trick" |
| `/loot assess` | assess usefulness and researched rarity, using an outside rater; show publication candidates |
| `/loot 2` | prepare drop 2 for publication, even if Common; assess only that drop if needed, then use the release gate |
| `/loot all` | assess if needed, then prepare every Rare-or-better drop; final publication still needs manifest approval |
| `/loot --list` | list recent past sessions to pick from |
| `/loot <session file>` | capture a past Claude Code/Codex `.jsonl`, or Markdown/text transcript |
| `/loot review` | refresh usefulness and evidence in the journal; research rarity only when asked (see step 6) |
| `/loot --auto` | unattended capture: scan, rate usefulness, write only `LOOT.md`, then stop |
| `/loot assess --auto` | unattended full assessment, including searches and outside rating; write only `LOOT.md`, then stop |

**`--auto`** always overrides shipping arguments: never ask, forge, publish,
or edit any file except `LOOT.md`. Default capture uses steps 1 and 2a only;
explicit `assess` also uses step 2b with searches and an outside rater.
Use the project's root for `LOOT.md` when known, otherwise the current
working directory, consistently across all modes. Append and stop.
`home:` suggestions are listed but not offered or written. If the session is
already in `LOOT.md` and nothing new turned up, write one `seen again` line,
not a second table.

## 1. Scan

Read the whole conversation and the files it touched. For a past session, or
when earlier parts of this one were summarized, read the transcript instead:

```
node <this skill's folder>/scripts/transcript.mjs list          # recent Claude Code + Codex sessions
node <this skill's folder>/scripts/transcript.mjs read <file>   # condensed text, secrets redacted
```

This session's own transcript is the newest file in
`~/.claude/projects/<project>/`. If you couldn't read past a summary, say so in
the table: early discoveries may be missing. List candidates. For each
one, write down what it does and the proof that it works (test, benchmark,
before/after, the user's reaction).

Keep useful local lessons even when they only apply to this user's setup or
an equivalent already exists. Separate journal value from publication
eligibility. Exclude private/client work and mostly third-party code from
public candidates; preserve only a sanitized general lesson locally when
that is appropriate. Never put secrets, credentials or personal data in the table.

## 2a. Rate usefulness — every capture or assessment

Usefulness means value to this user or workflow, not originality or proof of
market demand. State the context and one concrete reason. Use these labels:

<!-- usefulness:start -->
| Usefulness | Evidence to support it |
|---|---|
| **High** | A recurring need, substantial observed rework avoided, or an important recurring failure prevented. Cite the repeated use, correction, or observed cost. |
| **Medium** | A concrete likely reuse or mistake avoided, but recurrence or substantial impact is not yet established. |
| **Low** | A one-off detail with little expected carry-forward value; usually a one-line note. |
| **Unknown** | Not enough context to judge future value. Say what is missing rather than treating missing evidence as low value. |

Use observed context, including user corrections and traceable historical
checks. Do not invent hours saved, future adoption, or recurrence. High
usefulness never raises rarity automatically, and Common never lowers
usefulness automatically. Rate separately even when one axis is Unknown.
<!-- usefulness:end -->

In capture mode, keep each entry short: finding, usefulness + reason,
evidence source/limits, and an existing or proposed `home:` when helpful.
For historical evidence, name the inspected source and date when known;
mark missing metadata unknown, state that it was not rerun, and bound the
claim to what that record demonstrates. Session discovery (`--list`) does
not rate items.
Set rarity to **Not assessed** unless a prior assessment is available; cite
its date and preserve its limits. Do not search, dispatch a rater, rerun
tests, or ask what to publish merely to save a lesson. Write the journal as
described below, show a concise table, then stop.

## 2b. Assess public rarity — explicit assessment or publication only

Research and independent review are for a public-novelty claim or a selected
publication, not the cost of remembering a lesson. Rarity measures the
evidence for distinction from alternatives; it does not decide whether the
user is allowed to publish useful familiar guidance.

<!-- rater:start (evals/build-prompt.mjs reads this section) -->
**Collect evidence** for each candidate:

- **query**: what a stranger with this problem would type into a search box
- **search**: run it (web, GitHub, npm/PyPI) and list the closest results with
  links. Search for what it *does*, not for its name. No search tool: "not checked".
- **proof**: a test, benchmark or before/after that actually happened in the
  current or an earlier session, with a traceable command/result, artifact,
  or recorded before/after, or "none". Mark it **fresh** (run now),
  **recorded historical** (source inspected, not rerun), **reported historical**
  (attributed account without inspected underlying results), or **absent**.
  Recorded historical checks count toward proof within their demonstrated
  scope; a fresh rerun is not required merely because evidence is old.
  Record the source/date, relevant revision/environment when available, and
  limits. Recheck when changed code, dependencies or a current-release claim
  makes freshness material. Reported checks can inform usefulness, but do
  not treat an uninspected summary as verified execution or benchmark output.
  Never reconstruct proof from memory or invent missing details.
- **edge**: what it does that the closest result doesn't, measured if possible

**Rate it somewhere else.** For full assessment, if you can start a subagent,
give it only the candidates, usefulness context and sourced evidence, never
the conversation, with this brief:
"Rate each item against the bar below. Argue for Common first and raise an
item only when its evidence meets the bar. When unsure, rate lower. Use only
the evidence given; never add or assume any. For each item, list which of
checklist items 1–5 are met, then give the rating those imply. For any item
one requirement short of the next tier, name the cheapest evidence that would
raise it. Separately rate usefulness High, Medium, Low or Unknown from the
given user/workflow context; rarity and usefulness must not influence each
other. Count recorded historical evidence within its scope, and preserve
its age and limits instead of demanding a fresh rerun by default." If you
can't, write the strongest case that each item is Common before rating it.
If the subagent fails to start (for example a model error), retry once with
another model before falling back, and say in the table header which rater
was used.

| Rarity | Needs all of | Forms |
|---|---|---|
| **Common** | anything below Rare | retain according to usefulness; user-selected publication is allowed without novelty claims |
| **Rare** | a real query; a cited search that found nothing equivalent, **or** a measured edge over the closest result; proof it works | gist, short post, or a small repo or skill |
| **Epic** | Rare, plus a measured edge over a named alternative, and it runs from a clean clone | repo or skill, post, demo, launch drafts |

Place each item with this checklist, not a gut call:

1. a real query
2. a cited search that found nothing equivalent, **or** a measured edge over the closest result
3. proof it works
4. a measured edge over a named alternative
5. it runs from a clean clone

1–3 met: Rare. All 5: Epic. Exactly one missing from the next tier up is a
near miss (see below). A search for the name only, or no search tool,
counts as item 2 missing.

Hard rules:

- "not checked" or "no proof" means Common, however good it feels.
- Something equivalent exists and the edge isn't measured: Common. An edge
  argued from other projects' READMEs is not measured.
- Ties round down.
- **Near misses get a next step.** An item one requirement short of the next
  tier is labelled `[COMMON, near Rare]` or `[RARE, near Epic]` and gets a
  `next:` line: the cheapest evidence that would raise it, and roughly how
  long it takes. That turns a "no" into a to-do the user can choose. It's
  only a near miss if that evidence could plausibly exist. If the closest
  result already does the same thing (official docs describing the same
  fix, a standard setting, a tool that does it generically), it's plain
  Common: timing your copy against the documented method is not an edge.
- The author's opinion of the item is not evidence.
- Expect nearly everything to be Common. If more than one item in a session
  rates above Common, say why this session is the exception.
- Common describes public distinction only. A Common item can have High
  usefulness and deserve a detailed reusable skill or an explicit publication.
<!-- rater:end -->

In full assessment, show both ratings, with evidence for anything above
Common, and ask what to prepare only if the user has not already selected it:

```
LOOT: 3 drops
1. [RARE | usefulness: High] remotion-ae-transitions: After Effects-style transitions in Remotion, fully local
   useful because: the workflow repeatedly needed these transitions
   query: "remotion after effects transitions"
   search: @remotion/transitions (slides, fades, wipes), one paid template pack; none do these
   proof: 6 transitions rendered and approved in the session
   edge: not measured, so not Epic → gist + short post
   next: render the same 3 shots with @remotion/transitions and compare; then a clean-clone run (~45 min)
2. [COMMON | usefulness: High] ffmpeg two-pass trick: recurring export-size fix; documented elsewhere → LOOT.md
3. [COMMON | usefulness: Medium] custom font loader: avoids redoing this project's setup → LOOT.md
Ship which? (numbers, "all", or "none")
```

Show at most 7 drops, strongest first. Everything else gets one line under
"noted".

Size journal entries by usefulness, not rarity. Low-value one-offs need a
line; important recurring lessons may need enough detail to apply safely.
Keep query/search/proof/edge detail for near misses, higher rarity claims,
and publication assessment rather than burdening every captured note.

Facts in the journal come from the session. Copy numbers, names and commands
exactly as they appear there; never round or reconstruct them. Anything you
learned from your own web search goes only on the `search:` line, with its
link, so a reader can tell the session's facts from the web's.

Append the findings to `LOOT.md` in the project root when known, otherwise
the current working directory (create it
if missing), dated. A drop earns a full entry only if a future session would
go wrong, or redo real work, without it. Otherwise it's a one-line "noted"
entry. The journal is only useful if it stays readable.

- **Seen it before?** Search `LOOT.md` for the same root idea first. If it's
  there, write `seen again (first: <date> #<n>)` plus only what's new, instead
  of a second full entry. Repeat sightings are evidence for `/loot review`.
- **A better home.** `LOOT.md` is the fallback, not always the best place. For
  each useful drop, add `home:` when a narrower place would do more good:
  a rule the agent keeps breaking → `CLAUDE.md` / `AGENTS.md`; an invariant →
  a test; the reason behind odd code → a comment next to it; why a change was
  made → the commit message. In capture, list the suggestion and stop. During
  an action-oriented follow-up, offer to write it and do so only with the
  user's authorization for that item. These stay local; nothing is published.

## 3. Forge

For each chosen item, build the finished thing in a **new folder outside the
current repo's history** (default `../<slug>`, or where the user says). Read
`references/forge.md` for the checklist of each form. In short:

- **Generalize it.** Remove project names, hardcoded paths, client details and
  dead code. It must run from a clean clone with the README's steps. Run it.
- **Name it.** Short, memorable, says the job. Check that the name is free:
  `gh search repos <name>`, `npm view <name>` (exit 1 means free).
- **Tagline.** One line that tells a stranger what it does and for whom.
- **Logo.** Simple, one or two colors, readable at 16px, works on light and dark.
- **Social preview.** A 1280×640 card (logo, name, tagline) so shared links
  show an image instead of a blank GitHub card.
- **README.** Result first, then quickstart, then how it works.
- **Proof.** A test, a benchmark, or a before/after. Never invent numbers.
- **Read cold.** The writer misses its own filler. Give each README and post
  to a fresh agent that hasn't seen the session (or, without one, reread it
  as a stranger) with `references/forge.md` → "Read cold". Fix what it flags.

**Skills:** if the chosen form is a skill, follow the `skill-factory` skill
that ships next to this one (`../skill-factory/SKILL.md`), handing it the item's
evidence (query, search results, proof, edge) as the starting spec. Skip steps
3–5 for that item: skill-factory tests, reviews and gates the release itself.

## 4. Check (never skip)

1. Scan every folder you will publish for secrets:
   - always: `node <this skill's folder>/scripts/scan.mjs <folder>`
   - also, if `gitleaks` is installed: `gitleaks dir <folder>`, and
     `gitleaks git <folder>` when the folder has git history.

   Fix every finding, or mark a false positive with `loot:allow` on that line
   and say why. Look at every `warn` line by hand. Never push existing git
   history that gitleaks hasn't scanned; without gitleaks, publish from a fresh
   `git init` instead.
2. Read every file that will be published. Look for personal data, client
   names, internal hostnames, private repo links and code under another license.
3. Show the user a manifest: each destination (repo name, public or private,
   blog draft or live), the files, the tagline. Ask for a clear yes. A yes
   covers exactly that manifest, nothing more.

## 5. Ship

Read `references/ship.md` for commands and fallbacks. Use your own tools first;
fall back to handing the user a ready-to-run command or file.

- Repo: `gh repo create`, description, topics, push.
- Post: dev.to or Hashnode as a **draft** when a token is already configured;
  otherwise a Markdown file. Medium: Markdown plus import instructions.
- Launch posts (Show HN, X, Reddit): drafts in a gitignored `launch/` folder,
  for Epic by default and for Rare when the user asks. Never post them.
- Finish with links to everything shipped and anything left for the user.

## 6. Review (`/loot review`)

Ratings from one session are a guess. Evidence builds up over time:

1. Read `LOOT.md`. Group entries that are the same thing seen again (same
   root idea, even if worded differently).
2. Refresh usefulness and evidence when something changed: it came up in 3 or more sessions,
   it gained proof (users, a benchmark, someone asked for it), or a new search
   finds nothing equivalent anymore. In ordinary review, preserve prior rarity
   with its date or mark it Not assessed; use no web search or outside rater.
   If the user requests a rarity reassessment, use step 2b and its outside rater.
3. Mark what went stale: an entry that's no longer true (the bug got fixed
   upstream, the tool it beat added the feature, a later entry replaced it)
   gets `stale: <date> #<n>, <why>` in the review section, so a future
   session doesn't act on it.
4. Show what moved on each axis and why. Write a dated "review" section to
   `LOOT.md`; never rewrite old entries. Offer publication only when the user
   is exploring publication; useful Common items remain eligible if selected.

## Use what the agent has

| Need | Best | Fallback that always works |
|---|---|---|
| Logo / cover image | your own image generation or an image MCP, if you have one | hand-written SVG |
| Secret scan | `gitleaks` (also covers git history) | bundled `scripts/scan.mjs` |
| Demo video | Remotion (Node) | screenshots + GIF |
| Screenshots | a browser tool | ask the user for one |
| "Does it exist?" (assessment only) | web search | mark "not checked" (caps assessed rarity at Common; usefulness stays independent) |
| Past or summarized sessions | `scripts/transcript.mjs` (Claude Code, Codex) | ask the user to paste or export the conversation |
| Independent rating | a subagent that never sees the conversation | the strongest case for Common, written first |
| Publish repo | `gh` CLI | print the commands |
| Publish post | the platform's API with an existing token | Markdown file |

## Rules

- Nothing goes public without the user's yes on the exact manifest.
- Never ask for, type or store credentials. If a tool isn't signed in, fall back.
- Never publish secrets, personal data, or client or employer work.
- Respect licenses: don't relicense code you didn't write.
- No invented proof: no fake benchmarks, users, quotes or star counts.
- Write in the user's voice from the chat, not like a press release.
