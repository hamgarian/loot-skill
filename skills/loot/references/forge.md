# Forge: finishing each form

Build each item until a stranger can use it without the chat log.

## Repo

Folder layout: keep it flat and boring.

```
<slug>/
  README.md
  LICENSE            MIT unless the user says otherwise
  .gitignore
  assets/logo.svg
  src/ or the language's normal layout
  examples/          one runnable example
  tests/             at least one test that proves the main claim
```

- Copy only what the item needs. Rewrite imports from the old project.
- Replace hardcoded paths, URLs and names with arguments or env vars, and list
  them in the README. Ship an `.env.example`, never an `.env`.
- Keep dependencies to what is already used. Pin versions the normal way for
  that language.
- From a clean clone, follow the README exactly and run the example and the
  tests. Fix whatever breaks before calling it done.
- `git init`, then one first commit: "Initial release".

### README template

```markdown
<p align="center"><img src="assets/logo.svg" width="96" alt=""></p>
<h1 align="center"><name></h1>
<p align="center"><tagline></p>

<one screenshot, GIF or code sample showing the result>

## Why
<the problem in 2-3 sentences, in the user's words>

## Quickstart
<copy-paste install + the smallest working example>

## How it works
<the core idea, short; link the blog post if there is one>

## Results
<real numbers or before/after only>

## License
MIT
```

Description (GitHub "About"): the tagline, under 120 characters.
Topics: 3 to 8 lowercase terms people search for (language, framework, problem).

## Skill

Turn the user's corrections into rules another agent can follow.

1. Go through the session and collect every correction, complaint and approval
   ("no, not like that", "perfect", "always do X").
2. Turn each into one imperative rule with the reason behind it.
3. Group the rules by step of the task. Add one good/bad example where a rule
   is easy to misread.
4. Frontmatter: `name` (kebab-case) and a `description` that says what it does
   and lists the phrases that should trigger it.
5. Keep `SKILL.md` under ~300 lines; move long references to `references/`.
6. Test it: start a fresh session and give it the original task with only the
   skill. Compare the result with the session's best output. Fix gaps.

Package it as a repo (see above) with `skills/<name>/SKILL.md` and, for Claude
Code, `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`, so
it installs with `/plugin marketplace add <owner>/<repo>` or
`npx skills add <owner>/<repo>`.

## Post

Write in the user's voice, taken from how they talk in the chat.

```markdown
---
title: <specific, with the result in it>
tags: [<4 max>]
canonical_url: <the first place it is published>
---

<hook: the result in one or two sentences, with the GIF or number>

## The problem
## What didn't work
## What worked
<code, short and runnable>
## Results
## Try it
<link to the repo or gist>
```

- Give 3 title options. Good titles name the tool and the result:
  "After Effects-style edits in Remotion, fully local".
- Cut filler: "In today's fast-paced world", "game-changer", "dive in",
  "unlock", "seamless", "leverage", "Let's explore".
- 600–1500 words. Every claim backed by something from the session.

## Gist

One file, a comment header saying what it does and how to run it, and a
one-line description. No README needed.

## Demo video

Only for Epic and Legendary items. 10–30 seconds, no voice, captions on screen:
the problem (2s), the command or action (3–5s), the result (rest). Loop-friendly
ending. See `ship.md` for the Remotion recipe.

## Launch posts (Legendary)

Drafts in `launch/`, never posted by you:

- `show-hn.md`: "Show HN: <name> – <what it does>" plus a short first comment
  telling the story and what you want feedback on.
- `x.md`: 1–3 posts, result first, GIF attached, link last.
- `reddit.md`: one post per relevant subreddit; follow each subreddit's rules
  on self-promotion and say so in the draft.

## Name, tagline, logo

- Name: 1–2 words, easy to say and spell, hints at the job. Prefer a word with
  a picture behind it. Check `gh search repos <name>` and `npm view <name>`.
  If the plain name is taken, keep it as the brand and publish as
  `<name>-<kind>` (`loot-skill`, `foo-cli`).
- Tagline: what it does + for whom, under 12 words. Test: would a stranger know
  what happens when they run it?
- Logo: one simple shape, 1–2 colors, readable at 16px. SVG with a `viewBox`,
  no text inside the icon. Check it on white and on #0d1117 (GitHub dark).
