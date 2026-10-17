---
name: loot
description: >
  Find everything worth keeping from this AI session (the main build, side
  discoveries, techniques, the feedback the user taught you), rate each by
  rarity, and turn the ones worth it into finished public work: a GitHub repo
  with docs and a logo, an agent skill, a blog post, a gist, a demo video. Use
  when the user says "loot", "/loot", "what's worth shipping from this",
  "publish this", "turn this into a repo / skill / blog post", or at the end of
  a productive session.
argument-hint: "[item name or number | all]"
license: MIT
---

# loot

Every session drops loot. Most of it dies in the chat log. Your job: find it,
judge it honestly, finish the parts worth finishing, and ship them only after
the user says yes.

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

## 1. Scan

Read the whole conversation and the files it touched. If earlier parts of the
conversation were summarized, say so in the table: early discoveries may be
missing. List candidates. For each
one, write down what it does and the proof that it works (test, benchmark,
before/after, the user's reaction).

Drop an item when it only works in this user's setup and cannot be made
general, when it is mostly someone else's code, or when it is the user's
private or client work. Do not mention secrets, credentials or personal data
from the session in the table.

## 2. Rate

Check whether each item already exists: search the web, GitHub and npm/PyPI
when you can. If you cannot search, say "not checked". Then give it a rarity.
Be honest; most drops are Common.

| Rarity | Bar | Default forms |
|---|---|---|
| **Common** | useful to this user, not to strangers | a line in `LOOT.md` |
| **Rare** | reusable and small, others hit this problem | gist or short post |
| **Epic** | solves a common problem better than what exists | repo or skill, plus post |
| **Legendary** | new or clearly better, with proof | repo or skill, post, demo video, launch posts |

Show the loot table and stop:

```
LOOT: 3 drops
1. [EPIC] remotion-ae-transitions: After Effects-style transitions in Remotion, fully local
   proof: 6 transitions rendered, user approved each one
   exists? closest is X (paid, no source) → repo + skill + post
2. [RARE] ffmpeg two-pass trick: halves export size with no visible loss
   exists? known but scattered → gist + short post
3. [COMMON] custom font loader for this project → LOOT.md
Ship which? (numbers, "all", or "none")
```

Append every table to `LOOT.md` in the project root (create it if missing), so
Common drops aren't lost. With an argument, skip the question: `/loot 2` ships
drop 2, `/loot all` ships every drop rated Rare or better.

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
- Launch posts (Show HN, X, Reddit): drafts in the repo. Never post them.
- Finish with links to everything shipped and anything left for the user.

## Use what the agent has

| Need | Best | Fallback that always works |
|---|---|---|
| Logo / cover image | your own image generation or an image MCP, if you have one | hand-written SVG |
| Secret scan | `gitleaks` (also covers git history) | bundled `scripts/scan.mjs` |
| Demo video | Remotion (Node) | screenshots + GIF |
| Screenshots | a browser tool | ask the user for one |
| "Does it exist?" | web search | mark "not checked" |
| Publish repo | `gh` CLI | print the commands |
| Publish post | the platform's API with an existing token | Markdown file |

## Rules

- Nothing goes public without the user's yes on the exact manifest.
- Never ask for, type or store credentials. If a tool isn't signed in, fall back.
- Never publish secrets, personal data, or client or employer work.
- Respect licenses: don't relicense code you didn't write.
- No invented proof: no fake benchmarks, users, quotes or star counts.
- Write in the user's voice from the chat, not like a press release.
