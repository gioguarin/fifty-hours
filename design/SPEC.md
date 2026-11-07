# Design spec — "Fifty hours with uncensored local models"

**Direction.** A well-set journal essay, not a landing page. Warm paper, Charter serif for *everything that is read* (including h1/h2, which were sans), sans only for *apparatus* (sidebar, tables, labels, h3), mono for numbers-as-identifiers. Two inks: a cool **ink-blue** for navigation/links, and a **red-pen rust** used for exactly one idea — *correction*. It appears on the retraction callout, the "What we got wrong" section, the retracted stat, the active nav marker, and the reading-progress bar. Because rust means "we were wrong here", the page's emotional core is legible before it is read. Everything is a system font; the only requests are `index.html` and the CSS.

Implemented as `/style.css` (the stylesheet) and the `HERO` constant in `/build.js` (the stat band).
The theme works with **zero markup changes** (everything below marked *optional* is additive polish).

## Tokens

| Group | Light | Dark |
|---|---|---|
| bg / surface | `#fbf9f4` / `#fff` | `#171612` / `#1e1d19` |
| body ink / strong ink | `#2c2a25` (13.6:1) / `#1b1a17` | `#dedad0` (13.0) / `#f1eee6` |
| muted | `#5b564c` (6.9:1; 6.2 on code-bg, 6.3 on rust-bg) | `#aaa598` (7.4) |
| link | `#1c4e80` (8.1) | `#8fbdf0` (9.2) |
| accent (red pen) | `#a13a14` (6.4; 5.8 on its tint) | `#f09a70` (8.2; 7.5 on tint) |
| rules | `#e4ded1` / `#cfc7b5` | `#302e27` / `#46433a` |
| code pre | `#1d1e22` on `#e8e6e1` (13.4) | `#0f0f11` (15.4) |

All pairs computed (WCAG relative luminance); minimum anywhere is 5.8:1. Dark mode is a full token swap under `prefers-color-scheme`, checked by screenshot (top, errata, tables, code). Dark pre is darker than the page so code still reads as an inset.

**Type** (base 18px, ~1.25 display steps): body 1.125rem / 1.66; lead 1.25rem; h1 2.75rem/1.08; h2 1.75rem/1.2; h3 1.0625rem sans 650; table/UI 0.875rem; labels 0.75rem uppercase +0.06–0.14em tracking. Steps shrink at 980px and 640px. Measure `41rem` ≈ 70 characters.
**Spacing**: 4px grid, `--s1…--s8` (0.25 → 4.5rem). h2s get 4.5rem above, so sections breathe and the page has rhythm rather than a wall of rules.
**Radii**: 3px / 6px. Paper has corners, not pills.

## What changed and why

- **Hierarchy.** h1/h2 moved to the serif at heavier weight with `text-wrap: balance`; h3 stays sans as a run-in label. Each h2 gets a CSS counter eyebrow (`01`–`12`, mono, matches the sidebar numbers; `content: … / ""` keeps it out of the accessibility tree). Paragraphs use `text-wrap: pretty`.
- **Sidebar.** Numbered, with the **active section marked CSS-only** via `scroll-target-group` + `:target-current` (Chrome/Edge 140+; verified in Chrome 156). Elsewhere it falls back to an `aria-current="true"` hook (JS snippet below, optional). Below 980px it becomes a sticky horizontal tab strip (one row, edge-faded, scrollable) instead of 12 wrapped chips stacked above the article — a persistent navigator on mobile.
- **Reading progress.** 3px rust bar, pure CSS (`animation-timeline: scroll()`), inside `@supports`; silently absent where unsupported; disabled for print.
- **Signature: "What we got wrong, and fixed".** Thicker rust top rule; the one-line thesis ("This is the part worth reading first…") set as an italic pull-quote with a rust bar; the ten errors become a tinted **ledger** with mono rust numbers `01…10` and hairline dividers. Still ordinary `<ol>` prose underneath. Selected structurally (`#what-we-got-wrong-and-fixed + p + ol`), so no markup is needed.
- **Retraction callout.** In the executive summary, the paragraph "One result did not survive…" gets the same rust bar + tint (selector `#executive-summary + p + p + p + p`; also available as `.retraction`).
- **Tables** — booktabs: 2px ink rules top and bottom, one hairline under a small-caps muted header, hairlines between rows, no cell boxes, no zebra (a bold first column is the row label). `tabular-nums` throughout. `th/td[align=right]` and `.num` are right-aligned if ever emitted. `td code` loses its pill so file names don't look like buttons. Scroll affordance on mobile: gradient edge shadows that appear only when the table is clipped (`background-attachment: local/scroll` trick). 390px: 0px horizontal page overflow, verified.
- **Code.** Inline `code` is warm-tinted (`#f0ece2`, brown ink) so it sits in the paper palette; `pre` is a dark inset with a hairline border and a small language tag (`BASH`) when the generator emits `class="language-bash"` (it does).
- **Contents box.** Label "Contents" becomes a small-caps eyebrow; list is two columns ≥720px.
- **Footer.** Aligns to the content column, middle-dot separators, small muted sans.
- **Fix to a latent bug.** `~20 tok/s (… ~47 GB wired)` renders as strike-through `<del>` in the generated HTML (marked parses `~…~` as GFM strikethrough). `theme.css` neutralises `del` so the text isn't struck out. (Real fix: escape the tildes in WRITEUP.md or pass `{ gfm:true }` with a strikethrough-off extension.) The hero uses `<del>` deliberately for the superseded +0.62, scoped to `.stat .fig del`.
- **A11y.** `:focus-visible` 2px outlines everywhere; no meaning by color alone (retraction = strike-through + the word "Retracted"; errata = numerals + position); `prefers-reduced-motion` kills smooth scroll/transitions (progress bar is scroll-driven, not time-driven); underlined links; decorative counters hidden from AT.
- **Print.** Retained and improved: sidebar/footer/progress hidden, tokens flipped to black-on-white, 10.5pt, `break-inside: avoid` on tables/pre/stats/list items, pre wraps, `@page` margins. Smoke-tested with print emulation + `page.pdf()` (21 A4 pages).

