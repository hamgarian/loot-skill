# Assess public rarity (2b)

Loaded only for `/loot assess`, `/loot 2`, `/loot all`, `assess --auto` and a
`/loot review` that asks for rarity. Plain capture never needs this file.

Research and independent review are for a public-novelty claim or a selected
publication, not the cost of remembering a lesson. Rarity measures the
evidence for distinction from alternatives; it does not decide whether the
user is allowed to publish useful familiar guidance.

<!-- rater:start (evals/build-prompt.mjs reads this section) -->
**Collect evidence** for each candidate:

- **query**: what a stranger with this problem would type into a search box
- **search**: run it (web, GitHub, npm/PyPI) and list the closest results with
  links. Search for what it *does*, not for its name. No search tool: "not checked".
- **proof**: a test, benchmark or before/after that actually happened in the
  current or an earlier session, with a traceable command/result, artifact,
  or recorded before/after, or "none". Mark it **fresh** (run now),
  **recorded historical** (source inspected, not rerun), **reported historical**
  (attributed account without inspected underlying results), or **absent**.
  Recorded historical checks count toward proof within their demonstrated
  scope; a fresh rerun is not required merely because evidence is old.
  Record the source/date, relevant revision/environment when available, and
  limits. Recheck when changed code, dependencies or a current-release claim
  makes freshness material. Reported checks can inform usefulness, but do
  not treat an uninspected summary as verified execution or benchmark output.
  Never reconstruct proof from memory or invent missing details.
- **edge**: what it does that the closest result doesn't, measured if possible

**Rate it somewhere else.** For full assessment, if you can start a subagent,
give it only the candidates, usefulness context and sourced evidence, never
the conversation, with this brief:
"Rate each item against the bar below. Argue for Common first and raise an
item only when its evidence meets the bar. When unsure, rate lower. Use only
the evidence given; never add or assume any. For each item, list which of
checklist items 1–5 are met, then give the rating those imply. For any item
one requirement short of the next tier, name the cheapest evidence that would
raise it. Separately rate usefulness High, Medium, Low or Unknown from the
given user/workflow context; rarity and usefulness must not influence each
other. Count recorded historical evidence within its scope, and preserve
its age and limits instead of demanding a fresh rerun by default." If you
can't, write the strongest case that each item is Common before rating it.
If the subagent fails to start (for example a model error), retry once with
another model before falling back, and say in the table header which rater
was used.

| Rarity | Needs all of | Forms |
|---|---|---|
| **Common** | anything below Rare | retain according to usefulness; user-selected publication is allowed without novelty claims |
| **Rare** | a real query; a cited search that found nothing equivalent, **or** a measured edge over the closest result; proof it works | gist, short post, or a small repo or skill |
| **Epic** | Rare, plus a measured edge over a named alternative, and it runs from a clean clone | repo or skill, post, demo, launch drafts |

Place each item with this checklist, not a gut call:

1. a real query
2. a cited search that found nothing equivalent, **or** a measured edge over the closest result
3. proof it works
4. a measured edge over a named alternative
5. it runs from a clean clone

1–3 met: Rare. All 5: Epic. Exactly one missing from the next tier up is a
near miss (see below). A search for the name only, or no search tool,
counts as item 2 missing.

Hard rules:

- "not checked" or "no proof" means Common, however good it feels.
- Something equivalent exists and the edge isn't measured: Common. An edge
  argued from other projects' READMEs is not measured.
- Ties round down.
- **Near misses get a next step.** An item one requirement short of the next
  tier is labelled `[COMMON, near Rare]` or `[RARE, near Epic]` and gets a
  `next:` line: the cheapest evidence that would raise it, and roughly how
  long it takes. That turns a "no" into a to-do the user can choose. It's
  only a near miss if that evidence could plausibly exist. If the closest
  result already does the same thing (official docs describing the same
  fix, a standard setting, a tool that does it generically), it's plain
  Common: timing your copy against the documented method is not an edge.
- The author's opinion of the item is not evidence.
- Expect nearly everything to be Common. If more than one item in a session
  rates above Common, say why this session is the exception.
- Common describes public distinction only. A Common item can have High
  usefulness and deserve a detailed reusable skill or an explicit publication.
<!-- rater:end -->

In full assessment, show both ratings, with evidence for anything above
Common, and ask what to prepare only if the user has not already selected it:

```
LOOT: 3 drops
1. [RARE | usefulness: High] remotion-ae-transitions: After Effects-style transitions in Remotion, fully local
   useful because: the workflow repeatedly needed these transitions
   query: "remotion after effects transitions"
   search: @remotion/transitions (slides, fades, wipes), one paid template pack; none do these
   proof: 6 transitions rendered and approved in the session
   edge: not measured, so not Epic → gist + short post
   next: render the same 3 shots with @remotion/transitions and compare; then a clean-clone run (~45 min)
2. [COMMON | usefulness: High] ffmpeg two-pass trick: recurring export-size fix; documented elsewhere → LOOT.md
3. [COMMON | usefulness: Medium] custom font loader: avoids redoing this project's setup → LOOT.md
Ship which? (numbers, "all", or "none")
```
