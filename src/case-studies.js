import { projects, xai, defenceResults } from './content.js';
import { esc, icon, link, tags, barChart, heatTable, flowDiagram, illustrativeDashboard } from './components.js';

const bySlug = (s) => projects.find((p) => p.slug === s);

function shell(p, { glance, sections }) {
  return `
<article class="case">
  <header class="case-hero">
    <div class="container">
      <a class="back-link" href="/#projects">${icon('back', 16)} All projects</a>
      <p class="eyebrow">${esc(p.categoryLabel)}</p>
      <h1>${esc(p.title)}</h1>
      <p class="case-sub">${esc(p.subtitle)}</p>
      <p class="case-meta">${esc(p.meta)}</p>
      <div class="case-actions">
        ${p.repo ? link(p.repo, `${icon('github', 16)} View repository`, 'btn btn-primary') : `<span class="muted-note">${icon('lock', 14)} ${esc(p.repoNote)}</span>`}
        <a class="btn btn-ghost" href="/#contact">${icon('mail', 16)} Contact</a>
      </div>
      <dl class="glance">${glance.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </div>
  </header>
  <div class="container case-layout">
    <nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ol role="list">${sections
      .map((s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`)
      .join('')}</ol></nav>
    <div class="case-content">
      ${sections.map((s, i) => `<section id="${s.id}" class="case-section" aria-labelledby="${s.id}-h"><h2 id="${s.id}-h"><span class="sec-num">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</h2>${s.html}</section>`).join('')}
      <nav class="case-next" aria-label="More case studies">${projects
        .filter((x) => x.featured && x.slug !== p.slug)
        .map((x) => `<a href="/projects/${x.slug}" class="next-card"><span class="eyebrow">Next case study</span><strong>${esc(x.title)}</strong><span>${esc(x.subtitle)}</span></a>`)
        .join('')}</nav>
    </div>
  </div>
