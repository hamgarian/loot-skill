# LOOT

## 2026-10-18: the session that built loot

```
LOOT: 4 drops
1. [EPIC] loot-skill: an agent skill that finds and ships the valuable parts of AI sessions
   proof: built and run on its own session; scanner tests pass; plugin manifest validates
   exists? no Claude/agent skill found doing scan → rate → publish (GitHub search
   "loot claude", "claude skill loot": no results) → repo + skill + post + demo
2. [RARE] scan.mjs: zero-dependency secret scanner that never prints the secret
   exists? gitleaks and trufflehog do far more; this one wins only on "no install"
   → bundled in the repo, not a separate project
3. [RARE] naming a dev tool: hatch (taken by pypa/hatch) → afterchat (sounds like
   a messaging app) → sidequest (too narrow) → loot
   → a section of the post
4. [COMMON] scratch static preview server for checking the logo → stays here
```

Shipped: #1, with #2 inside it and #3 in the post.

## 2026-10-18: re-rated under the evidence rules

The table above was the agent grading its own homework: 3 of 4 drops above
Common, including a naming brainstorm. Feedback called it flattering, and it
was. Re-rated with a real "does this exist?" search (for what loot does, not
for its name):

```
LOOT: 4 drops
1. [COMMON] loot-skill: an agent skill that finds and ships the valuable parts of AI sessions
   query: "claude code session to blog post / repo / skill"
   search: logex, work-to-blog-publisher, insight-capture, mentor, retro-skill,
           learning-loop-skill, SpecStory (links in README)
   proof: scanner tests pass; the skill itself has not been run in a fresh session
   edge: rating filter, secret gate, several forms in one pass; not measured
2. [COMMON] scan.mjs: gitleaks and trufflehog do far more
3. [COMMON] naming a dev tool: color for the post, not useful to strangers
4. [COMMON] scratch preview server: throwaway
Nothing above Common.
```

Already public, so it stays public. Re-rate after real use.
