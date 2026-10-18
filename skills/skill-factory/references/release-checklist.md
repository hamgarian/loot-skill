# Release checklist

Each item: PASS or FAIL, with file:line evidence.

1. SKILL.md has valid frontmatter: `name` (kebab-case) and a `description` saying what it does and when to trigger.
2. Every acceptance item in SPEC.md is covered by a test or eval that was actually run and passed.
3. README starts with the result, then a quickstart that works from a clean clone.
4. Every number or claim in README/SKILL.md (speed, accuracy, "works with X") is backed by a test, eval or benchmark output in the repo. No self-assigned ratings or scores without evidence.
5. LICENSE present; no code copied from projects with an incompatible license.
6. CHANGELOG.md has an entry for this version; version matches everywhere it appears.
7. Social preview image (1280x640) and logo present and referenced from README.
8. No secrets, tokens, personal data, private hostnames or hardcoded user paths (loot's `scripts/scan.mjs`, plus `gitleaks dir` if installed).
9. No dead code, unused files or placeholder text ("TODO", "lorem", "<your-name>").
10. The skill installs where the target agent loads skills and loads without errors.
