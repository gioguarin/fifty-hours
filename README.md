# Fifty hours with uncensored local models

Source for **https://gioguarin.github.io/fifty-hours/** — a write-up of fifty hours
building a security benchmark, an identifier-hallucination suite, and a containerised
exploit lab around uncensored local models.

Static HTML, no build step at deploy time. GitHub Pages serves `index.html` directly
from `main` (see `.nojekyll`).

## Files

| Path | Purpose |
|---|---|
| `index.html` | The generated page. Committed, so Pages has nothing to build. |
| `style.css` | The stylesheet: warm-paper journal setting, dark mode, print rules. |
| `build.js` | Generator. Reads the Markdown source and writes `index.html`. |
| `anim/` | Six animated figures, plus the mobile/responsive layer. |
| `design/` | Design rationale and token system (`SPEC.md`). |
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
matching its headings, or if a section it mounts a figure after no longer exists.

## The figures

`anim/motion.js` is dependency-free vanilla JS that builds inline SVG. Six mount
points are emitted by `build.js` as `<div class="motif-slot" data-motif="…">`:

| Motif | Placed after | Shows |
|---|---|---|
| `timeline` | `#timeline` | The ~50 hours, prequel vs session |
| `pipeline` | `#the-head-to-head-benchmark` | 14 tasks × 11 models → 154 judged rows |
| `calibration` | `#overconfidence-and-how-it-was-contained` | +0.62 collapsing to +0.12, CI crossing zero |
| `willingness-skill` | `#willingness-vs-capability` | Two axes, not one score |
| `exploit-lab` | `#the-exploit-lab` | Ten isolated container trials, 10/10 |
| `verifier` | `#a-wrong-verifier-is-worse-than-none` | The buggy check that let fabrications through |

Behaviour worth knowing:

- Figures animate once when scrolled into view and pause when off-screen.
- `prefers-reduced-motion: reduce` renders the final frame immediately.
- Each slot reserves its height via `aspect-ratio`, so nothing shifts on load.
- Below 760px the figures render at 640px wide inside a horizontal scroller rather
  than shrinking 14px type down to ~7px. `anim/responsive.css` holds that layer,
  the scroll hint, and the palette alignment that keeps diagrams in the page's
  link blue (the rust accent stays reserved for corrections).

## Notes

- Links into the private lab (`../sec-bench/...`) are rendered as plain code paths,
  since those targets are not public.
- The only remote requests are `index.html` and its CSS. No fonts, no CDN, no
  analytics.
- In dark mode the two verifier cards keep their pale fills deliberately; text on
  them is pinned dark via `.motif-on-light` so it stays readable.
