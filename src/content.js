// Single source of truth for all professional content on the site.
// Every figure here is traceable to a source listed in CONTENT_AUDIT.md.
// Edit this file, then run `npm run build`.

export const site = {
  url: 'https://portfolio-nine-delta-06dkumulcf.vercel.app',
  cv: '/Yash_Chourasia_CV.pdf',
  ogImage: '/og.png',
};

export const profile = {
  name: 'Yash Chourasia',
  location: 'London, United Kingdom',
  email: 'yashchourasia1111@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yashchourasia-cs/',
  github: 'https://github.com/yash1-coder',
  roleLine: 'Data analytics · Business intelligence · Applied ML · Backend',
  headline: 'Building reliable data products, explainable ML systems and practical software.',
  positioning:
    'MSc Advanced Computer Science (Distinction), University of Leicester. Looking for graduate and junior roles in data analytics, BI, data engineering, backend engineering and applied ML in the UK.',
  intro:
    'At SoftSensor AI I helped turn fragmented sales and marketing data into five Power BI dashboards for a client. In my MSc dissertation I compared CNN, transformer and state-space models for explainable satellite-image classification. I also build Flask and MySQL applications around machine-learning models.',
};

// Hero achievement cards: verified facts only, each with its context.
export const achievements = [
  { value: '5', label: 'Power BI dashboards delivered', context: 'SoftSensor AI client engagement', href: '/projects/softsensor-bi' },
  { value: '15', label: 'business KPIs defined', context: 'Agreed with client stakeholders', href: '/projects/softsensor-bi' },
  { value: '~8 hrs', label: 'manual reporting prep replaced per cycle', context: 'Automated daily refresh', href: '/projects/softsensor-bi' },
  { value: '6', label: 'classification algorithms compared', context: 'Intelligent Defence System', href: '/projects/intelligent-defence-system' },
];

export const pathways = [
  {
    id: 'data',
    title: 'Data & Business Intelligence',
    blurb: 'SQL, Excel, Power Query, Microsoft Fabric, ETL and Power BI reporting built on agreed KPI definitions.',
    tools: ['SQL', 'Excel', 'Power BI', 'DAX', 'Microsoft Fabric', 'ETL'],
  },
  {
    id: 'ml',
    title: 'Applied ML & Explainable AI',
    blurb: 'PyTorch model comparison, held-out evaluation and quantitative explainability analysis.',
    tools: ['PyTorch', 'Captum', 'scikit-learn', 'XAI', 'Model evaluation'],
  },
  {
    id: 'backend',
    title: 'Backend & Software Engineering',
    blurb: 'Python and Flask applications with relational databases and model-serving workflows.',
    tools: ['Python', 'Flask', 'MySQL', 'REST APIs', 'Git'],
  },
];

// ---------- Dissertation results (source: results/metrics/model_comparison_summary.csv + final report) ----------
export const xai = {
  models: [
    { id: 'resnet', name: 'ResNet18', family: 'CNN', init: 'ImageNet-1K pretrained', accuracy: 94.74, macroF1: 0.9457, faithfulness: 0.7886, stability: 0.8721, sensitivity: 0.0366, colour: 'var(--c1)' },
    { id: 'vit', name: 'ViT Tiny', family: 'Transformer', init: 'ImageNet-21K pretrained', accuracy: 98.62, macroF1: 0.9856, faithfulness: 0.7528, stability: 0.9279, sensitivity: 0.1636, colour: 'var(--c2)' },
    { id: 'vim', name: 'Vision Mamba (CPU)', family: 'State-space', init: 'Trained from scratch', input: '128×128', accuracy: 81.95, macroF1: 0.8129, faithfulness: 0.6141, stability: 0.9998, sensitivity: 0.2686, colour: 'var(--c3)' },
  ],
  classes: ['AnnualCrop', 'Forest', 'HerbaceousVegetation', 'Highway', 'Industrial', 'Pasture', 'PermanentCrop', 'Residential', 'River', 'SeaLake'],
  // Per-class F1 from *_classwise_metrics.csv, ordered as `classes`.
  classF1: {
    resnet: [0.9438, 0.9803, 0.9284, 0.8996, 0.9771, 0.9436, 0.8995, 0.9900, 0.9172, 0.9775],
    vit: [0.9844, 0.9956, 0.9867, 0.9746, 0.9920, 0.9867, 0.9826, 0.9956, 0.9854, 0.9989],
    vim: [0.8419, 0.9036, 0.7730, 0.6421, 0.8968, 0.7829, 0.7448, 0.8669, 0.7620, 0.9147],
  },
};

// ---------- Intelligent Defence System (source: cyber_attack.ipynb outputs in the public repo) ----------
export const defenceResults = [
  { name: 'Extra Trees', accuracy: 98.49 },
  { name: 'Decision Tree', accuracy: 98.21 },
  { name: 'KNN (k = 12)', accuracy: 96.45 },
  { name: 'AdaBoost', accuracy: 96.2 },
  { name: 'Neural network (Keras)', accuracy: 93.57 },
  { name: 'SVM (SVC)', accuracy: 75.81 },
];

