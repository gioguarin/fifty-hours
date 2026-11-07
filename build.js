#!/usr/bin/env node
/**
 * Builds index.html for the "Fifty hours with uncensored local models" page
 * from ../../writeup/WRITEUP.md.
 *
 * marked is taken from the local DSH installation; override with MARKED_PATH.
 */
const fs = require("fs");
const path = require("path");

const MARKED =
  process.env.MARKED_PATH ||
  "/Users/riot/deepseek-harness/node_modules/.pnpm/marked@16.4.2/node_modules/marked";

let marked;
try {
  ({ marked } = require(MARKED));
} catch (err) {
  console.error("Could not load marked from " + MARKED);
  console.error("Set MARKED_PATH to a directory containing marked. " + err.message);
  process.exit(1);
}

const HERE = __dirname;
const SRC = path.resolve(HERE, "../../writeup/WRITEUP.md");

if (!fs.existsSync(SRC)) {
  console.error("Source not found: " + SRC);
  process.exit(1);
}

let md = fs.readFileSync(SRC, "utf8");

// --- 1. Links into the private lab would 404 on a public site; show the path instead.
let delinked = 0;
md = md.replace(/\[([^\]]+)\]\((\.\.\/[^)]+)\)/g, (_m, _label, target) => {
  delinked++;
  return "`" + target + "`";
});

// --- 2. Render. GFM gives us tables, strikethrough, autolinks.
let html = marked.parse(md, { gfm: true, breaks: false });

// --- 3. GitHub-compatible heading ids, so the document's own TOC links resolve.
const used = new Map();
function slugify(text) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
  const n = used.get(base) || 0;
  used.set(base, n + 1);
  return n === 0 ? base : base + "-" + n;
}

const sections = [];
html = html.replace(/<h([23])>([\s\S]+?)<\/h\1>/g, (_m, level, inner) => {
  const plain = inner.replace(/<[^>]+>/g, "").trim();
  const id = slugify(plain);
  if (level === "2") sections.push({ id, text: plain });
  return '<h' + level + ' id="' + id + '">' + inner + "</h" + level + ">";
});

// --- 3b. Mount points for the animated figures (anim/motion.js fills these).
const MOTIFS = {
  timeline: "timeline",
  "the-head-to-head-benchmark": "pipeline",
  "overconfidence-and-how-it-was-contained": "calibration",
  "willingness-vs-capability": "willingness-skill",
  "the-exploit-lab": "exploit-lab",
  "a-wrong-verifier-is-worse-than-none": "verifier",
};

const mounted = new Set();
html = html.replace(/<(h[23]) id="([^"]+)">([\s\S]*?)<\/\1>/g, (match, _tag, id) => {
  const motif = MOTIFS[id];
  if (!motif) return match;
  mounted.add(id);
  return (
    match +
    '\n<figure class="motif-figure"><div class="motif-scroll">' +
    '<div class="motif-slot" data-motif="' +
    motif +
    '"></div></div>' +
    '<figcaption class="motif-hint">Scroll to explore</figcaption></figure>'
  );
});

const unmounted = Object.keys(MOTIFS).filter((id) => !mounted.has(id));
if (unmounted.length) {
  console.error("Motif anchor(s) not found in document: " + unmounted.join(", "));
  process.exit(1);
}

// --- 4. Tables need a scroll container on narrow screens.
html = html
  .replace(/<table>/g, '<div class="table-wrap"><table>')
  .replace(/<\/table>/g, "</table></div>");

