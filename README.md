# Patient Health Risk Predictor

A full-stack machine learning web application that predicts a patient's heart disease risk using clinical diagnostic data. Built with a React/TypeScript frontend and a FastAPI Python backend powered by four trained ML classifiers and a K-Means clustering model.

---

## What It Does

You enter a patient's clinical measurements (age, blood pressure, cholesterol, etc.) through a clean web interface. The app sends those values to a real ML backend, which runs them through four trained models and returns:

- A **risk level** (Low / Medium / High)
- A **patient cluster** (cohort group the patient belongs to)
- **Per-model confidence scores** from KNN, Logistic Regression, Decision Tree, and Random Forest

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | Framer Motion, Recharts, Lucide React |
| Backend | FastAPI, Uvicorn |
| ML Models | scikit-learn (KNN, Logistic Regression, Decision Tree, Random Forest, K-Means) |
| Data | UCI Heart Disease Dataset (`heart.csv`) |

---

## Project Structure

```
ai_p/
├── backend/
│   ├── main.py                  # FastAPI backend — prediction API
│   ├── preprocessing.py         # Data cleaning and feature engineering
│   ├── supervised.py            # Trains the 4 classifiers, saves .pkl files
│   ├── unsupervised.py          # Trains K-Means, generates cluster profiles
│   ├── heart.csv                # Raw dataset
│   ├── requirements.txt         # Python dependencies
│   ├── models/
│   │   ├── scaler.pkl           # StandardScaler fitted on training data
│   │   ├── knn.pkl              # K-Nearest Neighbors classifier
│   │   ├── logistic_regression.pkl
│   │   ├── decision_tree.pkl
│   │   ├── random_forest.pkl
│   │   ├── kmeans.pkl           # K-Means clustering model
│   │   ├── model_stats.json     # Accuracy, precision, recall, F1 per model
│   │   └── feature_importance.json
│   ├── data/
│   │   ├── heart_cleaned.csv    # Preprocessed dataset
│   │   ├── pca_data.csv         # PCA-reduced data for cluster visualization
│   │   └── cluster_profiles.json
│   └── plots/                   # Training visualizations (confusion matrices, etc.)
├── src/
│   ├── App.tsx                  # Root component, tab routing, global state
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Design tokens, custom utilities, Recharts overrides
│   ├── components/
│   │   ├── Navbar.tsx           # Tab navigation (Home / Predict / Dashboard / About)
│   │   ├── Home.tsx             # Landing page with project overview
│   │   ├── Predict.tsx          # Patient input form + live prediction results
│   │   ├── Dashboard.tsx        # Analytics, model stats, cluster explorer
│   │   ├── About.tsx            # Project details: data, pipeline, models, clusters
│   │   └── Footer.tsx           # Site footer with links
│   └── data/
│       └── mockData.ts          # Patient type definition + seed data
├── vercel.json                  # Vercel deployment config (frontend only)
├── vite.config.ts               # Vite dev server config
├── .env.local                   # Local dev environment variables
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Prerequisites

- **Python 3.10+** — [python.org](https://www.python.org/)
- **Node.js 18+** and **npm** — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)

---

## Setup — Step by Step

### 1. Clone the Repository

```bash
git clone https://github.com/alibuildswebsites-ux/patient-health-risk-predictor.git
cd patient-health-risk-predictor
```

---

### 2. Set Up the Python Backend

#### Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\activate  # Windows
```

#### Install Python dependencies

```bash
pip install -r backend/requirements.txt
```

---

### 3. Train the Models (only needed once)

The `backend/models/` directory contains pre-trained `.pkl` files so you can skip this step if they're already present. To retrain from scratch:

```bash
# Step 1: Clean and preprocess the raw data
python backend/preprocessing.py

# Step 2: Train and save the 4 supervised classifiers
python backend/supervised.py

# Step 3: Train K-Means and generate cluster profiles
python backend/unsupervised.py
```

This regenerates all files inside `backend/models/`, `backend/data/`, and `backend/plots/`.

---

### 4. Start the Backend (FastAPI)

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- `http://localhost:8000`
- API docs (auto-generated): `http://localhost:8000/docs`

> Keep this terminal open. Open a new terminal for the next step.

---

### 5. Install Frontend Dependencies

```bash
npm install
```

---

### 6. Start the Frontend (Vite Dev Server)

```bash
npm run dev
```

The app will be available at:
- Local: `http://localhost:5173`
- Network: `http://<your-ip>:5173`

---

## API Reference

### `POST /predict`

Accepts 13 clinical features and returns risk classification.

**Request body:**
```json
{
  "age": 55,
  "sex": 1,
  "cp": 0,
  "trestbps": 160,
  "chol": 280,
  "fbs": 1,
  "restecg": 1,
  "thalach": 110,
  "exang": 1,
  "oldpeak": 3.5,
  "slope": 2,
  "ca": 2,
  "thal": 3
}
```

**Response:**
```json
{
  "knn":                  { "prediction": 1, "confidence": 0.8800 },
  "logistic_regression":  { "prediction": 1, "confidence": 0.9100 },
  "decision_tree":        { "prediction": 1, "confidence": 1.0000 },
  "random_forest":        { "prediction": 1, "confidence": 0.9200 },
  "cluster":              1,
  "risk_level":           "High"
}
```

### `GET /model-stats`
Returns accuracy, precision, recall, and F1 score for each model.

### `GET /feature-importance`
Returns Random Forest feature importance scores.

### `GET /clusters`
Returns PCA-reduced patient data for the cluster scatter plot.

### `GET /cluster-profiles`
Returns mean feature values per cluster group.

---

## Field Encoding Reference

| Field | Description | Values |
|---|---|---|
| `sex` | Biological sex | 0 = Female, 1 = Male |
| `cp` | Chest pain type | 0 = Asymptomatic, 1 = Typical Angina, 2 = Atypical Angina, 3 = Non-Anginal |
| `fbs` | Fasting blood sugar > 120 mg/dl | 0 = No, 1 = Yes |
| `restecg` | Resting ECG result | 0 = Normal, 1 = ST-T Abnormality, 2 = LV Hypertrophy |
| `exang` | Exercise induced angina | 0 = No, 1 = Yes |
| `slope` | ST segment slope | 0 = Upsloping, 1 = Flat, 2 = Downsloping |
| `thal` | Thalassemia type | 1 = Normal, 2 = Fixed Defect, 3 = Reversible Defect |
| `ca` | Major vessels colored | 0–3 |

---

## Model Performance

| Model | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| Random Forest | **86.67%** | 88.46% | 82.14% | 85.19% |
| KNN | 85.00% | 88.00% | 78.57% | 83.02% |
| Logistic Regression | 83.33% | 84.62% | 78.57% | 81.48% |
| Decision Tree | 70.00% | 69.23% | 64.29% | 66.67% |

Risk level is determined by ensemble voting across all four models, with Random Forest confidence used as a tiebreaker.

---

## Deployment

### Production Backend

Run with multiple workers on the server:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 2
```

### Production Frontend

Deploy to Vercel (recommended) or build and serve statically:

```bash
npm run build      # outputs to dist/
npx serve dist -l 5001
```

Set the `VITE_API_URL` environment variable to point to your backend server (e.g., `http://<server-ip>:8000`).

---

## License

MIT
