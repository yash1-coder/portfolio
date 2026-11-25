// Reusable HTML/SVG render helpers. No runtime dependencies: everything renders to static markup at build time.

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isExternal = (href) => /^https?:|^mailto:/.test(href);
export const link = (href, text, cls = '', extra = '') =>
  `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''}${isExternal(href) && !href.startsWith('mailto:') ? ' target="_blank" rel="noopener noreferrer"' : ''}${extra ? ' ' + extra : ''}>${text}</a>`;

// ---------- Icons (inline SVG, Lucide-style strokes) ----------
const ip = {
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
};
export const icon = (name, size = 18) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ip[name]}</svg>`;

export const tags = (list, cls = 'tag') => `<ul class="tags" role="list">${list.map((t) => `<li class="${cls}">${esc(t)}</li>`).join('')}</ul>`;

// ---------- Charts ----------
// Horizontal bar chart rendered as HTML so text stays legible at every width.
// Bars always start at zero so lengths are honest. rows: [{label, value, colour?}]
export function barChart({ id, title, caption, rows, max, fmt = (v) => v, tickFmt, unit = '', ticks = 4, note = '' }) {
  tickFmt = tickFmt || fmt;
  const pct = (v) => ((v / max) * 100).toFixed(2);
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);
  return `<figure class="chart reveal" id="${id}">
  <figcaption><strong>${esc(title)}</strong>${caption ? `<span>${esc(caption)}</span>` : ''}</figcaption>
  <div class="bars" role="img" aria-label="${esc(title)}: ${esc(rows.map((r) => `${r.label} ${fmt(r.value)}${unit}`).join('; '))}">
    ${rows
      .map(
        (r) => `<div class="bar-row" aria-hidden="true"><span class="bar-label">${esc(r.label)}</span><span class="bar-track"><span class="bar-fill" style="width:${pct(r.value)}%;background:${r.colour || 'var(--accent)'}"></span></span><span class="bar-value">${esc(fmt(r.value))}${unit}</span></div>`
      )
      .join('')}
    <div class="bar-axis" aria-hidden="true"><span></span><span class="bar-ticks">${tickVals.map((t) => `<span style="left:${pct(t)}%">${esc(tickFmt(t))}${unit}</span>`).join('')}</span><span></span></div>
  </div>
  ${note ? `<p class="chart-note">${esc(note)}</p>` : ''}
  <details class="data-table"><summary>View data table</summary><table><thead><tr><th scope="col">Item</th><th scope="col">Value</th></tr></thead><tbody>${rows
    .map((r) => `<tr><th scope="row">${esc(r.label)}</th><td>${esc(fmt(r.value))}${unit}</td></tr>`)
    .join('')}</tbody></table></details>
</figure>`;
}

// Per-class heat table (real per-class F1 scores).
export function heatTable({ classes, models, data, caption }) {
  const cell = (v) => {
    // map 0.6..1.0 to opacity 0..1 for the accent fill
    const a = Math.max(0, Math.min(1, (v - 0.6) / 0.4));
    return `<td style="--a:${a.toFixed(2)}"><span>${v.toFixed(3)}</span></td>`;
  };
  return `<figure class="heat">
  <figcaption><strong>Per-class F1 on the held-out test set</strong><span>${esc(caption)}</span></figcaption>
  <div class="table-scroll" tabindex="0" role="region" aria-label="Per-class F1 table"><table>
    <thead><tr><th scope="col">Class</th>${models.map((m) => `<th scope="col">${esc(m.name)}</th>`).join('')}</tr></thead>
    <tbody>${classes.map((c, i) => `<tr><th scope="row">${esc(c)}</th>${models.map((m) => cell(data[m.id][i])).join('')}</tr>`).join('')}</tbody>
  </table></div>
</figure>`;
}

// ---------- Architecture / workflow diagram ----------
// nodes: [{title, sub, detail, tech:[]}]. Rendered as an accessible, responsive flow:
// horizontal on wide screens, vertical on narrow ones. Each node expands to show details.
export function flowDiagram({ id, title, caption, nodes, note }) {
  return `<figure class="flow" id="${id}" data-flow>
  <figcaption><strong>${esc(title)}</strong>${caption ? `<span>${esc(caption)}</span>` : ''}</figcaption>
  <ol class="flow-track" role="list">
    ${nodes
      .map(
        (n, i) => `<li class="flow-step">
      <button type="button" class="flow-node" aria-expanded="${i === 0}" aria-controls="${id}-d${i}">
        <span class="flow-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="flow-title">${esc(n.title)}</span>
        ${n.sub ? `<span class="flow-sub">${esc(n.sub)}</span>` : ''}
      </button>
    </li>`
      )
      .join('')}
  </ol>
  <div class="flow-details">
    ${nodes
      .map(
        (n, i) => `<div class="flow-detail" id="${id}-d${i}" ${i === 0 ? '' : 'hidden'}>
      <p class="flow-detail-title"><span class="flow-num">${String(i + 1).padStart(2, '0')}</span> ${esc(n.title)}</p>
      <p>${esc(n.detail)}</p>${n.tech ? tags(n.tech, 'tag tag-sm') : ''}
    </div>`
      )
      .join('')}
  </div>
  ${note ? `<p class="chart-note">${esc(note)}</p>` : ''}
