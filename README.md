<p align="center"><img src="assets/logo.svg" width="96" alt=""></p>
<h1 align="center">loot</h1>
<p align="center"><b>Every AI session drops loot. <code>/loot</code> finds it, polishes it, ships it.</b></p>

<p align="center"><img src="assets/demo.gif" width="720" alt="loot scanning a session, rating all four drops Common, and saving them to LOOT.md"></p>

You spend an evening with Claude or Codex and find something good: a trick that
makes a framework 4× faster, a pile of corrections that finally got Remotion to
make After Effects-style edits, a tool that just works. Then you close the tab,
and it dies in the chat log.

**loot** is an agent skill that stops that. Run it at the end of a session and it:

1. **Scans** the whole session for anything worth keeping: the main build,
   side discoveries, techniques, and the feedback you taught the agent.
2. **Writes it all down** in `LOOT.md`, a running journal of what you figured out.
   That's most of the value.
3. **Rates usefulness** from your workflow, separately from public novelty.
   Ordinary capture needs no web search or outside rater. Ask `/loot assess`
   for a researched rarity rating and independent assessment before publishing.
4. **Forges** a selected drop into finished work: a clean repo with
   README, logo and tests, an agent skill, a blog post, a gist, a demo video.
5. **Checks** for secrets and private data, then **ships** only after you say yes.

## Usefulness and rarity are separate

**Usefulness** answers “will this help us again?” **Rarity** answers “what
evidence distinguishes it from public alternatives?” A Common technique can
have High usefulness. A novel one-off can have Low personal usefulness.

| Usefulness | Meaning for this user or workflow |
|---|---|
| **High** | Recurring need, substantial observed rework avoided, or an important recurring failure prevented. |
| **Medium** | Concrete likely reuse or a known mistake avoided; repeat impact not yet established. |
| **Low** | A one-off detail with little expected carry-forward value. |
| **Unknown** | Insufficient context; missing evidence is not automatically low value. |

### Capture first

`/loot` and `/loot capture` preserve lessons quickly. They rate usefulness,
record evidence and its limits, save `LOOT.md`, and stop. They do not run web
searches, call a separate rater, rerun tests or ask what to publish. Rarity
stays **Not assessed**, or retains a dated previous assessment.

### Assess rarity when needed

`/loot assess` adds searches and an independent rater. These labels describe
public distinction, not whether the work deserves to be remembered:

| Rarity | Needs all of | What you get |
|---|---|---|
| **Common** | anything below Rare | retain according to usefulness; publish if explicitly selected, without unsupported novelty claims |
| **Rare** | a real search query; a search that found nothing equivalent (with links), or a measured edge over the closest result; proof it works | gist, short post, or a small repo or skill |
| **Epic** | Rare, plus a measured edge over a named alternative, and it runs from a clean clone | repo or skill, post, demo, launch drafts |

In a full rarity assessment, "not checked" or "no proof" means Common.
Unassessed capture entries are not automatically Common. Ties round down. Anything rated
above Common shows its evidence, so you can disagree. A near miss
(`[COMMON, near Rare]`) comes with a `next:` line: the cheapest evidence that
would raise it and roughly how long it takes.

Historical checks count when their source is traceable and their scope is
clear. Label evidence **fresh**, **recorded historical**, **reported historical**
or **absent**. Inspected historical command/results or artifacts can establish
working proof without a new run. An uninspected summary can inform usefulness
but is not verified execution. Recheck when code, dependencies or the claim
has changed, or before making a current-release validation claim.

### loot rates itself Common

