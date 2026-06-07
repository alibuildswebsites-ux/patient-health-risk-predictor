# Design Specification: Patient Health Risk Predictor & Segmentation System

**Date:** 2026-06-07  
**Status:** Approved  
**Frameworks:** React (Vite + TypeScript), Tailwind CSS, Framer Motion, Recharts

## 1. System Overview
The Patient Health Risk Predictor & Segmentation System is a high-fidelity frontend application allowing clinicians to input patient metrics, run simulated Machine Learning classification/clustering, and view aggregated population statistics on a dashboard.

## 2. Global Theme & Aesthetic
- **Theme:** Strict dark mode only (forced `html` class, background `#0a0a0a`).
- **Visuals:** Subtle breathing background radial glow using Framer Motion.
- **Accents:** Neon blue highlights (`#3a81f6`) for active nav tabs, button glows, and main chart colors.
- **Typography:** Sans-serif clean look (inter/system ui) with heavy contrast between primary white elements and muted grey metadata.

## 3. Pages & Features
### 3.1. Navigation
- Fixed header with backdrop filter.
- Indicator underline transitions smoothly using `layoutId` on tab change.

### 3.2. Home Page
- Hero header + Subtitle outlining models (KNN, Logistic Regression, K-Means).
- CTAs to Predict Risk and View Dashboard.
- 3 Staggered metric cards (Patients Analyzed, ML Models, Risk Clusters).

### 3.3. Predict Page
- Input form: Age, Sex, Chest Pain Type (4 options), Resting Blood Pressure, Cholesterol, Fasting Blood Sugar, Max Heart Rate, Exercise Induced Angina.
- Simulated ML classifier logic that routes inputs to distinct clusters and risk levels (Low, Medium, High).
- Result section with animated spring transition, risk badge glow, and model confidence scores.

### 3.4. Dashboard Page
- Four population metric cards.
- Model Comparison grouped bar chart.
- Cluster Distribution donut chart.
- Feature Importance horizontal bar chart.
- Patient Risk Distribution area chart.

## 4. State Management
- Local React state representing the patient registry.
- New predictions append to the registry to dynamically update dashboard visualizations.