</figure>`;
}

// ---------- Illustrative dashboard (synthetic data, clearly labelled) ----------
export function illustrativeDashboard({ compact = false } = {}) {
  // Synthetic monthly series. Deliberately generic; NOT client data.
  const series = [42, 47, 45, 52, 58, 55, 61, 66, 63, 70, 74, 79];
  const target = [45, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66];
  const mx = 90, w = 300, h = 110, px = (i) => 10 + (i * (w - 20)) / 11, py = (v) => h - 10 - (v / mx) * (h - 20);
  const line = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const regions = [['Region A', 38], ['Region B', 27], ['Region C', 21], ['Region D', 14]];
  const kpis = [['Revenue vs target', '104%'], ['Orders', '12.4k'], ['Avg order value', '86'], ['Repeat customers', '31%']];
  const svg = `<svg viewBox="0 0 640 300" role="img" aria-labelledby="dash-t" class="dash-svg">
    <title id="dash-t">Illustrative dashboard using synthetic data. Not an actual client dashboard.</title>
    <rect x="0" y="0" width="640" height="300" rx="14" class="d-bg"/>
    <rect x="0" y="0" width="640" height="34" rx="14" class="d-head"/><rect x="0" y="20" width="640" height="14" class="d-head"/>
    <text x="16" y="22" class="d-title">Sales performance · illustrative</text>
    <text x="624" y="22" class="d-badge" text-anchor="end">SYNTHETIC DATA</text>
    ${kpis
      .map(
        ([k, v], i) => `<g transform="translate(${16 + i * 153},46)"><rect width="141" height="56" rx="8" class="d-card"/>
      <text x="10" y="20" class="d-k">${k}</text><text x="10" y="44" class="d-v">${v}</text></g>`
      )
      .join('')}
    <g transform="translate(16,114)"><rect width="320" height="172" rx="8" class="d-card"/>
      <text x="10" y="20" class="d-k">Monthly sales vs target</text>
      <g transform="translate(10,40)"><path d="${line(target)}" class="d-target"/><path d="${line(series)}" class="d-line"/></g>
      <text x="10" y="162" class="d-k">Jan</text><text x="300" y="162" class="d-k" text-anchor="end">Dec</text></g>
    <g transform="translate(348,114)"><rect width="276" height="172" rx="8" class="d-card"/>
      <text x="10" y="20" class="d-k">Share of sales by region</text>
      ${regions
        .map(
          ([r, v], i) => `<text x="10" y="${52 + i * 30}" class="d-k">${r}</text><rect x="80" y="${41 + i * 30}" width="${v * 4.6}" height="14" rx="3" class="d-bar"/><text x="${86 + v * 4.6}" y="${52 + i * 30}" class="d-k">${v}%</text>`
        )
        .join('')}
    </g>
  </svg>`;
  return `<figure class="dash${compact ? ' dash-compact' : ''}">
    <p class="synthetic-banner" role="note">${icon('lock', 14)} Illustrative dashboard using synthetic data. Not an actual client dashboard.</p>
    ${svg}
  </figure>`;
}

export function defenceMiniChart(results) {
  const max = 100, w = 320, rowH = 22;
  return `<svg viewBox="0 0 ${w} ${results.length * rowH + 12}" class="mini-chart" role="img" aria-label="Notebook accuracy of six classifiers. ${results.map((r) => `${r.name} ${r.accuracy}%`).join(', ')}">
  ${results
    .map((r, i) => {
      const y = 6 + i * rowH, bw = ((w - 150) * r.accuracy) / max;
      return `<text x="0" y="${y + 14}" class="lbl">${esc(r.name.replace(' (Keras)', '').replace(' (SVC)', ''))}</text><rect x="104" y="${y + 3}" width="${bw}" height="14" rx="3" class="${i === 0 ? 'best' : ''}"/><text x="${108 + bw}" y="${y + 14}" class="val">${r.accuracy}%</text>`;
    })
    .join('')}
</svg>`;
}
