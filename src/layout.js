import { site, profile } from './content.js';
import { esc, icon, link } from './components.js';

const nav = [
  ['Projects', '/#projects'],
  ['Experience', '/#experience'],
  ['Skills', '/#skills'],
  ['Education', '/#education'],
  ['Contact', '/#contact'],
];

export function layout({ title, description, path = '/', body, pageClass = '' }) {
  const url = site.url + path;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(profile.name)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}${site.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0f1e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add('js');(function(){try{var t=localStorage.getItem('theme');}catch(e){}if(!t){t=window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap"></noscript>
<link rel="stylesheet" href="/site.css">
<script src="/site.js" defer></script>
</head>
<body class="${pageClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">YC</span><span class="brand-name">${esc(profile.name)}</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul role="list">${nav.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
      <a class="btn btn-sm btn-primary nav-cv" href="${site.cv}" download>${icon('download', 16)} CV</a>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn" data-theme-toggle aria-label="Switch to light theme">${icon('sun')}${icon('moon')}</button>
      <button type="button" class="icon-btn menu-btn" data-menu-toggle aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">${icon('menu')}${icon('close')}</button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="container footer-inner">
    <p>© ${new Date().getFullYear()} ${esc(profile.name)} · ${esc(profile.location)}</p>
    <ul class="footer-links" role="list">
      <li>${link('mailto:' + profile.email, 'Email')}</li>
      <li>${link(profile.linkedin, 'LinkedIn')}</li>
      <li>${link(profile.github, 'GitHub')}</li>
      <li><a href="${site.cv}" download>CV (PDF)</a></li>
    </ul>
  </div>
</footer>
</body>
</html>`;
}