// ---------- Projects ----------
export const projects = [
  {
    slug: 'colouring-black-boxes',
    featured: true,
    categories: ['ml'],
    categoryLabel: 'Applied ML · Explainable AI · Research',
    title: 'Colouring Black Boxes',
    subtitle: 'Visualising and measuring how AI models make decisions on satellite imagery',
    meta: 'MSc dissertation · University of Leicester · Feb – May 2026',
    image: { src: '/img/xai/card-xai.webp', w: 784, h: 380, alt: 'A EuroSAT residential satellite tile next to its Grad-CAM heatmap from the ResNet18 model, with warm regions over built-up areas.' },
    problem: 'High accuracy alone does not tell you whether a model relies on the right evidence. I compared three architecture families on both accuracy and explanation quality.',
    outcomes: [
      'ViT Tiny reached 98.62% accuracy (0.986 macro-F1) on 4,050 held-out images',
      'ResNet18 had the most faithful explanations; Vision Mamba the most stable and sensitive',
      'No single model led on every explanation metric, so accuracy and explainability have to be assessed separately',
    ],
    tech: ['Python', 'PyTorch', 'timm', 'Captum', 'Jupyter'],
    repo: 'https://github.com/yash1-coder/dissertation',
  },
  {
    slug: 'softsensor-bi',
    featured: true,
    categories: ['data'],
    categoryLabel: 'Business Intelligence · Data Engineering',
    title: 'Client Sales Reporting in Power BI',
    subtitle: 'SoftSensor AI: from fragmented source data to five automated dashboards',
    meta: 'Professional work · SoftSensor AI · Oct – Dec 2024',
    image: { kind: 'dashboard', alt: 'Illustrative Power BI-style dashboard with KPI tiles and charts, built from synthetic data.' },
    problem: 'The client relied on manually compiled reports drawn from three years of inconsistent sales and marketing data.',
    outcomes: [
      '15 KPIs defined with stakeholders across 5 Power BI dashboards',
      'Python, SQL, Power Query and Fabric ETL with automated daily refresh',
      'Replaced about 8 hours of manual reporting preparation per cycle',
    ],
    tech: ['SQL', 'Python', 'Excel', 'Power Query', 'Microsoft Fabric', 'Power BI', 'DAX'],
    repoNote: 'Client work. Code and dashboards are confidential.',
  },
  {
    slug: 'intelligent-defence-system',
    featured: true,
    categories: ['ml', 'backend'],
    categoryLabel: 'Machine Learning · Backend',
    title: 'Intelligent Defence System',
    subtitle: 'Network-intrusion classification with a Flask and MySQL web application',
    meta: 'B.E. final-year project · Sep 2023 – Jun 2024',
    image: { kind: 'defence-chart', alt: 'Bar chart comparing the notebook accuracy of six classifiers, with Extra Trees highest at 98.5 percent.' },
    problem: 'Classify network connection records as normal or anomalous, and put the workflow into a usable web application.',
    outcomes: [
      '6 classifiers compared on 22,544 labelled connection records with 41 features',
      'Extra Trees scored highest in the notebook: 98.49% on a stratified 30% hold-out',
      'Flask app covering CSV upload, preprocessing, model training, prediction and MySQL-backed accounts',
    ],
    tech: ['Python', 'pandas', 'scikit-learn', 'Keras', 'Flask', 'MySQL'],
    repo: 'https://github.com/yash1-coder/Intelligent-defence-system',
  },
  {
    slug: 'ecommerce-chatbot',
    featured: false,
    categories: ['backend'],
    categoryLabel: 'Full-stack web',
    title: 'Clothing E-commerce Site with AI Chatbot',
    subtitle: 'React.js and Node.js storefront with a customer-support chatbot and payment integration',
    meta: 'Personal project · Jun 2022 – Sep 2023',
    tech: ['React.js', 'Node.js', 'Firebase', 'JavaScript'],
    repoNote: 'Source code is not public.',
  },
  {
    slug: 'lib-management',
    featured: false,
    categories: ['backend'],
    categoryLabel: 'Python desktop app',
    title: 'Library Management System',
    subtitle: 'Tkinter desktop app with MySQL storage for adding, issuing, returning and deleting books',
    meta: 'Personal project',
    tech: ['Python', 'Tkinter', 'PyMySQL', 'MySQL'],
    repo: 'https://github.com/yash1-coder/lib-management',
  },
];

