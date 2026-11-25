import { site, profile, achievements, pathways, projects, experience, education, certifications, leadership, skillGroups, defenceResults } from './content.js';
import { esc, icon, link, tags, illustrativeDashboard, defenceMiniChart } from './components.js';

const heroNetwork = `<svg class="hero-network" viewBox="0 0 480 420" aria-hidden="true" focusable="false">
  <g class="net-edges">
    <path d="M60 80 L190 140 L330 70 L430 170 L330 270 L190 140 M190 140 L150 290 L330 270 M150 290 L60 360 M330 270 L400 370 M60 80 L150 290"/>
  </g>
  <g class="net-nodes">
    <circle cx="60" cy="80" r="5"/><circle cx="190" cy="140" r="8" class="n-hi"/><circle cx="330" cy="70" r="5"/>
    <circle cx="430" cy="170" r="6"/><circle cx="330" cy="270" r="8" class="n-hi2"/><circle cx="150" cy="290" r="6"/>
    <circle cx="60" cy="360" r="4"/><circle cx="400" cy="370" r="5"/>
  </g>
  <g class="net-bars" transform="translate(300,330)"><rect x="0" y="20" width="10" height="20" rx="2"/><rect x="16" y="8" width="10" height="32" rx="2"/><rect x="32" y="0" width="10" height="40" rx="2"/></g>
</svg>`;

function projectVisual(p) {
  if (p.image?.src)
    return `<img src="${p.image.src}" width="${p.image.w}" height="${p.image.h}" alt="${esc(p.image.alt)}" loading="lazy" decoding="async">`;
  if (p.image?.kind === 'dashboard') return `<div class="card-visual-inner" role="img" aria-label="${esc(p.image.alt)}">${illustrativeDashboard({ compact: true })}</div>`;
  if (p.image?.kind === 'defence-chart')
    return `<div class="card-visual-inner card-chart"><p class="mini-title">Notebook accuracy, stratified 30% hold-out</p>${defenceMiniChart(defenceResults)}</div>`;
  return '';
}

function projectCard(p) {
  return `<article class="project-card reveal" data-categories="${p.categories.join(' ')}">
  <a class="card-visual" href="/projects/${p.slug}" tabindex="-1" aria-hidden="true">${projectVisual(p)}</a>
  <div class="card-body">
    <p class="eyebrow">${esc(p.categoryLabel)}</p>
    <h3><a href="/projects/${p.slug}" class="card-link">${esc(p.title)}</a></h3>
    <p class="card-sub">${esc(p.subtitle)}</p>
    <p class="card-problem"><span class="k">Problem</span> ${esc(p.problem)}</p>
    <ul class="outcomes" role="list">${p.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
    ${tags(p.tech)}
    <div class="card-actions">
      <a class="btn btn-sm btn-primary" href="/projects/${p.slug}">View case study ${icon('arrow', 16)}</a>
      ${p.repo ? link(p.repo, `${icon('github', 16)} Code`, 'btn btn-sm btn-ghost', `aria-label="${esc(p.title)} source code on GitHub"`) : `<span class="muted-note">${icon('lock', 14)} ${esc(p.repoNote)}</span>`}
    </div>
  </div>
</article>`;
}

function secondaryCard(p) {
  return `<article class="mini-card reveal" data-categories="${p.categories.join(' ')}">
  <p class="eyebrow">${esc(p.categoryLabel)}</p>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.subtitle)}</p>
  ${tags(p.tech, 'tag tag-sm')}
  <p class="mini-meta">${esc(p.meta)} · ${p.repo ? link(p.repo, `Code ${icon('external', 13)}`) : esc(p.repoNote)}</p>
</article>`;
}

