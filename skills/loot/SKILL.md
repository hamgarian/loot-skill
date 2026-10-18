---
name: loot
description: >
  Find everything worth keeping from this AI session (the main build, side
  discoveries, techniques, the feedback the user taught you), rate each by
  rarity on evidence, save them to LOOT.md, and turn the rare one that earns it
  into finished public work: a GitHub repo with docs and a logo, an agent
  skill, a blog post, a gist, a demo video. Also reads past Claude Code and
  Codex sessions. Use when the user says "loot", "/loot", "what's worth
  shipping from this", or "turn this into a repo / skill / blog post".
argument-hint: "[number | all | \"topic\" | review | --list | <session.jsonl>]"
license: MIT
---

# loot

Every session drops loot. Most of it dies in the chat log. Your job: find it,
write it all down, judge it on evidence instead of enthusiasm, and ship only
the rare piece that earns it, after the user says yes.

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

One session often holds several items. A single item often deserves several
forms (repo + post + demo).

## Modes

| Command | Does |
|---|---|
| `/loot` | scan this session, show the table, ask what to ship |
| `/loot "<topic>"` | look at one thing only (cheaper): "the ffmpeg trick" |
| `/loot 2`, `/loot all` | ship drop 2, or every drop rated Rare or better, without asking which |
| `/loot --list` | list recent past sessions to pick from |
| `/loot <session.jsonl>` | scan a past session instead of this one |
| `/loot review` | re-rate what's already in `LOOT.md` (see step 6) |

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

Drop an item when it only works in this user's setup and cannot be made
general, when it is mostly someone else's code, or when it is the user's
private or client work. Do not mention secrets, credentials or personal data
from the session in the table.

## 2. Rate

The rating is a filter, and its job is to say no. You are a bad judge of work
you just helped make: you can't tell what is new to the world, and you lean
toward flattering the user. So rarity comes from evidence, and the judging
happens away from the conversation.

**Collect evidence** for each candidate:

- **query**: what a stranger with this problem would type into a search box
- **search**: run it (web, GitHub, npm/PyPI) and list the closest results with
  links. Search for what it *does*, not for its name. No search tool: "not checked".
- **proof**: a test, benchmark or before/after that actually happened in the
  session, with where (the command, the file, the message), or "none". Never
  reconstruct proof from memory: AI notes invent names, numbers and details.
- **edge**: what it does that the closest result doesn't, measured if possible

**Rate it somewhere else.** If you can start a subagent, give it only the
candidates and their evidence, never the conversation, with this brief:
"Rate each item against the bar below. Argue for Common first and raise an
item only when its evidence meets the bar. When unsure, rate lower. Use only
the evidence given; never add or assume any. For any item one requirement
short of the next tier, name the cheapest evidence that would raise it." If you
can't, write the strongest case that each item is Common before rating it.

| Rarity | Needs all of | Forms |
|---|---|---|
| **Common** | anything below Rare | a line in `LOOT.md` |
| **Rare** | a real query; a cited search that found nothing equivalent, **or** a measured edge over the closest result; proof it works | gist, short post, or a small repo or skill |
| **Epic** | Rare, plus a measured edge over a named alternative, and it runs from a clean clone | repo or skill, post, demo, launch drafts |

Hard rules:

- "not checked" or "no proof" means Common, however good it feels.
- Something equivalent exists and the edge isn't measured: Common. An edge
  argued from other projects' READMEs is not measured.
- Ties round down.
- **Near misses get a next step.** An item one requirement short of the next
  tier is labelled `[COMMON, near Rare]` or `[RARE, near Epic]` and gets a
  `next:` line: the cheapest evidence that would raise it, and roughly how
  long it takes. That turns a "no" into a to-do the user can choose.
- Expect nearly everything to be Common. If more than one item in a session
  rates above Common, say why this session is the exception.
- Common is not a failure. It is the journal entry that keeps the work from
  being lost.

Show the loot table, with the evidence for anything above Common, and stop:

```
LOOT: 3 drops
1. [RARE, near Epic] remotion-ae-transitions: After Effects-style transitions in Remotion, fully local
   query: "remotion after effects transitions"
   search: @remotion/transitions (slides, fades, wipes), one paid template pack; none do these
   proof: 6 transitions rendered and approved in the session
   edge: not measured, so not Epic → gist + short post
   next: render the same 3 shots with @remotion/transitions and compare; then a clean-clone run (~45 min)
2. [COMMON] ffmpeg two-pass trick: documented in the ffmpeg wiki → LOOT.md
3. [COMMON] custom font loader: only useful in this project → LOOT.md
Ship which? (numbers, "all", or "none")
```

Show at most 7 drops, strongest first. Everything else gets one line under
"noted".

After showing the table, append it to `LOOT.md` in the project root (create it
if missing), dated. A drop earns a full entry only if a future session would
go wrong, or redo real work, without it. Otherwise it's a one-line "noted"
entry. The journal is only useful if it stays readable.

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

**Skills in Claude Code:** if the chosen form is a skill and a `skill-factory`
skill is installed, hand the item to `/skill-factory` with its evidence (query,
search results, proof, edge) as the starting spec, and skip steps 3–5 for that
item; skill-factory builds, reviews and gates the release itself. Every other
agent, or no skill-factory: carry on below.

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
- Launch posts (Show HN, X, Reddit), Epic only: drafts in a gitignored
  `launch/` folder. Never post them.
- Finish with links to everything shipped and anything left for the user.

## 6. Review (`/loot review`)

Ratings from one session are a guess. Evidence builds up over time:

1. Read `LOOT.md`. Group entries that are the same thing seen again (same
   root idea, even if worded differently).
2. Re-rate a drop when something changed: it came up in 3 or more sessions,
   it gained proof (users, a benchmark, someone asked for it), or a new search
   finds nothing equivalent anymore. Use the same evidence rules and the same
   outside rater.
3. Show what moved and why. Write a dated "review" section to `LOOT.md`; never
   rewrite old entries. Then offer to ship anything that's now Rare or better.

## Use what the agent has

| Need | Best | Fallback that always works |
|---|---|---|
| Logo / cover image | your own image generation or an image MCP, if you have one | hand-written SVG |
| Secret scan | `gitleaks` (also covers git history) | bundled `scripts/scan.mjs` |
| Demo video | Remotion (Node) | screenshots + GIF |
| Screenshots | a browser tool | ask the user for one |
| "Does it exist?" | web search | mark "not checked" (caps it at Common) |
| Past or summarized sessions | `scripts/transcript.mjs` (Claude Code, Codex) | ask the user to paste or export the conversation |
| Independent rating | a subagent that never sees the conversation | the strongest case for Common, written first |
| Build and release a skill | `skill-factory` (Claude Code), if installed | loot's own steps 3–5 |
| Publish repo | `gh` CLI | print the commands |
| Publish post | the platform's API with an existing token | Markdown file |

## Rules

- Nothing goes public without the user's yes on the exact manifest.
- Never ask for, type or store credentials. If a tool isn't signed in, fall back.
- Never publish secrets, personal data, or client or employer work.
- Respect licenses: don't relicense code you didn't write.
- No invented proof: no fake benchmarks, users, quotes or star counts.
- Write in the user's voice from the chat, not like a press release.