</article>
<dialog class="lightbox" data-lightbox aria-label="Enlarged image"><form method="dialog"><button class="icon-btn lightbox-close" aria-label="Close enlarged image">${icon('close')}</button></form><img alt=""><p class="lightbox-cap"></p></dialog>`;
}

const fig = (src, w, h, alt, cap) =>
  `<figure class="evidence"><button type="button" class="zoom" data-zoom="${src}" data-caption="${esc(cap)}" aria-label="Enlarge: ${esc(cap)}"><img src="${src}" width="${w}" height="${h}" alt="${esc(alt)}" loading="lazy" decoding="async"><span class="zoom-hint">${icon('expand', 14)} Enlarge</span></button><figcaption>${esc(cap)}</figcaption></figure>`;

const callout = (title, html, kind = 'info') => `<aside class="callout callout-${kind}"><p class="callout-title">${esc(title)}</p>${html}</aside>`;

// ---------------------------------------------------------------------------
// A. Colouring Black Boxes
// ---------------------------------------------------------------------------
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync(new URL('../assets/img/manifest.json', import.meta.url), 'utf8'));
const m = (key) => {
  const e = manifest[key];
  return { src: '/img/' + e.file, w: e.w, h: e.h };
};

function xaiExplorer() {
  const groups = [
    {
      id: 'resnet', label: 'ResNet18 (CNN)', methods: ['Original', 'Grad-CAM', 'Integrated Gradients', 'SmoothGrad'],
      note: 'Grad-CAM targets the last convolutional block before pooling. It gives compact, class-discriminative regions, which fits ResNet18 having the highest faithfulness score.',
      items: ['Residential', 'River', 'SeaLake', 'Highway', 'Industrial'].map((c) => ({ ...m('resnet_' + c), label: c, alt: `ResNet18 on a ${c} tile: original image, Grad-CAM, Integrated Gradients and SmoothGrad maps.` })),
    },
    {
      id: 'vit', label: 'ViT Tiny (Transformer)', methods: ['Original', 'Integrated Gradients', 'Attention rollout', 'Overlay'],
      note: 'Attention rollout traces how attention flows to the classification token across layers. ViT maps are more spread out, consistent with global self-attention.',
      items: [0, 1, 2, 3, 4].map((i) => ({ ...m('vit_' + i), label: `Example ${i + 1}`, alt: `ViT Tiny correctly classified example ${i + 1}: original, Integrated Gradients, attention rollout and overlay. True and predicted class are printed on the figure.` })),
    },
    {
      id: 'vim', label: 'Vision Mamba (State-space)', methods: ['Original', 'Integrated Gradients', 'SmoothGrad', 'IG heatmap'],
      note: 'Vision Mamba has neither convolutional feature maps nor attention weights, so only Integrated Gradients and SmoothGrad apply. The blocky patterns reflect its patch-sequence processing.',
      items: ['annualcrop', 'highway', 'industrial', 'permanentcrop', 'sealake'].map((c) => {
        const key = Object.keys(manifest).find((k) => k.toLowerCase() === 'vim_' + c);
        const e = manifest[key];
        return { src: '/img/' + e.file, w: e.w, h: e.h, label: key.slice(4), alt: `Vision Mamba on a ${key.slice(4)} tile: input image, Integrated Gradients overlay, SmoothGrad overlay and raw IG heatmap.` };
      }),
    },
    {
      id: 'fail', label: 'Failure cases', methods: ['Attribution for the predicted (wrong) class'],
      note: 'Misclassifications were mostly systematic, not random: Highway vs River and PermanentCrop vs HerbaceousVegetation. The maps often look plausible for the wrong class, which points to genuine visual ambiguity.',
      items: [
        ...[0, 1].map((i) => ({ ...m('fail_resnet_' + i), label: `ResNet18 #${i + 1}` })),
        ...[0, 1].map((i) => ({ ...m('fail_vit_' + i), label: `ViT Tiny #${i + 1}` })),
        ...[0, 1].map((i) => ({ ...m('fail_vim_' + i), label: `Vision Mamba #${i + 1}` })),
      ].map((x) => ({ ...x, alt: `${x.label}: misclassified EuroSAT example with attribution maps for the predicted class. True and predicted labels are printed on the figure.` })),
    },
  ];
  return `<div class="xai-explorer" data-tabs>
  <div class="xai-tabs" role="tablist" aria-label="Choose a model">
    ${groups.map((g, i) => `<button type="button" role="tab" id="xt-${g.id}" aria-controls="xp-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g.label)}</button>`).join('')}
  </div>
  ${groups
    .map(
      (g, gi) => `<div class="xai-panel" role="tabpanel" id="xp-${g.id}" aria-labelledby="xt-${g.id}" ${gi === 0 ? '' : 'hidden'} data-gallery>
    <p class="xai-methods">Panels, left to right: ${g.methods.map((x) => `<span class="tag tag-sm">${esc(x)}</span>`).join(' ')}</p>
    <div class="xai-stage">${g.items
      .map(
        (it, i) => `<button type="button" class="zoom xai-figure" data-zoom="${it.src}" data-caption="${esc(g.label + ' · ' + it.label)}" ${i === 0 ? '' : 'hidden'} data-slide="${i}" aria-label="Enlarge ${esc(g.label + ' ' + it.label)}">
        <img src="${it.src}" width="${it.w}" height="${it.h}" alt="${esc(it.alt)}" loading="lazy" decoding="async"><span class="zoom-hint">${icon('expand', 14)} Enlarge</span></button>`
      )
      .join('')}</div>
    <div class="xai-picker" role="group" aria-label="Choose an example">${g.items
      .map((it, i) => `<button type="button" class="chip" data-show="${i}" aria-pressed="${i === 0}">${esc(it.label)}</button>`)
      .join('')}</div>
    <p class="xai-note">${esc(g.note)}</p>
  </div>`
    )
    .join('')}
  <p class="source-note">These are real outputs saved by the dissertation pipeline (<code>results/heatmaps</code> and <code>results/failure_cases</code>). Nothing has been regenerated or edited for the site.</p>