// --- 5. Verify every in-document TOC anchor actually exists.
const anchors = [...md.matchAll(/\]\(#([a-z0-9-]+)\)/g)].map((m) => m[1]);
const ids = new Set([...html.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]));
const broken = anchors.filter((a) => !ids.has(a));
if (broken.length) {
  console.error("Broken TOC anchors: " + broken.join(", "));
  process.exit(1);
}

// --- 5b. Hero stat band and eyebrow. Numbers copied verbatim from the
// document's own "Headline numbers" table and executive summary.
const HERO = `<dl class="stat-band" aria-label="Headline results">
  <div class="stat">
    <dt>Refusals, uncensored 120B vs its clean base</dt>
    <dd class="fig">0<small>/14</small> <small>vs</small> 6<small>/14</small></dd>
    <dd class="note">Both judges agreed 100% of the time</dd>
  </div>
  <div class="stat">
    <dt>Fabricated impacket scripts accepted as real</dt>
    <dd class="fig">10<small>/10</small></dd>
    <dd class="note">Fabricated CVE ids: 0/10 first run, 1/10 rebuilt</dd>
  </div>
  <div class="stat">
    <dt>Working exploits, parallel container trials</dt>
    <dd class="fig">10<small>/10</small></dd>
    <dd class="note">Each trial in its own container</dd>
  </div>
  <div class="stat is-retracted">
    <dt>Capability gain of the uncensored build</dt>
    <dd class="fig"><del>+0.62</del> +0.12</dd>
    <dd class="note">95% CI &minus;0.58 to +0.83, includes zero</dd>
  </div>
</dl>`;

if (!html.includes("<h1>") || !html.includes("<p><strong>Contents</strong></p>")) {
  console.error("Hero anchors missing from rendered HTML (h1 / Contents paragraph).");
  process.exit(1);
}
html = html.replace("<h1>", '<p class="eyebrow">Research write-up</p>\n<h1>');
html = html.replace(
  "<p><strong>Contents</strong></p>",
  HERO + "\n<p><strong>Contents</strong></p>"
);

// --- 6. Assemble.
const words = md.split(/\s+/).filter(Boolean).length;
const nav = sections
  .map((s) => '        <li><a href="#' + s.id + '">' + s.text + "</a></li>")
  .join("\n");

const description =
  "A fifty-hour study of uncensored local models: a 14-task security benchmark, " +
  "tests for invented tool names and CVE ids, and a containerised exploit lab that " +
  "they actually break out of.";

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fifty hours with uncensored local models</title>
<meta name="description" content="${description}">
<meta name="author" content="Gio">
<meta property="og:type" content="article">
<meta property="og:title" content="Fifty hours with uncensored local models">
<meta property="og:description" content="${description}">
<meta property="og:url" content="https://gioguarin.github.io/fifty-hours/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="anim/motion.css">
<link rel="stylesheet" href="anim/responsive.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="layout">
  <nav class="sidebar" aria-label="On this page">
    <p class="sidebar-label">On this page</p>
    <ol>
${nav}
    </ol>
  </nav>
  <main class="content" id="main">
${html}
  </main>
</div>
<footer class="site-footer">
  <span>Written Nov 4&ndash;6, 2026 &middot; ${words.toLocaleString()} words</span>
  <span>Supporting artifacts live in a private repository</span>
  <span>Published with GitHub Pages</span>
</footer>
<script src="anim/motion.js" defer></script>
<script>
/* Active-section marker for browsers without :target-current (Safari/Firefox). */
(function () {
  if (window.CSS && CSS.supports && CSS.supports("selector(:target-current)")) return;
  var links = [].slice.call(document.querySelectorAll(".sidebar a"));
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.charAt(0) === "#") map[id.slice(1)] = a;
  });
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (map[e.target.id]) map[e.target.id].setAttribute("aria-current", "true");
    });
  }, { rootMargin: "0px 0px -75% 0px" });
  document.querySelectorAll("main h2[id]").forEach(function (h) {
    if (map[h.id]) io.observe(h);
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(HERE, "index.html"), page);

const tables = (html.match(/<table>/g) || []).length;
console.log("Wrote index.html");
console.log("  words:      " + words);
console.log("  sections:   " + sections.length);
console.log("  headings:   " + ids.size);
console.log("  tables:     " + tables);
console.log("  de-linked:  " + delinked + " private-lab links");
console.log("  toc anchors: " + anchors.length + "/" + anchors.length + " resolve");
