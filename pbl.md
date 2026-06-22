---
title: "Project Based Learning (PBL) Report: Patient Health Risk Predictor"
author: 
  - "Student Name: Raza Ali"
  - "Student ID: IU04-0324-0201"
date: "June 2024"
geometry: margin=1in
---

# 1. Project Overview

## 1.1 Introduction
The **Patient Health Risk Predictor** is a full-stack machine learning web application designed to predict a patient's heart disease risk using clinical diagnostic data. The system provides an intuitive interface for entering patient data and utilizes multiple machine learning models to assess health risks, offering a comprehensive overview of a patient's health status.

## 1.2 Problem Statement
Heart disease remains a leading cause of mortality worldwide. Early detection and risk assessment are critical for effective intervention and treatment. This project aims to bridge the gap between complex diagnostic data and actionable health insights by deploying machine learning algorithms that can accurately predict the likelihood of heart disease.

# 2. Architecture and Technology Stack

The project is structured as a modern web application with a decoupled frontend and backend.

## 2.1 Frontend
- **Framework:** React 18 with TypeScript.
- **Build Tool:** Vite.
- **Styling:** Tailwind CSS.
- **UI Components:** Framer Motion (animations), Recharts (data visualization), Lucide React (icons).

## 2.2 Backend
- **Framework:** FastAPI (Python) running on Uvicorn.
- **Machine Learning Library:** scikit-learn.
- **Data Processing:** pandas, NumPy.
- **Dataset:** UCI Heart Disease Dataset (`heart.csv`).

# 3. Machine Learning Pipeline

The backend implements both supervised and unsupervised learning techniques to provide a multifaceted risk assessment.

## 3.1 Data Preprocessing
Raw clinical data undergoes rigorous preprocessing:
- Handling missing values and ensuring correct data types.
- Feature scaling using `StandardScaler` to normalize distributions.
- Generating a cleaned dataset (`heart_cleaned.csv`) for model training.

## 3.2 Supervised Learning (Classification)
The system trains four distinct classification models to predict the presence of heart disease:
1. **K-Nearest Neighbors (KNN)**
2. **Logistic Regression**
3. **Decision Tree**
4. **Random Forest**

The final "Risk Level" (Low, Medium, High) is determined by an ensemble voting mechanism across these four models, using the Random Forest confidence score as a tiebreaker.

## 3.3 Unsupervised Learning (Clustering)
In addition to classification, the application uses **K-Means Clustering** to group patients into distinct cohorts based on similar clinical profiles. 
- **PCA (Principal Component Analysis)** is applied to reduce the dataset to two dimensions, enabling 2D scatter plot visualizations of patient clusters.

# 4. Model Performance and Evaluation

The models were evaluated using standard classification metrics (Accuracy, Precision, Recall, and F1 Score). 

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---|---|---|---|
| Random Forest | **86.67%** | 88.46% | 82.14% | 85.19% |
| KNN | 85.00% | 88.00% | 78.57% | 83.02% |
| Logistic Regression | 83.33% | 84.62% | 78.57% | 81.48% |
| Decision Tree | 70.00% | 69.23% | 64.29% | 66.67% |

The Random Forest model demonstrated the highest overall performance and generalization capability.

# 5. Application Features

## 5.1 Interactive Dashboard
- **Live Prediction:** Users can input 13 clinical parameters (e.g., age, blood pressure, cholesterol, resting ECG) and receive real-time risk predictions.
- **Model Confidence:** Displays the individual prediction and confidence score of each trained model.
- **Analytics Visualization:** Interactive charts showcasing feature importance, model accuracy comparisons, and patient clustering (PCA reduction).

## 5.2 API Endpoints
The FastAPI backend exposes several RESTful endpoints:
- `POST /predict`: Accepts patient features and returns risk classification.
- `GET /model-stats`: Retrieves performance metrics for the models.
- `GET /feature-importance`: Returns the impact score of each clinical feature.
- `GET /clusters` & `GET /cluster-profiles`: Provides data for cluster visualizations.

# 6. Conclusion
The Patient Health Risk Predictor successfully integrates machine learning into a scalable, user-friendly web application. By utilizing an ensemble of classifiers and clustering techniques, the application provides reliable and interpretable insights into heart disease risk, demonstrating the practical application of artificial intelligence in healthcare diagnostics.
