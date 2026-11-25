# Content audit — November 2026 redesign

Sources of truth used, in priority order:

1. **CVs**: `Yash_Chourasia_Verisk_Business_Analyst_Intern_CV` (9 Nov 2026, newest) and `Yash_Chourasia_CV_BI_Analyst_General` (the CV served on the site), plus the owner's confirmation of the dates.
2. **Dissertation**: final report `dissertation_yc432_final_report_updated (3).docx` and the saved artefacts in the `yash1-coder/dissertation` repo (`results/metrics/model_comparison_summary.csv`, `*_classwise_metrics.csv`, `results/heatmaps`, `results/failure_cases`, `results/figures`).
3. **Public repositories**: `yash1-coder/Intelligent-defence-system` (`app.py`, `cyber_attack.ipynb` outputs) and `yash1-coder/lib-management`.

## Corrections made

| Previous site content | Now | Why |
|---|---|---|
| "MSc Advanced Computer Science **student**", "2026 MSc **expected** completion" | MSc Advanced Computer Science, **Distinction**, Jan 2025 – Jul 2026 (completed) | Degree completed; grade on current CVs |
| SoftSensor AI: **Jan 2024** – Dec 2024 | **Oct 2024** – Dec 2024 | Confirmed by owner; matches newest CV |
| "Near-real-time" / "real-time visibility", "live dashboards" | "Automated daily refresh" | Newest CV describes daily refresh, not real time |
| "Production-ready AI systems", "scalable backend applications" | Removed | No supporting evidence |
| E-commerce: "25% improvement in platform security", "35% increase in user satisfaction" | Removed; project moved to a small secondary card with no metrics and no link | No code or evidence available |
| Intelligent Defence: "85% detection accuracy on novel threat patterns", "demonstrated scalability to previously unseen attack types" | Notebook results for all 6 classifiers (Extra Trees 98.49% best, stratified 30% hold-out), with limitations stated | 85% isn't a measured result: `app.py` hard-codes KNN = 0.852456 for display, while the notebook measures KNN at 96.45%. Unseen-attack generalisation was never evaluated. |
| Intelligent Defence: "real-time traffic monitoring" | "CSV upload → preprocess → train → predict" | `app.py` works on uploaded CSV data; there's no live capture |
| Skills: **Grad-CAM++** | Removed. Added **Attention rollout** | Grad-CAM++ appears nowhere in the dissertation or its code. Attention rollout (ViT) is implemented and has saved outputs. |
| Every GitHub link pointed to `yash1-coder/yash1-coder` (profile README repo) | Profile link → `github.com/yash1-coder`; each project → its own repo | Correct destinations |
| "Vision Transformers achieved the highest accuracy" (no number) | ViT Tiny 98.62% accuracy, 0.9856 macro-F1, with pretraining and resolution caveats | Exact figures from the results CSV. The Verisk CV's "98.67%" is a typo for 98.62%. |
| Hero stat "85% cyber-attack detection accuracy" and "3+ end-to-end projects" | 5 dashboards · 15 KPIs · ~8 hrs/cycle · 6 algorithms | All verified, each with context |
| B.E. dates | Jan 2020 – Jun 2024 | Confirmed by owner (the Verisk CV's Jan 2021 is wrong) |
| CV PDF (June 2026, said "student") | `Yash_Chourasia_CV_BI_Analyst_General.pdf`, unmodified | Owner's choice |

## Added content and where it comes from

- **SoftSensor**: 5-member team, 15 KPIs, 5 dashboards, 3 years of sales and marketing data, Python/SQL/Power Query/Fabric ETL, automated daily refresh, ~8 hours of manual prep replaced per cycle. Source: Verisk CV. "2 source systems" and Fabric Lakehouse come from the BI General CV. Owner confirmed accuracy.
- **Dissertation**: every metric on the page comes from `model_comparison_summary.csv` and the per-class CSVs. Method assignment (IG and SmoothGrad for all models, Grad-CAM for ResNet18, rollout for ViT), the 120-image XAI sample, IG step budgets and the limitations all come from the final report (§3.7–3.10, §7.5).
- **Intelligent Defence**: 22,544 records, 41 features, 12,833 anomaly / 9,711 normal, and the six accuracies all come from `cyber_attack.ipynb` outputs. The app workflow comes from `app.py`.
- **Certifications**: Anthropic Academy (2026) from the Verisk CV. HackerRank (2025) from all CVs.

## Visual assets

- **XAI heatmaps, failure cases, confusion matrices and training curves**: the real PNG outputs from `results/`, converted to WebP and resized. Content is otherwise unchanged.
- **EuroSAT samples**: the first image of each class from the EuroSAT RGB dataset (Helber et al., MIT licence), resized to 192 px.
- **SoftSensor dashboard**: hand-drawn SVG with **synthetic data**, labelled "Illustrative dashboard using synthetic data. Not an actual client dashboard." Client dashboards are confidential and aren't reproduced.
- **Defence chart, XAI charts and per-class table**: generated at build time from the numbers in `src/content.js`.

## Known open items

- The served CV (BI Analyst General) says SoftSensor started **Jun 2024**, but the site says **Oct 2024** (confirmed). Update the CV and replace `assets/Yash_Chourasia_CV.pdf`.
- The `SQL-E-commerce-Analytics` GitHub repo is empty, so it isn't shown.
- No screenshots exist for the Intelligent Defence app or the e-commerce site.
- `Intelligent-defence-system/app.py` builds its login and registration SQL with string formatting (SQL-injection risk) and hard-codes the Flask secret key. Worth fixing in that public repo.
- The GitHub profile bio links LinkedIn as `/in/yash1-coder`; the site and CVs use `/in/yashchourasia-cs`.
