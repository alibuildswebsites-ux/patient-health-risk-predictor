import os
import urllib.request
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib

def download_data():
    print("Downloading Cleveland Heart Disease dataset...")
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    urllib.request.urlretrieve(url, "heart.csv")
    print("Download complete.")

def clean_and_preprocess():
    # Columns in cleveland dataset
    columns = [
        "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
        "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"
    ]
    
    # Load raw data
    df = pd.read_csv("heart.csv", names=columns, header=None)
    
    # Replace all "?" with NaN
    df = df.replace("?", np.nan)
    
    # Drop rows with NaN values
    df = df.dropna()
    
    # Target values > 0 become 1 (disease), 0 remains 0 (no disease)
    df["target"] = df["target"].apply(lambda x: 1 if int(x) > 0 else 0)
    
    # Save cleaned data
    df.to_csv("heart_cleaned.csv", index=False)
    print(f"Cleaned data saved. Shape: {df.shape}")
    
    # Separate features and target
    X = df.drop(columns=["target"])
    y = df["target"]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Ensure directories exist
    os.makedirs("data", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    
    # Save Scaler
    joblib.dump(scaler, "models/scaler.pkl")
    print("Scaler saved to models/scaler.pkl")
    
    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"X_train shape: {X_train.shape}")
    print(f"X_test shape: {X_test.shape}")
    
    # Save splits as numpy files
    np.save("data/X_train.npy", X_train)
    np.save("data/X_test.npy", X_test)
    np.save("data/y_train.npy", y_train.to_numpy())
    np.save("data/y_test.npy", y_test.to_numpy())
    
    # Move heart_cleaned.csv to data/ folder
    os.rename("heart_cleaned.csv", "data/heart_cleaned.csv")
    print("Data files saved to data/")

if __name__ == "__main__":
    download_data()
    clean_and_preprocess()