</div>`;
}

function blackBoxes() {
  const p = bySlug('colouring-black-boxes');
  const models = xai.models;
  const gallery = xai.classes
    .map((c) => {
      const e = manifest['eurosat_' + c];
      return `<li><img src="/img/${e.file}" width="192" height="192" alt="EuroSAT RGB sample of class ${c}" loading="lazy" decoding="async"><span>${c}</span></li>`;
    })
    .join('');

  const sections = [
    {
      id: 'overview', title: 'Overview & problem',
      html: `<p class="lead">Satellite-image classifiers can be very accurate, but accuracy doesn't tell you <em>why</em> a model made a decision, or whether its explanation can be trusted. This dissertation asked whether CNN, transformer and state-space architectures differ measurably in both classification accuracy and explanation quality.</p>
      <ul class="key-points"><li><strong>RQ1</strong> Which architecture classifies EuroSAT RGB best, and do the differences hold per class?</li><li><strong>RQ2</strong> How faithful, stable and sensitive are their explanations, and does that ranking match the accuracy ranking?</li></ul>`,
    },
    {
      id: 'role', title: 'My role',
      html: `<p>This was my individual MSc dissertation (CO7201, University of Leicester). I designed the experiment and wrote the data pipeline, model training, held-out evaluation and XAI generation. I also implemented the quantitative XAI metrics, a pure-PyTorch CPU version of Vision Mamba, and the reproducibility tests.</p>`,
    },
    {
      id: 'data', title: 'Dataset',
      html: `<p>The dataset is EuroSAT RGB: <strong>27,000</strong> labelled Sentinel-2 image tiles across <strong>10</strong> land-use classes. I used a stratified <strong>70 / 15 / 15</strong> train/validation/test split, giving <strong>4,050</strong> held-out test images.</p>
      <ul class="eurosat-grid" role="list">${gallery}</ul>
      <p class="source-note">These are the first image of each class from the EuroSAT RGB dataset, shown unmodified apart from resizing. Dataset: Helber et al., <em>EuroSAT: A Novel Dataset and Deep Learning Benchmark for Land Use and Land Cover Classification</em>, IEEE JSTARS 2019, released under the MIT licence. Contains modified Copernicus Sentinel data.</p>`,
    },
    {
      id: 'architecture', title: 'Research workflow',
      html: flowDiagram({
        id: 'xai-flow', title: 'Evaluation pipeline', caption: 'Select a step for detail.',
        nodes: [
          { title: 'Dataset', sub: 'EuroSAT RGB', detail: '27,000 images in 10 classes. Integrity checks and class-distribution analysis came first.', tech: ['Python', 'pandas'] },
          { title: 'Preprocessing', sub: 'Stratified split', detail: 'Reproducible stratified 70/15/15 split, channel normalisation and model-specific resizing. The split files are saved as artefacts.', tech: ['PyTorch', 'torchvision'] },
          { title: 'Models', sub: 'CNN · ViT · Mamba', detail: 'ResNet18 (ImageNet-1K weights), ViT Tiny from timm (ImageNet-21K weights), and Vision Mamba CPU Full, trained from scratch.', tech: ['PyTorch', 'timm'] },
          { title: 'Prediction', sub: 'Held-out test', detail: 'Accuracy, macro-F1, per-class precision, recall and F1, and confusion matrices on the 4,050-image test set.', tech: ['scikit-learn'] },
          { title: 'Explainability', sub: 'IG · SmoothGrad · Grad-CAM · Rollout', detail: 'Integrated Gradients and SmoothGrad for all three models (via Captum), Grad-CAM for ResNet18 only, and attention rollout for ViT Tiny only.', tech: ['Captum'] },
          { title: 'Quantitative XAI', sub: 'Faithfulness · Stability · Sensitivity', detail: 'All three metrics use Integrated Gradients on 120 held-out images per model, so the models are compared on the same attribution method.', tech: ['NumPy'] },
        ],
      }),
    },
    {
      id: 'models', title: 'Models compared',
      html: `<div class="model-cards">${models
        .map((md) => `<article class="model-card" style="--mc:${md.colour}"><p class="eyebrow">${md.family}</p><h3>${md.name}</h3><p>${md.init}${md.input ? ` · ${md.input} input` : ''}</p></article>`)
        .join('')}</div>`,
    },
    {
      id: 'evidence', title: 'Explainability explorer',
      html: `<p>Choose a model, then an example. Each figure is a saved output from the pipeline. Methods are matched to architectures: a method is shown only where it applies.</p>${xaiExplorer()}
      <dl class="method-defs">
        <div><dt>Integrated Gradients</dt><dd>Accumulates gradients along a path from a black baseline to the input. Shows pixel-level contribution to the predicted class.</dd></div>
        <div><dt>SmoothGrad</dt><dd>Averages attributions over noisy copies of the input to reduce visual noise.</dd></div>
        <div><dt>Grad-CAM</dt><dd>Weights the final convolutional feature maps by their gradients to give a coarse class-discriminative map (CNNs only).</dd></div>
        <div><dt>Attention rollout</dt><dd>Multiplies attention matrices across layers to trace information flow to the classification token (transformers only).</dd></div>
      </dl>`,
    },
    {
      id: 'results', title: 'Results & evaluation',
      html: `<div class="chart-grid">
        ${barChart({ id: 'acc', title: 'Test accuracy', caption: '4,050 held-out images', rows: models.map((md) => ({ label: md.name, value: md.accuracy, colour: md.colour })), max: 100, ticks: 2, fmt: (v) => v.toFixed(2), tickFmt: (v) => v.toFixed(0), unit: '%' })}
        ${barChart({ id: 'f1', title: 'Macro-F1', caption: 'Unweighted mean over 10 classes', rows: models.map((md) => ({ label: md.name, value: md.macroF1, colour: md.colour })), max: 1, ticks: 2, fmt: (v) => v.toFixed(4), tickFmt: (v) => v.toFixed(1) })}
      </div>
      <h3 class="h3">Explanation quality</h3>
      <p>All three metrics use Integrated Gradients on 120 held-out images per model. Higher is better for each.</p>
      <div class="chart-grid three">
        ${barChart({ id: 'faith', title: 'Faithfulness', caption: 'Confidence drop when the top 20% of attributed pixels are masked', rows: models.map((md) => ({ label: md.name, value: md.faithfulness, colour: md.colour })), max: 1, ticks: 4, fmt: (v) => v.toFixed(4), tickFmt: (v) => v.toFixed(2) })}
        ${barChart({ id: 'stab', title: 'Stability', caption: 'Cosine similarity of attributions under small input noise', rows: models.map((md) => ({ label: md.name, value: md.stability, colour: md.colour })), max: 1, ticks: 4, fmt: (v) => v.toFixed(4), tickFmt: (v) => v.toFixed(2) })}
        ${barChart({ id: 'sens', title: 'Sensitivity', caption: 'Top-20% masking drop minus random-20% masking drop', rows: models.map((md) => ({ label: md.name, value: md.sensitivity, colour: md.colour })), max: 0.3, ticks: 3, fmt: (v) => v.toFixed(4), tickFmt: (v) => v.toFixed(1) })}
      </div>
      ${callout('What the comparison shows', `<ul><li><strong>ViT Tiny</strong> was the most accurate model but didn't lead on any explanation metric.</li><li><strong>ResNet18</strong> had the most faithful explanations, consistent with compact CNN attributions.</li><li><strong>Vision Mamba (CPU)</strong> was least accurate but most stable and sensitive. Its positive sensitivity shows the high stability isn't just constant maps.</li><li>Accuracy and explanation quality are separate properties, and no single model is best on every measure.</li></ul>`)}
      ${heatTable({ classes: xai.classes, models, data: xai.classF1, caption: 'Darker cells mean higher F1. Highway, River and the vegetation classes were hardest for every model.' })}
      <h3 class="h3">Confusion matrices</h3>
      <div class="evidence-grid">
        ${fig(m('cm-resnet18').src, m('cm-resnet18').w, m('cm-resnet18').h, 'ResNet18 confusion matrices, counts and normalised.', 'ResNet18: confusion matrix (counts and normalised)')}
        ${fig(m('cm-vit').src, m('cm-vit').w, m('cm-vit').h, 'ViT Tiny confusion matrices, counts and normalised.', 'ViT Tiny: confusion matrix (counts and normalised)')}
        ${fig(m('cm-vim').src, m('cm-vim').w, m('cm-vim').h, 'Vision Mamba confusion matrices, counts and normalised.', 'Vision Mamba (CPU): confusion matrix (counts and normalised)')}
      </div>
      <details class="more"><summary>Training curves</summary><div class="evidence-grid">
        ${fig(m('curves-resnet18').src, m('curves-resnet18').w, m('curves-resnet18').h, 'ResNet18 training and validation curves.', 'ResNet18: training curves')}
        ${fig(m('curves-vit').src, m('curves-vit').w, m('curves-vit').h, 'ViT Tiny training and validation curves.', 'ViT Tiny: training curves')}
        ${fig(m('curves-vim').src, m('curves-vim').w, m('curves-vim').h, 'Vision Mamba training and validation curves.', 'Vision Mamba (CPU): training curves. It had not converged at epoch 20.')}
      </div></details>`,
    },
    {
      id: 'limitations', title: 'Challenges & limitations',
      html: `${callout('Read the comparison with these constraints in mind', `<ul>
        <li><strong>Pretraining asymmetry:</strong> ResNet18 used ImageNet-1K weights, ViT Tiny ImageNet-21K, and Vision Mamba trained from scratch. The accuracy ranking doesn't isolate architecture alone.</li>
        <li><strong>Resolution and compute:</strong> without GPU access, Vision Mamba ran as a pure-PyTorch CPU implementation at 128×128. Its results aren't representative of the official CUDA Vim model.</li>
        <li><strong>XAI protocol:</strong> Vision Mamba used 8 IG steps instead of 24 and a smaller noise σ for stability, both because of CPU cost.</li>
        <li><strong>Sample budget:</strong> XAI metrics come from 120 test images per model, and the experiments use a single dataset.</li></ul>`, 'warn')}`,
    },
    {
      id: 'lessons', title: 'Lessons & next steps',
      html: `<ul class="key-points"><li>Report explanation quality alongside accuracy. Here they ranked models differently.</li><li>Use one shared attribution method (IG) for quantitative comparison, and keep architecture-specific methods qualitative.</li><li>Next: a controlled comparison from the same initialisation, a GPU Vision Mamba at 224×224, per-class XAI metrics, and replication on UCMerced, AID and PatternNet.</li></ul>`,
    },
    {
      id: 'links', title: 'Code & documentation',
      html: `<p>${link(p.repo, `${icon('github', 16)} yash1-coder/dissertation on GitHub`, 'btn btn-ghost')}</p><p class="source-note">The repository contains the notebook pipeline, model code, saved metrics and figures used on this page.</p>`,
    },
  ];
  return shell(p, {
    glance: [
      ['Role', 'Sole researcher and developer'],
      ['Dataset', 'EuroSAT RGB · 27,000 images'],
      ['Best accuracy', 'ViT Tiny · 98.62%'],
      ['Stack', 'Python, PyTorch, timm, Captum'],
    ],
    sections,
  });
}

// ---------------------------------------------------------------------------
// B. Intelligent Defence System
// ---------------------------------------------------------------------------
function defence() {
  const p = bySlug('intelligent-defence-system');
  const sections = [
    {
      id: 'overview', title: 'Overview & problem',
      html: `<p class="lead">Rule-based intrusion detection struggles to keep up with changing traffic patterns. This project trained and compared machine-learning classifiers that label network connection records as <em>normal</em> or <em>anomaly</em>, and wrapped the workflow in a Flask web application.</p>`,
    },
    {
      id: 'role', title: 'My role',
      html: `<p>This was my final-year B.E. Computer Engineering project. I did the data preparation, model comparison in a Jupyter notebook, and the Flask application with its MySQL-backed user accounts.</p>`,
    },
    {
      id: 'architecture', title: 'Application architecture',
      html: flowDiagram({
        id: 'ids-flow', title: 'How the Flask application works', caption: 'Based on app.py in the public repository. Select a step for detail.',
        nodes: [
          { title: 'Sign up & log in', sub: 'MySQL user table', detail: 'Users register and log in. Accounts are stored in a MySQL table through mysql-connector.', tech: ['Flask', 'MySQL'] },
          { title: 'Load data', sub: 'CSV upload', detail: 'Upload a CSV of connection records; it is read with pandas and previewed in the browser.', tech: ['pandas'] },
          { title: 'Preprocess', sub: 'Encode · split', detail: 'Label-encode the categorical fields (protocol_type, service, flag), then make a stratified train/test split.', tech: ['scikit-learn'] },
          { title: 'Train & compare', sub: '6 algorithms', detail: 'Choose an algorithm (Extra Trees, Decision Tree, SVM, KNN, AdaBoost or a neural network) to see its accuracy.', tech: ['scikit-learn', 'Keras'] },
          { title: 'Predict', sub: '41 features', detail: 'Enter the 41 feature values of a connection; the saved Decision Tree model returns "attack" or "no attack".', tech: ['pickle'] },
        ],
      }),
    },
    {
      id: 'data', title: 'Data & features',
      html: `<div class="stat-row"><div class="stat"><span class="stat-v">22,544</span><span class="stat-l">labelled connection records</span></div><div class="stat"><span class="stat-v">41</span><span class="stat-l">KDD-style features</span></div><div class="stat"><span class="stat-v">12,833 / 9,711</span><span class="stat-l">anomaly / normal</span></div></div>
      <p>The features describe each connection's duration, protocol, service, flag, byte counts and host-level traffic statistics. Three categorical fields were label-encoded. The data had no missing values.</p>`,
    },
    {
      id: 'results', title: 'Algorithm comparison',
      html: `${barChart({
        id: 'ids-acc', title: 'Accuracy by algorithm', caption: 'Notebook results on a stratified 30% hold-out (random_state = 42)',
        rows: defenceResults.map((r, i) => ({ label: r.name, value: r.accuracy, colour: i === 0 ? 'var(--c2)' : 'var(--c1)' })),
        max: 100, fmt: (v) => v.toFixed(2), tickFmt: (v) => v.toFixed(0), unit: '%',
      })}
      ${callout('Model selection', '<p>Tree ensembles did best on this data. Extra Trees (98.49%) and a single Decision Tree (98.21%) came out on top, and the Decision Tree was saved and used for the app\'s prediction page. The RBF SVM without feature scaling performed poorly (75.81%), a reminder that scale-sensitive models need standardised inputs.</p>')}`,
    },
    {
      id: 'limitations', title: 'Challenges & limitations',
      html: callout('Context for these numbers', `<ul>
        <li>All accuracies come from one stratified split of a single dataset. There was no cross-validation and no independent or time-separated test set.</li>
        <li>Accuracy is the only metric recorded. Precision, recall and false-positive rates matter more for intrusion detection, and they weren't measured.</li>
        <li>The app works on uploaded CSV data. It doesn't capture live traffic, and it wasn't evaluated on attack types unseen in training.</li>
        <li>In the web interface, the KNN and neural-network options show accuracy figures recorded from earlier runs (85.2% and 94.2%) rather than retraining on request.</li></ul>`, 'warn'),
    },
    {
      id: 'lessons', title: 'Lessons & next steps',
      html: `<ul class="key-points"><li>Evaluate with cross-validation and report precision, recall and F1 per class, not just accuracy.</li><li>Scale features before distance- and margin-based models.</li><li>Use parameterised SQL queries and hashed passwords for the login flow, and keep the secret key in configuration.</li><li>Validate on a separate benchmark split such as NSL-KDD's test set to check generalisation.</li></ul>`,
    },
    {
      id: 'links', title: 'Code',
      html: `<p>${link(p.repo, `${icon('github', 16)} yash1-coder/Intelligent-defence-system`, 'btn btn-ghost')}</p><p class="source-note">The repository contains <code>app.py</code> (Flask application) and <code>cyber_attack.ipynb</code> (analysis and model comparison). Screenshots of the running application aren't available, so none are shown.</p>`,
    },
  ];
  return shell(p, {
    glance: [
      ['Role', 'Developer (final-year project)'],
      ['Data', '22,544 records · 41 features'],
      ['Best notebook accuracy', 'Extra Trees · 98.49%'],
      ['Stack', 'Python, scikit-learn, Keras, Flask, MySQL'],
    ],
    sections,
  });
}

