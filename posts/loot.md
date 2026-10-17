---
title: "Your AI sessions drop loot. I built a skill that ships it"
tags: [ai, opensource, productivity, claude]
canonical_url: https://github.com/hamgarian/loot-skill/blob/main/posts/loot.md
---

![loot scanning a session and listing its drops by rarity](https://raw.githubusercontent.com/hamgarian/loot-skill/main/assets/demo.gif)

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

But something on GitHub with decent docs is worth more than something perfect
in a chat log. A repo can get found, used, starred and linked. A chat log can't.

## What it does

`/loot` reads the whole session and lists every drop: the main build, side
discoveries, techniques, and the feedback you taught the agent along the way.
That last one is underrated. If you spent an hour correcting Claude until its
Remotion edits looked right, those corrections *are* a skill. loot turns them
into a `SKILL.md` someone else can install.

Each drop gets a rarity, after loot checks whether it already exists:

- **Common**: useful to you, not to strangers. It goes in `LOOT.md` so it isn't lost.
- **Rare**: small and reusable. Gist or short post.
- **Epic**: solves a common problem better than what's out there. Repo or skill, plus post.
- **Legendary**: new, with proof. Repo, post, demo video, launch drafts.

The rarity labels are a bit of a joke, but they do a real job: they force an
honest verdict. Most drops are Common, and loot says so.

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

Claude is the main target, but loot is just a `SKILL.md`, so it also works in
Codex, Cursor, Gemini CLI and anything else that reads the format. Paste it
into ChatGPT and it works there too.

It asks for capabilities, not tools. If your agent can generate images (Codex,
Antigravity), you get a generated logo. If not, Claude writes an SVG. If Node is
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

The session that built loot was the first thing it looted. It found four drops:
the skill itself (Epic), the secret scanner (Rare, kept inside the repo since
gitleaks already exists), this naming story (Rare, now a section of this post),
and a throwaway preview server (Common). The demo at the top was rendered with
Remotion in that same session.

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
