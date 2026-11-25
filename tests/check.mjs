// Dependency-free checks on the built site (dist/).
// Verifies: required pages exist, internal links/anchors resolve, images exist and have alt text,
// external links open safely, banned unverified claims are absent, and the synthetic-data label is present.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const fail = (m) => errors.push(m);

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const routeOf = (file) => '/' + relative(dist, file).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
const pages = new Map(htmlFiles.map((f) => [routeOf(f) === '/' ? '/' : routeOf(f), readFileSync(f, 'utf8')]));

const required = ['/', '/projects/colouring-black-boxes', '/projects/intelligent-defence-system', '/projects/softsensor-bi', '/404'];
for (const r of required) if (!pages.has(r)) fail(`Missing page ${r}`);
for (const f of ['Yash_Chourasia_CV.pdf', 'sitemap.xml', 'robots.txt', 'og.png', 'favicon.svg', 'site.css', 'site.js'])
  if (!existsSync(join(dist, f))) fail(`Missing file ${f}`);

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const resolveFile = (path) => {
  const clean = path.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return '/';
  if (pages.has(clean.replace(/\/$/, ''))) return clean.replace(/\/$/, '');
  if (existsSync(join(dist, clean))) return clean;
  return null;
};

for (const [route, html] of pages) {
  // Unique IDs
  const all = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = all.filter((x, i) => all.indexOf(x) !== i);
  if (dup.length) fail(`${route}: duplicate ids ${[...new Set(dup)].join(', ')}`);

  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${route}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${route}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${route}: missing canonical`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${route}: expected exactly one <h1>`);

  // Links
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids(html).has(href.slice(1))) fail(`${route}: broken anchor ${href}`);
      continue;
    }
    const target = resolveFile(href);
    if (!target) { fail(`${route}: broken link ${href}`); continue; }
    const hash = href.split('#')[1];
    if (hash && pages.has(target) && !ids(pages.get(target)).has(hash)) fail(`${route}: broken anchor ${href}`);
  }
  // External links in new tabs must be noopener
  for (const [tag] of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) if (!/rel="noopener noreferrer"/.test(tag)) fail(`${route}: target=_blank without rel: ${tag}`);
  // Images
  for (const [tag] of html.matchAll(/<img [^>]*>/g)) {
    const src = (tag.match(/src="([^"]*)"/) || [])[1];
    if (src && !existsSync(join(dist, src))) fail(`${route}: missing image ${src}`);
    if (!/\salt="[^"]+"/.test(tag) && !tag.includes('alt=""')) fail(`${route}: image without alt ${src}`);
    if (src && !/\swidth="\d+"/.test(tag)) fail(`${route}: image without width ${src}`);
  }
  // Buttons need an accessible name
  for (const [tag, inner] of html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)) {
    const text = inner.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    if (!text && !/aria-label="[^"]+"/.test(tag)) fail(`${route}: button without accessible name`);
  }
  // Content guardrails: unverified claims removed during the audit must not come back.
  const text = html.replace(/<[^>]+>/g, ' ');
  for (const banned of [/25% improvement/i, /35% increase/i, /user satisfaction/i, /Grad-CAM\+\+/, /production-ready/i, /real-time/i, /MSc student/i, /expected completion/i, /Jan 2024 – Dec 2024/])
    if (banned.test(text)) fail(`${route}: contains removed claim ${banned}`);
}

// Synthetic dashboard must always carry its label
const ss = pages.get('/projects/softsensor-bi') || '';
if (!ss.includes('Illustrative dashboard using synthetic data. Not an actual client dashboard.')) fail('SoftSensor page: synthetic-data label missing');

// Dissertation figures must match the source CSV
const xaiPage = pages.get('/projects/colouring-black-boxes') || '';
for (const v of ['98.62', '94.74', '81.95', '0.7886', '0.9998', '0.2686']) if (!xaiPage.includes(v)) fail(`XAI page: expected metric ${v}`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${pages.size} pages checked: links, anchors, images, alt text, metadata and content guardrails OK`);