// ---------------------------------------------------------------------------
// C. SoftSensor AI BI
// ---------------------------------------------------------------------------
function softsensor() {
  const p = bySlug('softsensor-bi');
  const sections = [
    {
      id: 'overview', title: 'Overview & problem',
      html: `<p class="lead">A Dubai-based client tracked sales performance through manually compiled reports. These drew on <strong>three years of fragmented sales and marketing data</strong> held in <strong>two source systems</strong>, and the reports disagreed with each other. The team needed one consistent set of definitions and dashboards that refreshed automatically.</p>
      <div class="stat-row"><div class="stat"><span class="stat-v">5</span><span class="stat-l">Power BI dashboards</span></div><div class="stat"><span class="stat-v">15</span><span class="stat-l">KPIs defined with stakeholders</span></div><div class="stat"><span class="stat-v">~8 hrs</span><span class="stat-l">manual prep replaced per reporting cycle</span></div><div class="stat"><span class="stat-v">Daily</span><span class="stat-l">automated refresh</span></div></div>`,
    },
    {
      id: 'role', title: 'My role',
      html: `<p>I was a Data Scientist in a <strong>5-member delivery team</strong> at SoftSensor AI (Oct – Dec 2024). I worked directly with client stakeholders on requirements, built the data preparation and ETL logic, and delivered the Power BI data models, DAX measures and dashboards.</p>`,
    },
    {
      id: 'architecture', title: 'Data architecture',
      html: flowDiagram({
        id: 'bi-flow', title: 'From source data to reporting', caption: 'Select a step for detail.',
        nodes: [
          { title: 'Source data', sub: '2 systems · 3 years', detail: 'Sales and marketing records from two source systems, with inconsistent formats and reporting discrepancies.', tech: ['Excel', 'SQL'] },
          { title: 'Requirements', sub: '15 KPIs', detail: 'Worked with client stakeholders to turn commercial reporting needs into 15 KPIs with agreed business definitions.', tech: ['Stakeholder workshops'] },
          { title: 'Clean & reconcile', sub: 'Data-quality checks', detail: 'Investigated and reconciled inconsistent sources using SQL, Excel and data-quality checks before modelling.', tech: ['SQL', 'Excel'] },
          { title: 'ETL', sub: 'Python · SQL · Power Query', detail: 'An end-to-end ETL workflow in Microsoft Fabric that cleanses, validates and transforms source data into structured analytical datasets.', tech: ['Python', 'Power Query', 'Microsoft Fabric'] },
          { title: 'Data model', sub: 'Fabric Lakehouse', detail: 'A validated Lakehouse-backed model with reusable reporting logic, DAX measures and calculated columns aligned to the KPI definitions.', tech: ['Fabric Lakehouse', 'DAX'] },
          { title: 'Power BI reporting', sub: '5 dashboards · daily refresh', detail: 'Five interactive dashboards with automated daily refresh. Outputs were tested against the transformed source data. Dashboard logic, naming conventions and data definitions were documented for handover.', tech: ['Power BI'] },
        ],
      }),
    },
    {
      id: 'evidence', title: 'What the reporting looked like',
      html: `<p>The client's dashboards and data are confidential, so I don't reproduce them here. The mock-up below shows the <em>type</em> of view delivered (KPI tiles, trend against target, breakdown by segment) using made-up numbers.</p>${illustrativeDashboard()}`,
    },
    {
      id: 'results', title: 'Outcomes',
      html: `<ul class="key-points">
        <li>A single set of <strong>15 agreed KPI definitions</strong> replaced inconsistent figures from separately compiled reports.</li>
        <li><strong>5 dashboards</strong> with automated daily refresh replaced about <strong>8 hours of manual reporting preparation per cycle</strong>.</li>
        <li>Documented logic, naming conventions and data definitions supported handover and ongoing changes as requirements evolved.</li></ul>`,
    },
    {
      id: 'limitations', title: 'Challenges & limitations',
      html: `<ul class="key-points"><li>Reconciling three years of records across two systems meant agreeing business definitions before any modelling could start.</li><li>The engagement was short (three months). I can't share the client's own adoption or revenue figures, and I don't claim any.</li></ul>`,
    },
    {
      id: 'lessons', title: 'Lessons & next steps',
      html: `<ul class="key-points"><li>Agreeing KPI definitions early prevents rework later.</li><li>Testing dashboard outputs against transformed source data builds stakeholder trust.</li><li>Documentation is part of the deliverable, not an afterthought.</li></ul>`,
    },
  ];
  return shell(p, {
    glance: [
      ['Role', 'Data Scientist, 5-member team'],
      ['Client', 'Dubai-based, sales & marketing'],
      ['Delivered', '5 dashboards · 15 KPIs'],
      ['Stack', 'SQL, Python, Power Query, Fabric, Power BI, DAX'],
    ],
    sections,
  });
}

export const caseStudies = [
  { slug: 'colouring-black-boxes', render: blackBoxes, description: 'MSc dissertation: comparing ResNet18, ViT Tiny and Vision Mamba on EuroSAT for both accuracy and explanation quality, with real Grad-CAM, Integrated Gradients, SmoothGrad and attention-rollout outputs.' },
  { slug: 'intelligent-defence-system', render: defence, description: 'Network-intrusion classification: six algorithms compared on 22,544 labelled connection records, wrapped in a Flask and MySQL web application.' },
  { slug: 'softsensor-bi', render: softsensor, description: 'SoftSensor AI business-intelligence case study: 15 KPIs across 5 Power BI dashboards on a Microsoft Fabric ETL pipeline, replacing about 8 hours of manual reporting per cycle.' },
];
