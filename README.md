# Fifty hours with uncensored local models

Source for **https://gioguarin.github.io/fifty-hours/** — a write-up of fifty hours
building a security benchmark, an identifier-hallucination suite, and a containerised
exploit lab around uncensored local models.

Static HTML, no build step at deploy time. GitHub Pages serves `index.html` directly
from `main` (see `.nojekyll`).

## Files

| File | Purpose |
|---|---|
| `index.html` | The generated page. Committed, so Pages has nothing to build. |
| `style.css` | All styling: sticky sidebar, tables, code blocks, print rules. |
| `build.js` | Generator. Reads the Markdown source and writes `index.html`. |
| `.nojekyll` | Tell Pages not to run Jekyll. |

## Rebuilding

The Markdown lives outside this repo, in the private research workspace. `build.js`
reads it by relative path:

```
../../writeup/WRITEUP.md
```

```bash
node build.js
```

It uses `marked` from the local DeepSeek Harness install; point `MARKED_PATH` at a
directory containing `marked` to override. The script fails loudly rather than
emitting a page with broken anchors if the document's table of contents stops
matching its headings.

## Notes

- Links into the private lab (`../sec-bench/...`) are rendered as plain code paths,
  since those targets are not public.
- The page is a single document on purpose: it reads top to bottom, and the sidebar
  tracks the twelve top-level sections.