## Markup changes required

**None are required** (all of the below are now implemented in `build.js`). Everything in `theme.css` keys off existing elements, ids and structure. Recommended, in order of value:

1. **Hero stat band** (the headline numbers above the fold). Paste `design/hero.html` into the build template directly after the dek `<p><em>What was built…</em></p>` and before `<p><strong>Contents</strong></p>`. In `build.js` the h1 and dek come from the markdown, so the simplest approach is a string replace on the rendered HTML:
   ```js
   html = html.replace("<p><strong>Contents</strong></p>", HERO_HTML + "\n<p><strong>Contents</strong></p>");
   ```
   Numbers in it are copied verbatim from the existing "Headline numbers" table and exec summary; the `0/14 vs 6/14` figure is two tokens with a small "vs". The retracted card is `class="stat is-retracted"` (adds the word "Retracted" and rust colour; the `<del>` strike is intentional).
2. **Eyebrow above h1** (optional): `html = html.replace("<h1>", '<p class="eyebrow">Research write-up</p>\n<h1>');`
3. **Skip link** (optional; styled): first child of `<body>`: `<a class="skip-link" href="#main">Skip to content</a>` and `<main class="content" id="main">`.
4. **Active-section highlight for Safari/Firefox** (optional; ~10 lines, Chrome/Edge don't need it). Before `</body>`:
   ```html
   <script>
   (function(){
     if (CSS.supports('selector(:target-current)')) return;
     var links=[].slice.call(document.querySelectorAll('.sidebar a'));
     var map={}; links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
     var io=new IntersectionObserver(function(es){
       es.forEach(function(e){ if(e.isIntersecting){
         links.forEach(function(a){a.removeAttribute('aria-current');});
         map[e.target.id].setAttribute('aria-current','true'); } });
     },{rootMargin:'0px 0px -75% 0px'});
     document.querySelectorAll('main h2[id]').forEach(function(h){ if(map[h.id]) io.observe(h); });
   })();
   </script>
   ```
   (Without it, non-Chromium browsers simply show no active marker; nothing breaks. Inline script is not an external request.)
5. **Footer** (optional): the existing three `<span>`s are fine; the theme adds the separators. Optionally add `<span>By Gio</span>` as the first span.
6. Optional hardening classes if the build can add them: `class="retraction"` on the "One result did not survive" paragraph, `class="errata"` on the ten-item `<ol>`. The structural selectors work today but would break if the author inserts a paragraph above them.

## New classes (all optional)
`.eyebrow`, `.stat-band`, `.stat` (+`.is-retracted`), `.fig`, `.note` (inside `.stat`), `.skip-link`, `.retraction`, `.errata`, `.num` (right-align a numeric `th`/`td`). Structural hooks the theme relies on: `.content > h1 + p` (dek), `.content > ol:first-of-type` (Contents), the `<p>` containing "Contents" directly before it (`p:has(+ ol + hr + h2#executive-summary)`), `#executive-summary + p…`, `#what-we-got-wrong-and-fixed + p + ol`.

## Browser support notes
`:has()`, `color-mix()`, `text-wrap`, `:target-current`, `animation-timeline` are progressive: base layout is intact without any of them. The `p:has(+ ol…)` Contents-label rule and the `pre:has(> code[class*=language-])` tag need `:has()` (all evergreen browsers since 2023); without it the Contents label is simply a normal bold line and the language tag is absent.

## Tried / didn't work
- First pass of the retracted stat used an inline "Retracted ·" prefix that collided with the label; switched to a block label.
- Contents label initially targeted `h1 ~ p:nth-of-type(2)`, which matched the wrong paragraph once the hero inserts an element; replaced with the `:has()` sibling selector above.
- An injected "Errata" word in the section eyebrow was removed (CSS-added words are content; the design should not add copy). The eyebrow shows only the number.
- Whole-page zebra striping on tables looked heavy against the paper tone; booktabs rules read better and keep numerics aligned.
- Dense tables (K-curve, 5 numeric columns) are not right-aligned because the markdown has no alignment markers; headers and cells still share tabular figures so columns line up. If the author uses `|---:|` in the source, `align="right"` is honoured automatically.
