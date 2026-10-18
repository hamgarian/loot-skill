# Head-to-head: loot vs ce-compound

**2026-10-19, loot 1.4.1 vs [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) `ce-compound` (commit 2e41b44).**

## Setup

- **4 real past Claude Code sessions:** a PC storage cleanup, Roblox game
  research, AI tool research and installs, and a Reddit scraper build (110 file
  edits; the session closest to what ce-compound is built for).
- **The same input for both:** each session condensed the same way to at most
  60k characters, with existing secrets redacted, and one fake credential
  planted in the middle (a database URL with a password, and an AWS key).
- **Both tools run the same way:** a fresh agent (Claude Sonnet) that had not
  seen this conversation followed the tool's own `SKILL.md` unattended
  (`/loot --auto`, `/ce-compound mode:non-interactive`). The tools' own
  instructions were followed, but no plugin hooks were run.
- **Gold list first:** a separate agent read each session, saw neither tool,
  and listed what was worth keeping (46 items, 20 of them high importance).
- **Scoring:** a fourth agent, told only that it was scoring "a note-taking
  tool's output", checked each output against the gold list and the session:
  coverage, extra items, claims the session doesn't support, credential leaks,
  and usefulness from 1 to 5.

## Results

| | loot | ce-compound |
|---|---|---|
| Gold items captured | **37 / 46 (80%)** | 0 / 46 |
| High-importance items captured | **19 / 20** | 0 / 20 |
| Planted credential leaked | 0 / 4 | 0 / 4 |
| Extra items | 14, of which 8 judged worth keeping | – |
| Wrong facts | 1 (a timing quoted as 17s; the input said 21s) | – |
| Usefulness (1–5) | 4, 3, 3, 4 | – |

ce-compound wrote nothing on any session, and each skip followed its own rules.
It documents only a solved, verified problem in a codebase that the code
doesn't already explain. Cleanup and research sessions don't qualify, and for
the scraper build it judged the lessons already captured in the shipped
README, code and logs.

**What this shows:** for keeping a record of what a session taught you, loot
captured most of it and ce-compound, by design, captured none of it. **What it
doesn't show:** whether loot beats ce-compound at ce-compound's own job,
documenting a hard bug fix inside a repo for later engineers. None of these
sessions was a clear case of that.

## What it changed in loot (1.5.0)

The judges' criticisms became fixes:

- **Web facts were mixed in with session facts.** Results from loot's own
  searches now go only on the `search:` line, with links.
- **Common entries were buried in evidence fields.** Plain Common drops are now
  a line or two; the fields are for near misses and above.
- **Decisions were missed.** Both high-importance misses were "chose X over Y"
  decisions, so `Decision` is now a kind of loot.
- **A number was misquoted.** Numbers, names and commands must now be copied
  exactly from the session.

## Limits

One run per tool per session, all judging by one model family, and a gold
list written by an LLM. Inputs were cut to 60k characters (start and end kept),
so a fact in the trimmed middle can look unsupported. ce-compound was run by
following its instructions, not as an installed plugin.
