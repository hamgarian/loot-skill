---
title: "Your AI sessions drop loot. I built a skill that ships it"
tags: [ai, opensource, productivity, claude]
canonical_url: https://github.com/hamgarian/loot-skill/blob/main/posts/loot.md
---

![loot scanning a session and listing its drops by rarity](https://raw.githubusercontent.com/hamgarian/loot-skill/main/assets/demo.gif)

*Update: the first feedback showed the rating step was flattering me. It's
been rebuilt around evidence, and loot now rates itself Common. See
[The filter was flattering me](#the-filter-was-flattering-me).*

You know the feeling. You're in a session with Claude or Codex, and somewhere
along the way you find something actually good: a trick that makes a framework
way faster, or a pile of corrections that finally gets the AI to make
After Effects-style edits in Remotion. Then you close the tab. No repo, no docs,
no blog post. It's gone.

So I built **loot**: one command at the end of a session, and it finds
everything worth keeping and turns the good stuff into finished, public work.

## The problem

AI made building cheap. That means you get way more "huh, that works" moments
than you could ever follow up on. And the follow-up is the boring part: cut the
code out of your project, write a README, make a logo, write the post, record a
demo. So it never happens.

Most of what you find doesn't need a repo. It needs to be written down
somewhere better than a chat log. And the rare piece that does deserve a repo
is worth far more on GitHub, where it can be found and used, than in your
history.

## What it does

`/loot` reads the whole session and lists every drop: the main build, side
discoveries, techniques, and the feedback you taught the agent along the way.
That last one is underrated. If you spent an hour correcting Claude until its
Remotion edits looked right, those corrections *are* a skill. loot turns them
into a `SKILL.md` someone else can install.

Everything goes into `LOOT.md`, a running journal of what you figured out.
Then each drop gets a rarity, and the bar is evidence:

- **Common**: everything that doesn't clear the bar below. A line in `LOOT.md`.
- **Rare**: a real search query, a search that found nothing equivalent (with
  links), and proof it works. Gist, short post, or a small repo.
- **Epic**: Rare, plus a measured edge over a named alternative. Repo or skill,
  post, demo.

You pick what to ship. loot then builds each one as a standalone thing: clean
folder, README, logo, license, tests, name and tagline. Then it checks.

## The part that makes it safe to use

Automatically publishing stuff from your sessions is a great way to leak an API
key. So before anything goes public, loot:

1. runs a bundled, zero-dependency secret scanner on every folder (it reports
   file and line, never the secret itself),
2. reads every file for personal data, client names and internal hostnames,
3. shows you a manifest of exactly what goes where, and waits for a yes.

It never asks for your passwords or tokens. If `gh` isn't signed in, you get
the commands instead. Blog posts go up as drafts. Launch posts for Hacker News,
X and Reddit are written for you but never posted.

## It uses whatever your agent can do

I built and tested it in Claude Code, but loot is just a `SKILL.md`, so it
should work in Codex, Cursor, Gemini CLI and anything else that reads the
format. You can even paste it into a chat app.

It asks for capabilities, not tools. If your agent can generate images, you
get a generated logo. If not, Claude writes an SVG. If Node is
around, you get a Remotion demo video. If not, screenshots.

## Naming it took four tries

This was half the session, and it's the same thing loot does for every repo it
ships:

- **hatch**: nice picture, but [pypa/hatch](https://github.com/pypa/hatch) is a
  big Python tool. Dead.
- **afterchat**: says exactly when you'd use it, but sounds like a messaging app.
- **sidequest**: great tagline ("You came for the SaaS. The sidequest got 2k
  stars"), but too narrow. The main build is often the best loot.
- **loot**: anything valuable a run drops, wherever it came from. The plain name
  is taken on npm and by a game modding tool, so the repo is `loot-skill` and
  the brand stays loot.

## I ran it on itself

The session that built loot was the first thing it looted. It found four drops
and rated them: the skill itself Epic, the secret scanner Rare, this naming
story Rare, and a throwaway preview server Common.

## The filter was flattering me

The first real feedback took that table apart. Three of four drops above
Common, in a system whose whole pitch is "most drops are Common." A naming
brainstorm rated Rare. A regex key checker rated Rare. As the reviewer put
it, the filter wasn't filtering, it was flattering.

They were right about why, too. The agent rating your work is the one that
just spent the evening helping you build it. It can't tell what's new to the
world, and it leans toward telling you what you want to hear. Rarity colors
make it worse: an "Epic" label makes you want to publish.

So the rating step changed:

- **Evidence instead of judgment.** Each tier is a checklist: the search query
  a stranger would type, that search actually run with results cited, proof
  it works, and for Epic a measured edge over a named alternative.
- **Can't check it, can't rate it.** "Not checked" or "no proof" means Common.
- **Someone else judges.** In Claude Code the rating goes to a subagent that
  sees only the evidence, never the conversation, and has to argue for Common
  first.
- **Expect Common.** Ties round down. More than one drop above Common in a
  session needs an explanation.

Then I re-ran the existence check on loot itself, searching for what it
*does* instead of whether its name was free. It found logex,
work-to-blog-publisher, mentor, retro-skill and a few others doing parts of
the same job. loot's differences are real, but nothing is measured. Under its
own rules, **loot rates itself Common**. All four drops are Common now.

It's already public, so it stays public, and the README links the similar
tools. But that's the version of loot I'd actually trust: one that tells its
own author no.

## Try it

Claude Code:

```
/plugin marketplace add hamgarian/loot-skill
/plugin install loot@loot-skill
```

Other agents:

```bash
npx skills add hamgarian/loot-skill
```

Then, at the end of your next good session: `/loot`.

Repo: [github.com/hamgarian/loot-skill](https://github.com/hamgarian/loot-skill)
