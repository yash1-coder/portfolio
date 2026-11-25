// Dependency-free static site build. Usage: node build.mjs  →  dist/
import { mkdirSync, rmSync, writeFileSync, cpSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, profile } from './src/content.js';
import { layout } from './src/layout.js';
import { homeBody } from './src/home.js';
import { caseStudies } from './src/case-studies.js';
import { projects } from './src/content.js';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const write = (rel, content) => {
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

// Pages
write(
  'index.html',
  layout({
    title: `${profile.name} | Data, BI, Applied ML & Backend Engineering`,
    description: `${profile.name}: MSc Advanced Computer Science (Distinction), University of Leicester. Power BI and Microsoft Fabric reporting, explainable AI research and Flask/MySQL applications. Open to graduate and junior roles in the UK.`,
    path: '/',
    body: homeBody(),
    pageClass: 'page-home',
  })
);

const paths = ['/'];
for (const cs of caseStudies) {
  const p = projects.find((x) => x.slug === cs.slug);
  const path = `/projects/${cs.slug}`;
  paths.push(path);
  write(
    `projects/${cs.slug}/index.html`,
    layout({ title: `${p.title} | Case study | ${profile.name}`, description: cs.description, path, body: cs.render(), pageClass: 'page-case' })
  );
}

write(
  '404.html',
  layout({
    title: `Page not found | ${profile.name}`,
    description: 'Page not found.',
    path: '/404',
    body: `<section class="section"><div class="container narrow"><p class="kicker">404</p><h1>Page not found</h1><p class="section-lede">That page doesn't exist. <a class="text-link" href="/">Go to the homepage</a> or <a class="text-link" href="/#projects">see projects</a>.</p></div></section>`,
  })
);

// Assets
write('site.css', readFileSync(join(root, 'src/site.css')));
write('site.js', readFileSync(join(root, 'src/site.js')));
cpSync(join(root, 'assets/img'), join(out, 'img'), { recursive: true, filter: (s) => !s.endsWith('manifest.json') });
cpSync(join(root, 'assets/Yash_Chourasia_CV.pdf'), join(out, 'Yash_Chourasia_CV.pdf'));
cpSync(join(root, 'assets/og.png'), join(out, 'og.png'));
cpSync(join(root, 'assets/favicon.svg'), join(out, 'favicon.svg'));

// SEO files
const today = new Date().toISOString().slice(0, 10);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${paths.length} pages + 404 into dist/`);
