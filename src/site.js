// Progressive enhancement for the portfolio. No dependencies.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Theme toggle ----
  const root = document.documentElement;
  const themeBtn = $('[data-theme-toggle]');
  const syncThemeLabel = () => {
    if (!themeBtn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', `Switch to ${next} theme`);
  };
  syncThemeLabel();
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeLabel();
  });

  // ---- Mobile navigation ----
  const menuBtn = $('[data-menu-toggle]');
  const nav = $('#site-nav');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  // ---- Project filters & expertise pathways ----
  const filterBtns = $$('[data-filter]');
  const status = $('[data-filter-status]');
  const labels = { all: 'all areas', data: 'Data & BI', ml: 'ML & XAI', backend: 'Backend' };
  const applyFilter = (cat) => {
    let shown = 0;
    $$('[data-project-grid] > [data-categories]').forEach((card) => {
      const match = cat === 'all' || card.dataset.categories.split(' ').includes(cat);
      card.classList.toggle('is-hidden', !match);
      if (match) { shown++; card.classList.add('is-visible'); }
    });
    filterBtns.forEach((b) => {
      const on = b.dataset.filter === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const empty = $('[data-empty]');
    if (empty) empty.hidden = shown > 0;
    if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'} in ${labels[cat]}.`;
  };
  filterBtns.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  $$('[data-pathway]').forEach((b) =>
    b.addEventListener('click', () => {
      applyFilter(b.dataset.pathway);
      const target = $('#projects');
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      const first = $(`[data-filter="${b.dataset.pathway}"]`);
      setTimeout(() => first?.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
    })
  );

  // ---- Generic ARIA tabs (skills + XAI explorer) ----
  const initTabs = (tablist) => {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      tablist.dispatchEvent(new CustomEvent('tabchange', { detail: tab }));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  };
  $$('[role="tablist"]').forEach(initTabs);

  // ---- Skill explorer ----
  const skills = $('[data-skills]');
  if (skills) {
    const showUsage = (key) => {
      $$('[data-usage]', skills).forEach((u) => (u.hidden = u.dataset.usage !== key));
      $$('.skill-chip', skills).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.skill === key)));
    };
    $$('.skill-chip', skills).forEach((c) => c.addEventListener('click', () => showUsage(c.dataset.skill)));
    $('[role="tablist"]', skills).addEventListener('tabchange', (e) => {
      const panel = document.getElementById(e.detail.getAttribute('aria-controls'));
      const first = $('.skill-chip', panel);
      if (first) showUsage(first.dataset.skill);
    });
  }

  // ---- XAI gallery pickers ----
  $$('[data-gallery]').forEach((g) => {
    $$('[data-show]', g).forEach((btn) =>
      btn.addEventListener('click', () => {
        const i = btn.dataset.show;
        $$('[data-slide]', g).forEach((s) => (s.hidden = s.dataset.slide !== i));
        $$('[data-show]', g).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      })
    );
  });

  // ---- Expandable flow diagrams ----
  $$('[data-flow]').forEach((flow) => {
    const nodes = $$('.flow-node', flow);
    nodes.forEach((n) =>
      n.addEventListener('click', () => {
        nodes.forEach((m) => {
          const on = m === n;
          m.setAttribute('aria-expanded', String(on));
          document.getElementById(m.getAttribute('aria-controls')).hidden = !on;
        });
      })
    );
  });

  // ---- Lightbox ----
  const lb = $('[data-lightbox]');
  if (lb && typeof lb.showModal === 'function') {
    const img = $('img', lb), cap = $('.lightbox-cap', lb);
    let opener = null;
    document.addEventListener('click', (e) => {
      const z = e.target.closest('[data-zoom]');
      if (!z) return;
      opener = z;
      const src = z.querySelector('img');
      img.src = z.dataset.zoom;
      img.alt = src ? src.alt : '';
      cap.textContent = z.dataset.caption || '';
      lb.showModal();
    });
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => opener?.focus());
  }

  // ---- Table of contents highlight ----
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('is-active'));
          map.get(en.target.id)?.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ---- Reveal on scroll ----
  const reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('is-visible'));
  }
})();
