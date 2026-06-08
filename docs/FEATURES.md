# Feature & Functionality Overview

> A human-friendly walkthrough of every feature in the Patient Health Risk Predictor — what it does, how it works, and why it's there.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [Navigation](#2-navigation)
3. [Home Page](#3-home-page)
4. [Predict Page — The Core Feature](#4-predict-page--the-core-feature)
5. [Dashboard Page](#5-dashboard-page)
6. [The ML Backend](#6-the-ml-backend)
7. [How Risk Level Is Decided](#7-how-risk-level-is-decided)
8. [Patient Clustering](#8-patient-clustering)
9. [Data Flow — End to End](#9-data-flow--end-to-end)

---

## 1. The Big Picture

This app lets a clinician (or anyone) enter a patient's basic heart health measurements and instantly get a prediction of whether that patient is at **Low**, **Medium**, or **High** risk of heart disease — powered by real machine learning models trained on 900+ patient records.

It's split into two parts that work together:

- **Frontend** (what you see in the browser): A React web app with three pages.
- **Backend** (the brain): A Python API that runs four ML models and returns the prediction.

---

## 2. Navigation

**File:** `src/components/Navbar.tsx`

The top navigation bar has three tabs:

| Tab | What It Does |
|---|---|
| **Home** | Introduction and project overview |
| **Predict** | Enter patient data and get a prediction |
| **Dashboard** | See analytics, model performance, and cluster data |

Clicking a tab doesn't reload the page — it swaps the content instantly (single-page app). The active tab is highlighted in blue.

---

## 3. Home Page

**File:** `src/components/Home.tsx`

The landing page. It gives a quick introduction to what the project does and the technologies used. Nothing interactive here — it's purely informational to orient the user before they jump to Predict.

---

## 4. Predict Page — The Core Feature

**File:** `src/components/Predict.tsx`

This is the main feature of the app. It has two panels side by side:

### Left Panel — Patient Input Form

The form has **13 input fields**, each representing a clinical measurement. Every field is a **dropdown** with labelled preset options.

#### How the dropdowns work

Each dropdown is structured like this:

- **First option (marked ✓)** — the "healthy" value for that measurement. Selecting all first options will produce a **Low risk** result.
- **Middle options** — borderline or moderate values.
- **Last option (marked ✗)** — the "concerning" value for that measurement. Selecting all last options will produce a **High risk** result.
- **"Custom value…"** — if you pick this, a numeric text input appears right below the dropdown so you can type in any specific number.

This design makes it easy to demo the app ("select all ✓ options → Low risk") while still allowing precise custom clinical data entry.

#### The 13 Fields

| Field | What It Measures | Example Options |
|---|---|---|
| **Age** | Patient's age in years | 29 (Young) → 71 (Elderly) |
| **Sex** | Biological sex | Female (lower risk) → Male |
| **Chest Pain Type** | Type of chest pain experienced | Typical Angina → Asymptomatic (highest risk) |
| **Resting Blood Pressure** | Blood pressure at rest (mmHg) | 110 (Normal) → 180 (Very High) |
| **Serum Cholesterol** | Cholesterol level (mg/dl) | 180 (Normal) → 320 (Very High) |
| **Fasting Blood Sugar** | Whether blood sugar > 120 mg/dl | No → Yes |
| **Resting ECG** | Heart electrical activity at rest | Normal → LV Hypertrophy |
| **Max Heart Rate** | Peak heart rate during exercise | 175 bpm (High capacity) → 100 bpm (Low) |
| **Exercise Induced Angina** | Chest pain triggered by exercise | No → Yes |
| **ST Depression (Oldpeak)** | ECG depression during exercise vs rest | 0.0 (None) → 4.5 (Severe) |
| **ST Segment Slope** | Shape of the ECG ST segment | Upsloping (Healthy) → Downsloping (Abnormal) |
| **Major Vessels Colored** | Number of major vessels seen under fluoroscopy | 0 (None) → 3 Vessels |
| **Thalassemia** | Blood disorder classification | Normal → Reversible Defect |

#### What Happens When You Click "Analyze Patient"

1. The form values are collected and sent as a JSON request to the ML backend at `POST /predict`.
2. A spinner appears on the button while waiting.
3. If there's an error (e.g. backend is offline), a red error message appears.
4. When the response arrives, the right panel animates in with the results.

### Right Panel — Results

After prediction, the right panel shows three things:

**1. Risk Classification**
A colored badge — green for Low, yellow for Medium, red for High.

**2. Cohort Assignment**
Which patient cluster the backend assigned this patient to (Cluster 0, 1, or 2), with a descriptive label (e.g. "Cluster 1 — Moderate Risk Group").

**3. Model Confidence Bar Chart**
A horizontal bar chart showing how confident each of the three visible models was in its prediction (as a percentage):
- KNN
- Logistic Regression
- Decision Tree

These scores come directly from each model's `predict_proba()` output — they reflect actual model certainty, not a made-up number.

---

## 5. Dashboard Page

**File:** `src/components/Dashboard.tsx`

The analytics page. It pulls live data from the backend and shows:

### Model Performance Table
Accuracy, Precision, Recall, and F1 scores for all four models, loaded from `GET /model-stats`. This data was computed at training time on a held-out test set.

| Model | Accuracy |
|---|---|
| Random Forest | 86.67% |
| KNN | 85.00% |
| Logistic Regression | 83.33% |
| Decision Tree | 70.00% |

### Feature Importance Chart
Loaded from `GET /feature-importance`. Shows which clinical measurements the Random Forest model found most predictive of heart disease. This helps understand what the model "pays attention to."

### Patient Cluster Explorer
A scatter plot (loaded from `GET /clusters`) showing all 900+ training patients plotted in 2D space using PCA (a dimensionality reduction technique). Each dot is colored by cluster. This visualization shows how the unsupervised K-Means model naturally grouped patients into three distinct cohorts.

### Recent Predictions
Every time a prediction is run on the Predict page, it gets prepended to a shared list in app state and shown here as a patient card. This gives a running history of predictions made during the session.

---

## 6. The ML Backend

**File:** `main.py`

A FastAPI Python server. It loads pre-trained model files from the `models/` directory at startup and exposes them via HTTP endpoints.

### Models Used

| Model | Type | What It Does |
|---|---|---|
| **KNN** | Supervised classifier | Finds the K nearest patients in training data and votes |
| **Logistic Regression** | Supervised classifier | Fits a linear boundary between heart disease / no heart disease |
| **Decision Tree** | Supervised classifier | Learned a set of if/else rules from the training data |
| **Random Forest** | Supervised classifier | Ensemble of 100 decision trees — most accurate model |
| **K-Means** | Unsupervised clustering | Groups patients into 3 natural cohorts with no labels |
| **StandardScaler** | Preprocessor | Normalizes all input values before feeding to models |

### Training Pipeline

The models weren't trained inside `main.py` — they were trained offline using:

1. **`preprocessing.py`** — reads `heart.csv`, cleans missing values, encodes categorical columns, and outputs `data/heart_cleaned.csv`.
2. **`supervised.py`** — trains all 4 classifiers on 80% of the data, evaluates on 20%, saves `.pkl` files and `model_stats.json`.
3. **`unsupervised.py`** — trains K-Means with 3 clusters, runs PCA, saves `pca_data.csv` and `cluster_profiles.json`.

Once trained, the `.pkl` files are loaded once at server startup and reused for every prediction request.

---

## 7. How Risk Level Is Decided

This is the ensemble logic inside `main.py`:

```
1. All 4 classifiers make a prediction (0 = no disease, 1 = disease)
2. Count the votes: how many models predicted 1?
3. Get the Random Forest's confidence score for class 1 (0.0 to 1.0)

Decision:
  - If 2+ models voted 1 AND Random Forest confidence > 70% → HIGH
  - If 2+ models voted 1 but Random Forest confidence ≤ 70%  → MEDIUM
  - If fewer than 2 models voted 1                           → LOW
```

Random Forest is used as the tiebreaker because it is the most accurate model (86.67% accuracy). It carries more weight than a simple majority vote.

---

## 8. Patient Clustering

**Model:** K-Means with 3 clusters, trained on the same 13 features.

K-Means is an *unsupervised* algorithm — it wasn't told which patients have heart disease. It found natural groupings on its own based on how similar patients' measurements are.

The three clusters it found correspond roughly to:

| Cluster | Label | Characteristics |
|---|---|---|
| **0** | Healthy / Low Risk | Younger, lower cholesterol, higher max heart rate, no exercise angina. ~34% had heart disease. |
| **1** | Moderate/High Risk | Older, more asymptomatic chest pain, low max heart rate, high exercise angina. ~90% had heart disease. |
| **2** | Mixed / Low Risk | Mixed age, lower resting BP, fewer vessel colorings. ~18% had heart disease. |

Every prediction includes a cluster assignment so the clinician can see which naturally occurring patient group this person resembles most.

---

## 9. Data Flow — End to End

Here's the complete journey from form to result:

```
User fills dropdown fields on Predict page
           ↓
React collects 13 field values
           ↓
POST http://<server>:8000/predict
  Body: { age, sex, cp, trestbps, chol, fbs, restecg,
          thalach, exang, oldpeak, slope, ca, thal }
           ↓
FastAPI receives request
           ↓
StandardScaler normalizes the 13 values
           ↓
KNN, Logistic Regression, Decision Tree, Random Forest
each make a prediction independently
           ↓
Ensemble voting → risk_level (Low / Medium / High)
K-Means → cluster assignment (0, 1, or 2)
           ↓
JSON response returned to browser:
  { knn: {...}, logistic_regression: {...},
    decision_tree: {...}, random_forest: {...},
    cluster: 1, risk_level: "High" }
           ↓
React updates results panel:
  - Risk badge (color-coded)
  - Cluster label
  - Confidence bar chart (KNN, LR, DT)
           ↓
New patient record added to Dashboard history
```

Total round-trip time: typically under 100ms on a local network.
