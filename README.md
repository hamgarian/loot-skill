<p align="center"><img src="assets/logo.svg" width="96" alt=""></p>
<h1 align="center">loot</h1>
<p align="center"><b>Every AI session drops loot. <code>/loot</code> finds it, polishes it, ships it.</b></p>

<p align="center"><img src="assets/demo.gif" width="720" alt="loot scanning a session and listing three drops by rarity"></p>

You spend an evening with Claude or Codex and find something good: a trick that
makes a framework 4× faster, a pile of corrections that finally got Remotion to
make After Effects-style edits, a tool that just works. Then you close the tab,
and it dies in the chat log. No repo, no docs, no post. Worth zero.

**loot** is an agent skill that stops that. Run it at the end of a session and it:

1. **Scans** the whole session for anything worth keeping: the main build,
   side discoveries, techniques, and the feedback you taught the agent.
2. **Rates** each drop honestly by rarity, after checking whether it already exists.
3. **Forges** the ones you pick into finished work: a clean standalone repo
   with README, logo and tests, an agent skill, a blog post, a gist, a demo video.
4. **Checks** for secrets and private data, then shows you exactly what will go public.
5. **Ships** it only after you say yes.

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

## Rarity

| Rarity | Bar | What you get |
|---|---|---|
| **Common** | useful to you, not to strangers | a line in `LOOT.md`, so it isn't lost |
| **Rare** | small, reusable, others hit this | gist or short post |
| **Epic** | solves a common problem better than what exists | repo or skill, plus post |
| **Legendary** | new or clearly better, with proof | repo or skill, post, demo video, launch drafts |

Most drops are Common. loot says so.

## Install

**Claude Code**

```
/plugin marketplace add hamgarian/loot-skill
/plugin install loot@loot-skill
```

**Codex, Cursor, Gemini CLI, and other agents that read `SKILL.md`**

```bash
npx skills add hamgarian/loot-skill
```

**ChatGPT, claude.ai or any chat app:** paste
[`skills/loot/SKILL.md`](skills/loot/SKILL.md) and say "run loot on this conversation".

## Use

```
/loot          scan this session and show the loot table
/loot 2        ship drop #2
/loot all      ship everything rated Rare or better
```

Or just say "loot this session" or "what from this is worth shipping?"

## Uses what your agent has

loot asks for capabilities, not specific tools, and always has a fallback.

| Need | Best | Always works |
|---|---|---|
| Logo / cover image | Codex or Antigravity image generation, an image MCP | hand-written SVG |
| Demo video | [Remotion](https://www.remotion.dev) | screenshots + GIF |
| "Does this exist?" | web search | marked "not checked" |
| Publish repo | `gh` CLI | the commands, printed for you |
| Publish post | dev.to / Hashnode API (draft) with your existing token | a Markdown file |

## What it will never do

- Publish anything before you approve the exact list of what goes where.
- Ask for, type or store your passwords or API keys.
- Publish secrets: every folder goes through the bundled scanner
  ([`scan.mjs`](skills/loot/scripts/scan.mjs), zero dependencies) first.
- Publish client or employer work, or relicense code you didn't write.
- Post to social media. Launch posts are drafts; you post them.
- Invent benchmarks, users or star counts.

## How it works

It's one `SKILL.md` plus two reference files and a secret scanner: no server,
no account, no dependencies beyond Node for the scanner. The agent you already
use does the work with the tools it already has.

```
skills/loot/
  SKILL.md              scan → rate → forge → check → ship
  references/forge.md   checklists for repo, skill, post, gist, demo, name, logo
  references/ship.md    publish commands and fallbacks
  scripts/scan.mjs      secret scanner (node scan.mjs <folder>)
```

This repo is loot's first drop: it was built in one Claude Code session and then
looted with itself. The write-up is in [`posts/`](posts/).

## License

MIT
