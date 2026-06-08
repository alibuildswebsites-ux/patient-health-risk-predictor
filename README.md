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
├── main.py                  # FastAPI backend — prediction API
├── preprocessing.py         # Data cleaning and feature engineering
├── supervised.py            # Trains the 4 classifiers, saves .pkl files
├── unsupervised.py          # Trains K-Means, generates cluster profiles
├── heart.csv                # Raw dataset
├── requirements.txt         # Python dependencies
├── models/
│   ├── scaler.pkl           # StandardScaler fitted on training data
│   ├── knn.pkl              # K-Nearest Neighbors classifier
│   ├── logistic_regression.pkl
│   ├── decision_tree.pkl
│   ├── random_forest.pkl
│   ├── kmeans.pkl           # K-Means clustering model
│   ├── model_stats.json     # Accuracy, precision, recall, F1 per model
│   └── feature_importance.json
├── data/
│   ├── heart_cleaned.csv    # Preprocessed dataset
│   ├── pca_data.csv         # PCA-reduced data for cluster visualization
│   └── cluster_profiles.json
├── src/
│   ├── App.tsx              # Root component, tab routing, global state
│   ├── components/
│   │   ├── Navbar.tsx       # Tab navigation (Home / Predict / Dashboard)
│   │   ├── Home.tsx         # Landing page with project overview
│   │   ├── Predict.tsx      # Patient input form + live prediction results
│   │   └── Dashboard.tsx    # Analytics, model stats, cluster explorer
│   └── data/
│       └── mockData.ts      # Patient type definition + seed data
├── vite.config.ts           # Vite dev server config (host: 0.0.0.0, port: 5001)
├── package.json
└── tailwind.config.js
```

---

## Prerequisites

Make sure you have the following installed:

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
```

**On Linux/macOS:**
```bash
source .venv/bin/activate
```

**On Windows:**
```bash
.venv\Scripts\activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Train the Models (only needed once)

The `models/` directory contains pre-trained `.pkl` files so you can skip this step if they're already present. If you want to retrain from scratch:

```bash
# Step 1: Clean and preprocess the raw data
python preprocessing.py

# Step 2: Train and save the 4 supervised classifiers
python supervised.py

# Step 3: Train K-Means and generate cluster profiles
python unsupervised.py
```

This will regenerate all files inside `models/` and `data/`.

---

### 4. Start the Backend (FastAPI)

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
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
- Local: `http://localhost:5001`
- Network (from other devices): `http://<your-ip>:5001`

---

## Accessing from Another Device / Network

Both servers bind to `0.0.0.0` so they are reachable from any device on the same network (or internet if the server is public).

If you are hosting on a cloud server (DigitalOcean, AWS, GCP, etc.) make sure **ports 5001 and 8000 are open** in your firewall / security group rules.

| Service | Port | URL |
|---|---|---|
| Frontend | 5001 | `http://<server-ip>:5001` |
| Backend API | 8000 | `http://<server-ip>:8000` |
| API Docs | 8000 | `http://<server-ip>:8000/docs` |

---

## Running in Production (Optional)

For a stable production setup, build the frontend and serve it statically:

```bash
# Build the React app
npm run build

# Serve the dist/ folder (example using serve)
npx serve dist -l 5001
```

Run the backend with more workers:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

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

## License

MIT
