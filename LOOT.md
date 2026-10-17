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
