# Ship: commands and fallbacks

Only after the user said yes to the manifest. Use tools that are already signed
in. If one isn't, give the user the command or file instead and move on.

## GitHub repo

Check sign-in first: `gh auth status`.

```bash
cd <slug>
gh repo create <name> --public --source . --push --description "<tagline>"
gh repo edit --add-topic <topic1> --add-topic <topic2>
```

Use `--private` when the user asked for private. Skill repos: add the topics
`agent-skills` and `claude-code`.

No `gh`: print the steps (create the repo on github.com, then
`git remote add origin …` and `git push -u origin main`).

## Gist

```bash
gh gist create <file> --public --desc "<one line>"
```

## dev.to

Only when `DEVTO_API_KEY` is already set in the environment. Create a **draft**;
the user publishes it.

```bash
node -e '
const fs = require("fs");
const body = fs.readFileSync(process.argv[1], "utf8");
fetch("https://dev.to/api/articles", {
  method: "POST",
  headers: { "api-key": process.env.DEVTO_API_KEY, "content-type": "application/json" },
  body: JSON.stringify({ article: { body_markdown: body, published: false } }),
}).then(r => r.json()).then(j => console.log(j.url ?? j));
' post.md
```

The post's front matter (title, tags, canonical_url) is read by dev.to.

## Hashnode

Only when a Hashnode token and publication ID are already configured. Use their
GraphQL API (`https://gql.hashnode.com`, mutation `createDraft`). Otherwise hand
over the Markdown file.

## Medium

No public API for new integrations. Publish the post somewhere first (dev.to,
the repo, a blog), then tell the user to use Medium's "Import a story"
(medium.com/p/import) with that URL. That also sets the canonical link.

## Demo video with Remotion

Needs Node 18+. Remotion downloads its own headless browser on first render.

```bash
npx create-video@latest demo --blank
cd demo && npm i
# write src/Composition.tsx: a few <Sequence>s for problem → action → result,
# using screenshots in public/ and on-screen captions
npx remotion render <CompositionId> out/demo.mp4
npx remotion render <CompositionId> out/demo.gif --every-nth-frame=2 --scale=0.5
```

Put the GIF at the top of the README; attach the MP4 to the post and launch
drafts. Keep `demo/` out of the main repo unless the demo is part of the
product (add it to `.gitignore` or a separate folder).

No Node: take screenshots of each step and make a GIF with any tool the user
has, or ship screenshots only.

## Final report

End with a short list:

- what shipped, each with its link
- what is waiting for the user (publish the draft, post the launch drafts)
- what you skipped and why
