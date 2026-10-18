# Changelog

## 1.6.0 — 2026-10-19

- Make `/loot` a lightweight capture pass; `/loot capture` explicitly selects it and `/loot assess` opts into researched rarity and independent review.
- Add independent High/Medium/Low/Unknown usefulness ratings. Unassessed rarity stays Not assessed; useful Common work may be explicitly selected for publication.
- Accept traceable historical checks within their demonstrated scope, label evidence provenance, and reserve reruns for changed conditions or current validation claims.
- Make ordinary `--auto` lightweight; explicit `assess --auto` retains full assessment. Both write only `LOOT.md`, even with shipping arguments.
- Add dual-rating fixtures and scoring while preserving the original rarity-only scoring interface.

The original rarity-only and head-to-head benchmark results remain historical; they have not been rerun as comparative measurements of this capture mode.