export function homeBody() {
  const featured = projects.filter((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured);
  const allSkills = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.id })));

  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="status-pill"><span class="dot" aria-hidden="true"></span> Open to graduate &amp; junior roles in the UK</p>
      <h1 id="hero-title"><span class="hero-name">${esc(profile.name)}</span><span class="hero-headline">${esc(profile.headline)}</span></h1>
      <p class="hero-role">${esc(profile.roleLine)}</p>
      <p class="hero-intro">${esc(profile.intro)}</p>
      <p class="hero-position">${esc(profile.positioning)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#projects">View projects ${icon('arrow', 16)}</a>
        <a class="btn btn-ghost" href="${site.cv}" download>${icon('download', 16)} Download CV</a>
        <a class="btn btn-ghost" href="#contact">${icon('mail', 16)} Contact</a>
      </div>
      <ul class="hero-social" role="list">
        <li>${link(profile.github, `${icon('github')}<span class="sr-only">GitHub</span>`, 'icon-btn', 'aria-label="GitHub profile"')}</li>
        <li>${link(profile.linkedin, `${icon('linkedin')}<span class="sr-only">LinkedIn</span>`, 'icon-btn', 'aria-label="LinkedIn profile"')}</li>
      </ul>
    </div>
    <div class="hero-art">${heroNetwork}</div>
  </div>
  <div class="container">
    <ul class="achievements" role="list" aria-label="Selected verified achievements">
      ${achievements
        .map(
          (a) => `<li class="achievement reveal"><a href="${a.href}"><span class="a-value">${esc(a.value)}</span><span class="a-label">${esc(a.label)}</span><span class="a-context">${esc(a.context)}</span></a></li>`
        )
        .join('')}
    </ul>
  </div>
</section>

<section class="section" id="focus" aria-labelledby="focus-title">
  <div class="container">
    <header class="section-head"><p class="kicker">What I work on</p><h2 id="focus-title">Three ways in</h2>
    <p class="section-lede">Choose an area to see the projects and experience behind it.</p></header>
    <div class="pathways">
      ${pathways
        .map(
          (p, i) => `<button type="button" class="pathway reveal" data-pathway="${p.id}">
        <span class="pathway-icon" aria-hidden="true">${icon(['chart', 'brain', 'server'][i], 22)}</span>
        <span class="pathway-title">${esc(p.title)}</span>
        <span class="pathway-blurb">${esc(p.blurb)}</span>
        <span class="pathway-tools">${p.tools.map(esc).join(' · ')}</span>
        <span class="pathway-cta">See related work ${icon('arrow', 15)}</span>
      </button>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section-alt" id="projects" aria-labelledby="projects-title">
  <div class="container">
    <header class="section-head"><p class="kicker">Selected work</p><h2 id="projects-title">Featured projects</h2>
    <p class="section-lede">Each case study covers the problem, what I built, the evidence and its limits.</p></header>
    <div class="filters" role="group" aria-label="Filter projects by area">
      <button type="button" class="filter is-active" data-filter="all" aria-pressed="true">All</button>
      <button type="button" class="filter" data-filter="data" aria-pressed="false">Data &amp; BI</button>
      <button type="button" class="filter" data-filter="ml" aria-pressed="false">ML &amp; XAI</button>
      <button type="button" class="filter" data-filter="backend" aria-pressed="false">Backend</button>
    </div>
    <p class="sr-only" aria-live="polite" data-filter-status></p>
    <div class="project-grid" data-project-grid>${featured.map(projectCard).join('')}</div>
    <h3 class="sub-head" id="more-projects">Smaller projects</h3>
    <div class="mini-grid" data-project-grid>${secondary.map(secondaryCard).join('')}</div>
    <p class="empty-note" data-empty hidden>No projects in this area yet.</p>
  </div>
</section>

<section class="section" id="experience" aria-labelledby="exp-title">
  <div class="container">
    <header class="section-head"><p class="kicker">Career</p><h2 id="exp-title">Experience</h2></header>
    <ol class="timeline" role="list">
      ${experience
        .map(
          (e) => `<li class="tl-item tl-work reveal">
        <div class="tl-dot" aria-hidden="true"></div>
        <div class="tl-card">
          <div class="tl-head"><div><h3>${esc(e.role)} · ${esc(e.org)}</h3><p class="tl-place">${esc(e.place)}</p></div><p class="tl-dates">${esc(e.dates)}</p></div>
          <ul class="tl-impact" role="list">
            <li><strong>5</strong> Power BI dashboards</li><li><strong>15</strong> KPIs defined</li><li><strong>~8 hrs</strong> manual prep replaced per cycle</li><li><strong>2</strong> source systems consolidated</li>
          </ul>
          <ul class="tl-points">${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          ${tags(e.tags, 'tag tag-sm')}
          <a class="text-link" href="${e.caseStudy}">Read the BI case study ${icon('arrow', 15)}</a>
        </div>
      </li>`
        )
        .join('')}
      ${education
        .map(
          (ed) => `<li class="tl-item tl-edu reveal"><div class="tl-dot" aria-hidden="true"></div>
        <div class="tl-card tl-card-light"><div class="tl-head"><div><h3>${esc(ed.title)}</h3><p class="tl-place">${esc(ed.org)}</p></div><p class="tl-dates">${esc(ed.dates)}</p></div>
        <p>${esc(ed.note)} <a class="text-link" href="${ed.href}">Case study ${icon('arrow', 14)}</a></p></div></li>`
        )
        .join('')}
    </ol>
  </div>
</section>

<section class="section section-alt" id="skills" aria-labelledby="skills-title">
  <div class="container">
    <header class="section-head"><p class="kicker">Skills</p><h2 id="skills-title">Where each skill was used</h2>
    <p class="section-lede">Select a skill to see the project or role where I used it. I haven't given proficiency scores; the evidence is in the work.</p></header>
    <div class="skills" data-skills>
      <div class="skill-tabs" role="tablist" aria-label="Skill groups">
        ${skillGroups.map((g, i) => `<button type="button" role="tab" id="tab-${g.id}" aria-controls="panel-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g.name)}</button>`).join('')}
      </div>
      ${skillGroups
        .map(
          (g, i) => `<div class="skill-panel" role="tabpanel" id="panel-${g.id}" aria-labelledby="tab-${g.id}" ${i === 0 ? '' : 'hidden'}>
        <ul class="skill-chips" role="list">${g.skills
          .map((s, j) => `<li><button type="button" class="skill-chip" aria-pressed="${j === 0}" data-skill="${g.id}-${j}">${esc(s.name)}</button></li>`)
          .join('')}</ul>
      </div>`
        )
        .join('')}
      <div class="skill-usage" aria-live="polite">
        ${allSkills
          .map((s) => {
            const idx = skillGroups.find((g) => g.id === s.group).skills.indexOf(skillGroups.find((g) => g.id === s.group).skills.find((x) => x.name === s.name));
            return `<div class="usage" data-usage="${s.group}-${idx}" ${s.group === skillGroups[0].id && idx === 0 ? '' : 'hidden'}>
            <p class="usage-title"><strong>${esc(s.name)}</strong> was used in:</p>
            <ul role="list">${s.used.map((u) => `<li>${link(u.href, `${esc(u.label)} ${icon(u.href.startsWith('http') ? 'external' : 'arrow', 14)}`)}</li>`).join('')}</ul>
          </div>`;
          })
          .join('')}
      </div>
    </div>
  </div>
</section>

<section class="section" id="education" aria-labelledby="edu-title">
  <div class="container">
    <header class="section-head"><p class="kicker">Background</p><h2 id="edu-title">Education, certifications &amp; leadership</h2></header>
    <div class="edu-grid">
      ${education
        .map(
          (e) => `<article class="edu-card reveal"><p class="eyebrow">${esc(e.dates)}</p><h3>${esc(e.title)}</h3><p class="edu-grade">${esc(e.grade)}</p><p>${esc(e.org)}</p></article>`
        )
        .join('')}
    </div>
    <div class="cred-grid" id="credentials">
      ${certifications
        .map(
          (c) => `<article class="cred-card reveal"><h3>${esc(c.issuer)} <span class="year">${esc(c.year)}</span></h3>${tags(c.items, 'tag tag-sm')}</article>`
        )
        .join('')}
      <article class="cred-card reveal"><h3>Leadership &amp; community</h3><ul class="plain">${leadership
        .map((l) => `<li><strong>${esc(l.title)}${l.year ? ` (${esc(l.year)})` : ''}:</strong> ${esc(l.text)}</li>`)
        .join('')}</ul></article>
    </div>
  </div>
</section>

<section class="section section-alt contact" id="contact" aria-labelledby="contact-title">
  <div class="container contact-inner">
    <div>
      <p class="kicker">Contact</p>
      <h2 id="contact-title">Let's talk</h2>
      <p class="section-lede">I'm based in ${esc(profile.location)} and open to graduate and junior roles. Email is the quickest way to reach me.</p>
    </div>
    <ul class="contact-list" role="list">
      <li>${link('mailto:' + profile.email, `${icon('mail')}<span><strong>Email</strong>${esc(profile.email)}</span>`, 'contact-item')}</li>
      <li>${link(profile.linkedin, `${icon('linkedin')}<span><strong>LinkedIn</strong>linkedin.com/in/yashchourasia-cs</span>`, 'contact-item')}</li>
      <li>${link(profile.github, `${icon('github')}<span><strong>GitHub</strong>github.com/yash1-coder</span>`, 'contact-item')}</li>
      <li><a class="contact-item" href="${site.cv}" download>${icon('download')}<span><strong>CV</strong>Download PDF</span></a></li>
    </ul>
  </div>
</section>`;
}
