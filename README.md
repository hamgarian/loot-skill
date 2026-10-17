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
3. **Rates** each drop on evidence, not enthusiasm: it searches for what
   already exists, asks for proof, and has a fresh agent that never saw your
   conversation do the judging. Most drops are Common, and that's the point.
4. **Forges** the rare drop that earns it into finished work: a clean repo with
   README, logo and tests, an agent skill, a blog post, a gist, a demo video.
5. **Checks** for secrets and private data, then **ships** only after you say yes.

## Rarity

| Rarity | Needs all of | What you get |
|---|---|---|
| **Common** | anything below Rare | a line in `LOOT.md`, so it isn't lost |
| **Rare** | a real search query; a search that found nothing equivalent, with links; proof it works | gist, short post, or a small repo or skill |
| **Epic** | Rare, plus a measured edge over a named alternative, and it runs from a clean clone | repo or skill, post, demo, launch drafts |

"Not checked" or "no proof" means Common. Ties round down. Anything rated
above Common shows its evidence, so you can disagree.

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

It's published anyway because it was built in the open. Under its own rules it
would have stayed a line in `LOOT.md` until real use proves an edge.

## Install

**Claude Code**

```
/plugin marketplace add hamgarian/loot-skill
/plugin install loot@loot-skill
```

**Other agents that support [Agent Skills](https://github.com/vercel-labs/skills)** (Codex, Cursor, Gemini CLI, …)

```bash
npx skills add hamgarian/loot-skill
```

Built and tested in Claude Code. Other agents should work since it's a plain
`SKILL.md`; if one doesn't, please open an issue.

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
| Logo / cover image | your agent's image generation or an image MCP | hand-written SVG |
| Secret scan | [gitleaks](https://github.com/gitleaks/gitleaks), including git history | bundled `scan.mjs` |
| Demo video | [Remotion](https://www.remotion.dev) | screenshots + GIF |
| "Does this exist?" | web search | marked "not checked", which caps it at Common |
| Independent rating | a subagent that never sees your conversation | the strongest case for Common, written first |
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

This repo was built in one Claude Code session and then looted with itself.
The write-up is in [`posts/`](posts/).

## Similar tools

Found by running loot's own existence check on itself:

- [logex](https://github.com/iamtouchskyer/logex): turns Claude Code transcripts into blog-style articles.
- [work-to-blog-publisher](https://github.com/greeun/work-to-blog-publisher): Claude Code skill that publishes session work to GitHub and WordPress.
- [insight-capture](https://github.com/xmoonanx/insight-capture): Claude Code and Codex session insights into Jekyll posts.
- [mentor](https://github.com/smixs/mentor): session-insights skill that reads your local Claude Code and Codex history.
- [retro-skill](https://github.com/netresearch/retro-skill): finds friction in agent sessions and turns learnings into config.
- [learning-loop-skill](https://github.com/melodykoh/learning-loop-skill): captures learnings before the session ends.
- [SpecStory](https://github.com/specstoryai/getspecstory): saves AI IDE and terminal agent histories for reuse.

loot's differences: a rating step built to say no, a secret-scan and approval
gate before anything goes public, and one pass that can produce a repo, skill,
post or demo. None of that is measured against these tools yet.

## Limits

- loot sees the current session. In a very long session whose start was
  summarized, early discoveries can be missed; loot says so when it happens.
- The bundled scanner is a safety net (known key formats, `.env` files,
  passwords in URLs), not a full audit. Install gitleaks for the real thing.
- Ratings are still an LLM's judgment. The evidence rules and the outside
  rater reduce flattery; they don't remove it. Read the cited search results,
  not the label.

## License

MIT