// ---------- Experience & education timeline ----------
export const experience = [
  {
    role: 'Data Scientist',
    org: 'SoftSensor AI',
    place: 'Delhi, India (client based in Dubai)',
    dates: 'Oct 2024 – Dec 2024',
    points: [
      'Worked in a 5-member delivery team and directly with client stakeholders to turn commercial reporting requirements into 15 KPIs across 5 Power BI dashboards.',
      'Consolidated 3 years of fragmented sales and marketing data from 2 source systems, using SQL, Excel and data-quality checks to reconcile inconsistent sources.',
      'Built a Python, SQL, Power Query and Microsoft Fabric ETL workflow that produced validated analytical datasets and reusable reporting logic.',
      'Delivered dashboards with automated daily refresh, replacing about 8 hours of manual reporting preparation per cycle. Tested outputs against the transformed source data.',
    ],
    tags: ['Power BI', 'DAX', 'Microsoft Fabric', 'SQL', 'Python', 'Power Query'],
    caseStudy: '/projects/softsensor-bi',
  },
];

export const education = [
  {
    title: 'MSc Advanced Computer Science',
    grade: 'Distinction',
    org: 'University of Leicester, United Kingdom',
    dates: 'Jan 2025 – Jul 2026',
    note: 'Dissertation: Colouring Black Boxes, explainable AI for satellite image classification.',
    href: '/projects/colouring-black-boxes',
  },
  {
    title: 'B.E. Computer Engineering',
    grade: 'First Class · CGPA 7.62/10',
    org: 'St. Francis Institute of Technology, University of Mumbai, India',
    dates: 'Jan 2020 – Jun 2024',
    note: 'Final-year project: Intelligent Defence System.',
    href: '/projects/intelligent-defence-system',
  },
];

export const certifications = [
  { issuer: 'Anthropic Academy', year: '2026', items: ['Claude Certified Developer – Foundations (CCDV-F)', 'Claude Code in Action', 'Claude 101'] },
  { issuer: 'HackerRank', year: '2025', items: ['Software Engineer', 'Python', 'REST API (Intermediate)', 'JavaScript (Intermediate)', 'React', 'Node.js (Basic)', 'Problem Solving (Basic)'] },
];

export const leadership = [
  { title: 'Rekindle, SFIT Alumni Association', year: '2023', text: 'Led 50+ volunteers for an alumni event with 500+ attendees.' },
  { title: 'Community work', year: '', text: 'Led a 200+ sapling plantation drive and ran 5 technical workshops for 100+ students.' },
];

// ---------- Skill explorer: every skill links to where it was used ----------
const P = (slug, label) => ({ href: `/projects/${slug}`, label });
const SS = P('softsensor-bi', 'SoftSensor AI · BI reporting');
const XAI = P('colouring-black-boxes', 'Colouring Black Boxes');
const IDS = P('intelligent-defence-system', 'Intelligent Defence System');
const LIB = { href: 'https://github.com/yash1-coder/lib-management', label: 'Library Management System (GitHub)' };
const ECOM = { href: '/#more-projects', label: 'E-commerce site with chatbot' };

export const skillGroups = [
  {
    id: 'data', name: 'Data & BI', skills: [
      { name: 'SQL', used: [SS] },
      { name: 'Excel', used: [SS] },
      { name: 'Power BI', used: [SS] },
      { name: 'DAX', used: [SS] },
      { name: 'Power Query', used: [SS] },
      { name: 'Microsoft Fabric', used: [SS] },
      { name: 'ETL & data validation', used: [SS] },
      { name: 'Data modelling', used: [SS] },
      { name: 'pandas', used: [IDS] },
    ],
  },
  {
    id: 'backend', name: 'Backend & APIs', skills: [
      { name: 'Python', used: [XAI, IDS, SS, LIB] },
      { name: 'Flask', used: [IDS] },
      { name: 'Node.js', used: [ECOM] },
      { name: 'React.js', used: [ECOM] },
      { name: 'Tkinter', used: [LIB] },
    ],
  },
  {
    id: 'ml', name: 'AI & ML', skills: [
      { name: 'PyTorch', used: [XAI] },
      { name: 'timm', used: [XAI] },
      { name: 'Captum', used: [XAI] },
      { name: 'Integrated Gradients', used: [XAI] },
      { name: 'SmoothGrad', used: [XAI] },
      { name: 'Grad-CAM', used: [XAI] },
      { name: 'Attention rollout', used: [XAI] },
      { name: 'scikit-learn', used: [IDS] },
      { name: 'Keras', used: [IDS] },
      { name: 'Model evaluation', used: [XAI, IDS] },
    ],
  },
  {
    id: 'db', name: 'Databases', skills: [
      { name: 'MySQL', used: [IDS, LIB] },
      { name: 'Fabric Lakehouse', used: [SS] },
      { name: 'Firebase', used: [ECOM] },
    ],
  },
  {
    id: 'tools', name: 'Tools & platforms', skills: [
      { name: 'Git & GitHub', used: [XAI, IDS, LIB] },
      { name: 'Jupyter', used: [XAI, IDS] },
      { name: 'Claude Code', used: [{ href: '/#credentials', label: 'Anthropic Academy certification' }] },
    ],
  },
];
