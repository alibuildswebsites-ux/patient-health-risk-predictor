# Patient Health Risk Predictor & Segmentation System

An advanced patient health diagnostics classifier and unsupervised cohort segmentation system. This repository contains a complete React frontend paired with a FastAPI machine learning backend that predicts cardiovascular risk levels using model ensembles and groups patients using clustering algorithms.

## Features

- **Diagnostic Risk Classifier:** Predicts cardiovascular disease risk levels using 4 supervised classifiers (KNN, Logistic Regression, Decision Tree, Random Forest).
- **Unsupervised Cohort Segmentation:** Group patients into 3 distinct diagnostic cohorts using K-Means clustering.
- **PCA Visualizer:** Projects the high-dimensional clinical dataset into 2D spaces for visual cluster analysis.
- **Interactive UI Dashboard:** Real-time data visualization showing model comparisons, feature ranks, patient risk curves, and segment distributions.

## Architecture & Directory Tree

```
project/
├── data/                       # Preprocessed datasets and cluster outputs
├── models/                     # Trained classification and scaler models
├── plots/                      # Evaluation heatmaps and comparison charts
├── src/                        # React frontend code (TypeScript + Tailwind CSS)
├── preprocessing.py            # Data ingestion and cleaning pipeline
├── supervised.py               # Supervised classifiers training and evaluation
├── unsupervised.py             # Unsupervised K-Means clustering and PCA
├── main.py                     # FastAPI REST API Backend
├── index.html                  # Frontend index entry
├── package.json                # Frontend dependencies
├── requirements.txt            # Python ML dependencies
├── README.md                   # Project Overview
└── SETUP.md                    # Setup and installation instructions
```

## Dataset

The models are trained using the **Cleveland Clinic Heart Disease Dataset** retrieved from the [UCI Machine Learning Repository](https://archive.ics.uci.edu/ml/datasets/heart+disease).
- **Features:** 13 clinical attributes (age, sex, chest pain type, resting BP, cholesterol, fasting blood sugar, max heart rate, etc.)
- **Size:** 303 patient records (297 records clean)
