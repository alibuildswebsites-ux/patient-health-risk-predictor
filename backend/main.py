import os
import json
import pandas as pd
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI(title="Heart Disease ML Predictor & Segmentation API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
scaler = joblib.load("models/scaler.pkl")
kmeans = joblib.load("models/kmeans.pkl")

classifiers = {
    "knn": joblib.load("models/knn.pkl"),
    "logistic_regression": joblib.load("models/logistic_regression.pkl"),
    "decision_tree": joblib.load("models/decision_tree.pkl"),
    "random_forest": joblib.load("models/random_forest.pkl")
}

class PatientInput(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

@app.post("/predict")
def predict(patient: PatientInput):
    # Convert payload to array
    input_data = np.array([[
        patient.age, patient.sex, patient.cp, patient.trestbps, patient.chol,
        patient.fbs, patient.restecg, patient.thalach, patient.exang, patient.oldpeak,
        patient.slope, patient.ca, patient.thal
    ]])
    
    # Scale input
    scaled_data = scaler.transform(input_data)
    
    # Run prediction & confidence estimates
    results = {}
    votes = 0
    rf_prob_1 = 0.0
    
    for name, clf in classifiers.items():
        pred = int(clf.predict(scaled_data)[0])
        votes += pred
        
        # Extract prediction probabilities if available
        if hasattr(clf, "predict_proba"):
            probs = clf.predict_proba(scaled_data)[0]
            conf = float(probs[pred])
            if name == "random_forest":
                rf_prob_1 = float(probs[1])
        else:
            # Fallback for models without predict_proba
            conf = 1.0
            if name == "random_forest":
                rf_prob_1 = float(pred)
            
        results[name] = {
            "prediction": pred,
            "confidence": round(conf, 4)
        }
        
    # Unsupervised Cluster
    cluster_id = int(kmeans.predict(scaled_data)[0])
    results["cluster"] = cluster_id
    
    # Risk Level determination logic:
    # - If majority models predict 1 AND random_forest confidence for class 1 > 0.7 -> "High"
    # - If majority models predict 1 -> "Medium"
    # - Otherwise -> "Low"
    is_majority_positive = votes >= 2
    if is_majority_positive and rf_prob_1 > 0.7:
        risk_level = "High"
    elif is_majority_positive:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    results["risk_level"] = risk_level
    return results

@app.get("/model-stats")
def get_model_stats():
    with open("models/model_stats.json", "r") as f:
        data = json.load(f)
    return data

@app.get("/feature-importance")
def get_feature_importance():
    with open("models/feature_importance.json", "r") as f:
        data = json.load(f)
    return data

@app.get("/clusters")
def get_clusters():
    df = pd.read_csv("data/pca_data.csv")
    return df.to_dict(orient="records")

@app.get("/cluster-profiles")
def get_cluster_profiles():
    with open("data/cluster_profiles.json", "r") as f:
        data = json.load(f)
    return data