The first version rated itself Epic, which was flattering itself.
[Feedback](posts/loot.md#the-filter-was-flattering-me) pointed that out, the
rules above replaced the vibes, and here is the re-rated table from the
session that built this repo ([LOOT.md](LOOT.md)):

```
LOOT: 4 drops
1. [COMMON] loot-skill: an agent skill that finds and ships the valuable parts of AI sessions
   search: 6 similar tools (see below); its differences are real but not measured
2. [COMMON] scan.mjs: zero-dependency secret scanner → gitleaks does far more
3. [COMMON] naming a dev tool: hatch → afterchat → sidequest → loot → only interesting to us
4. [COMMON] scratch preview server for checking the logo → throwaway
Nothing above Common. 4 drops saved to LOOT.md.
```

It was published because it was useful and built in the open. Common is not
a publication ban: an explicit user selection can ship familiar guidance,
provided its claims are accurate and the release checks pass. The table above
is historical and predates the separate usefulness rating.

## Install

**Claude Code**

```
/plugin marketplace add hamgarian/loot-skill
/plugin install loot@loot-skill
```

**Other agents that support [Agent Skills](https://github.com/vercel-labs/skills)** (Codex, Cursor, Gemini CLI, …)

```bash
npx skills add hamgarian/loot-skill -g                  # every project
npx skills add hamgarian/loot-skill -g -a codex         # one specific agent
```

Built and tested in Claude Code. Other agents should work since it's a plain
`SKILL.md`; if one doesn't, please open an issue.

**ChatGPT, claude.ai or any chat app:** paste
[`skills/loot/SKILL.md`](skills/loot/SKILL.md) and say "run loot on this conversation".

## Your first loot

The output below is an illustrative example; yours will differ.

**1. Work as usual.** Build the thing, fix the bug, argue with the agent until
the output is right. loot needs nothing from you during the session.

**2. Type `/loot` when you're done.** It reads the session and saves a short
capture table, for example:

```text
LOOT: 2 drops — capture
1. [usefulness: High | rarity: Not assessed] Trim feedback audio to its audible attack.
   useful because: the same silent lead-in caused repeated sync corrections.
   evidence: recorded historical render notes, inspected; audio not auditioned now.
2. [usefulness: Medium | rarity: Not assessed] Reserve caption space before placing cursor targets.
   useful because: caption reflow moved the next button in this edit.
Saved to LOOT.md. No publication requested.
```

**3. Assess only when useful.** `/loot assess` researches public alternatives
and adds rarity alongside usefulness. The following is an illustrative
assessment table:

```
LOOT: 3 drops
1. [RARE | usefulness: High] remotion-ae-transitions: After Effects-style transitions in Remotion, fully local
   useful because: the workflow repeatedly needed these transitions
   query:  "remotion after effects transitions"
   search: @remotion/transitions (slides, fades, wipes), one paid template pack; none do these
   proof:  6 transitions rendered and approved in this session
   edge:   not measured, so not Epic → gist + short post
   next:   render the same 3 shots with @remotion/transitions and compare (~45 min)
2. [COMMON | usefulness: High] ffmpeg two-pass trick: recurring export fix; documented in the ffmpeg wiki → LOOT.md
3. [COMMON | usefulness: Medium] custom font loader: avoids repeating project setup → LOOT.md
Ship which? (numbers, "all", or "none")
```

Read the evidence lines, not just the label. If the search missed something or
the proof is thin, say so and it re-rates.

**4. Prepare a selected item.** Answer `1` or use `/loot 1`. A useful Common
item is also eligible if you choose it. loot builds it in a new folder (clean
code, README, logo, tests), scans it for secrets, then stops and shows you a
manifest:

```
Will publish:
  github.com/you/remotion-ae-transitions   public, 9 files, secret scan clean
  gist: "ae-style transitions for Remotion"  public
  posts/remotion-ae-transitions.md          draft, not posted
Go ahead? (yes / change something / no)
```

Nothing leaves your machine until you say `yes`.

**5. Come back to it.**

- Forgot to loot a session? `/loot --list`, then `/loot <file>` from the list.
- Every week or two: `/loot review`. Drops that keep coming back, or that
  gained proof since, get re-rated.
- Want a nudge? Turn on the [end-of-session reminder](#end-of-session-reminder-optional).

## Use

```
/loot                   capture lessons, rate usefulness, save and stop
/loot capture           explicit lightweight capture; no search or outside rater
/loot "the ffmpeg trick"  capture one thing only
/loot assess            research rarity and rate usefulness independently
/loot 2                 ship drop #2
/loot all               ship everything rated Rare or better
/loot --list            list your recent Claude Code and Codex sessions
/loot <session file>    capture a past session: Claude Code / Codex .jsonl, or an .md/.txt export
/loot review            refresh usefulness/evidence; preserve prior dated rarity unless reassessment requested
/loot --auto            unattended lightweight capture; write only LOOT.md
/loot assess --auto     unattended researched assessment; write only LOOT.md
```

Or just say "loot this session" or "what from this is worth shipping?"
`--auto` overrides shipping arguments and never asks, forges or publishes.

### End-of-session reminder (optional)

The Claude Code plugin ships a hook that, once per long session (30+ messages),
says *"Anything worth keeping? Run /loot."* It never runs loot itself, and it's
off until you turn it on in `~/.claude/settings.json`:

```json
{ "env": { "LOOT_REMIND": "1" } }
```

## Uses what your agent has

loot asks for capabilities, not specific tools, and always has a fallback.

| Need | Best | Always works |
|---|---|---|
| Logo / cover image | your agent's image generation or an image MCP | hand-written SVG |
| Secret scan | [gitleaks](https://github.com/gitleaks/gitleaks), including git history | bundled `scan.mjs` |
| Demo video | [Remotion](https://www.remotion.dev) | screenshots + GIF |
| "Does this exist?" (full assessment) | web search | assessed rarity is capped at Common; usefulness stays independent |
| Independent rarity rating (full assessment) | a subagent that never sees your conversation | the strongest case for Common, written first |
| Publish repo | `gh` CLI | the commands, printed for you |
| Publish post | dev.to / Hashnode API (draft) with your existing token | a Markdown file |

## What it will never do

- Publish anything before you approve the exact list of what goes where.
- Ask for, type or store your passwords or API keys.
- Publish secrets: every folder goes through the bundled scanner
  ([`scan.mjs`](skills/loot/scripts/scan.mjs), zero dependencies) and gitleaks
  when you have it. Old git history is never pushed unless gitleaks scanned it.
- Publish client or employer work, or relicense code you didn't write.
- Post to social media. Launch posts are drafts; you post them.
- Invent benchmarks, users or star counts.

## How it works

It's two `SKILL.md` files plus reference files and a secret scanner: no server,
no account, no dependencies beyond Node for the scanner. The agent you already
use does the work with the tools it already has.

```
skills/loot/
  SKILL.md              capture → usefulness; assess rarity → forge → check → ship when requested
  references/forge.md   checklists for repo, skill, post, gist, demo, name, logo
  references/ship.md    publish commands and fallbacks
  scripts/scan.mjs      secret scanner (node scan.mjs <folder>)
  scripts/transcript.mjs  reads past sessions (Claude Code, Codex, any text export), secrets redacted
evals/                  rarity/usefulness cases + a scorer; prompt built from SKILL.md itself
skills/skill-factory/
  SKILL.md              spec → tests first → independent review → release gate
  references/release-checklist.md  what the reviewer checks before anything ships
hooks/remind.mjs        optional end-of-session reminder
```

When a drop's form is a skill, loot hands it to **skill-factory**, which also
works on its own (`/skill-factory <idea>`). The builder never reviews its own
work: a fresh subagent does, or, in agents without subagents, a written case
for failure on every checklist item.

Ideas borrowed from the similar tools below: reading past transcripts
(logex), re-rating the journal over time (retro, learning-loop), a cap on
how much one run reports (retro), a bar for what's worth writing down and a
rule against invented evidence (learning-loop), an opt-in reminder instead
of auto-running (retro), evals for the judging step (retro), seen-again and
stale tracking, a narrower home for each lesson, and an unattended mode
(compound-engineering's ce-compound), and a cold-read pass on everything
written for publication (session-to-post's slop-detector).

### Does the rating work?

[`evals/`](evals/) holds the original 13 rarity fixtures, one taken
from a real run, plus separate usefulness/historical-evidence cases.
Under the earlier rarity-only rules, fresh raters scored **13/13**,
agreed with each other on every item, and across all
eight runs **never rated an item higher than its evidence supported**.
Earlier misses were near-miss tags, not tiers, and each one led to a rule fix.

### Head-to-head with ce-compound

On 4 real past sessions, each with a fake credential planted in it, loot
captured **37 of 46** things an independent judge said were worth keeping
(19 of 20 high-importance ones) and leaked nothing. compound-engineering's
`ce-compound` wrote nothing on any of them, as its own rules say it should:
it only documents solved bugs that the code doesn't already explain. So loot
is the better journal; whether it beats ce-compound at documenting a hard repo
bug fix wasn't tested. Setup, numbers and limits:
[`evals/head-to-head.md`](evals/head-to-head.md). Details and how to rerun them: [`evals/README.md`](evals/README.md).

This repo was built in one Claude Code session and then looted with itself.
The write-up is in [`posts/`](posts/).

## Similar tools

Found by running loot's own existence check on itself:

- [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) `ce-compound`: writes durable, non-obvious solved problems to `docs/solutions/`; doesn't publish.
- [session-to-post](https://github.com/athola/claude-night-market) (claude-night-market): turns a session into a blog post, case study or Reddit post.
- [logex](https://github.com/iamtouchskyer/logex): turns Claude Code transcripts into blog-style articles.
- [work-to-blog-publisher](https://github.com/greeun/work-to-blog-publisher): Claude Code skill that publishes session work to GitHub and WordPress.
- [insight-capture](https://github.com/xmoonanx/insight-capture): Claude Code and Codex session insights into Jekyll posts.
- [mentor](https://github.com/smixs/mentor): session-insights skill that reads your local Claude Code and Codex history.
- [retro-skill](https://github.com/netresearch/retro-skill): finds friction in agent sessions and turns learnings into config.
- [learning-loop-skill](https://github.com/melodykoh/learning-loop-skill): captures learnings before the session ends.
- [SpecStory](https://github.com/specstoryai/getspecstory): saves AI IDE and terminal agent histories for reuse.

loot's differences: lightweight capture, separate usefulness and novelty
ratings, a secret-scan and approval
gate before anything goes public, and one pass that can produce a repo, skill,
post or demo. The rating is tested on known cases, and loot was run side by
side with ce-compound on real sessions (above); the other tools haven't been
compared yet.

## Limits

- Past sessions are parsed from Claude Code and Codex transcripts; other
  agents need a Markdown or text export of the conversation. Very long
  transcripts are cut in the middle (start and end kept), and loot says so.
- The bundled scanner is a safety net (known key formats, `.env` files,
  passwords in URLs), not a full audit. Install gitleaks for the real thing.
- Ratings are still an LLM's judgment. The evidence rules, the checklist and
  the outside rater reduce flattery, and the evals show it holds on known
  cases; a finite fixture set is not every case. Read the context and cited
  evidence, not just either label. Prior historical benchmarks describe the
  older rules and have not been rerun as comparisons of this capture mode.

## License

MIT
