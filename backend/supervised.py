import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_and_evaluate():
    # Load preprocessed arrays
    X_train = np.load("data/X_train.npy")
    X_test = np.load("data/X_test.npy")
    y_train = np.load("data/y_train.npy")
    y_test = np.load("data/y_test.npy")
    
    # Cleaned dataframe for feature names
    df_cleaned = pd.read_csv("data/heart_cleaned.csv")
    feature_names = df_cleaned.drop(columns=["target"]).columns.tolist()
    
    # Initialize models
    models = {
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
        "decision_tree": DecisionTreeClassifier(random_state=42),
        "knn": KNeighborsClassifier(n_neighbors=5),
        "random_forest": RandomForestClassifier(n_estimators=100, random_state=42)
    }
    
    os.makedirs("models", exist_ok=True)
    os.makedirs("plots", exist_ok=True)
    
    stats = {}
    accuracies = []
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        
        # Predict
        y_pred = model.predict(X_test)
        
        # Metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred)
        
        stats[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4)
        }
        accuracies.append(acc)
        
        # Save model
        joblib.dump(model, f"models/{name}.pkl")
        
        # Plot confusion matrix
        plt.figure(figsize=(5, 4))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False,
                    xticklabels=["No Disease", "Disease"],
                    yticklabels=["No Disease", "Disease"])
        plt.title(f"Confusion Matrix: {name.replace('_', ' ').title()}")
        plt.ylabel("Actual")
        plt.xlabel("Predicted")
        plt.tight_layout()
        plt.savefig(f"plots/cm_{name}.png")
        plt.close()
        
    # Save model statistics
    with open("models/model_stats.json", "w") as f:
        json.dump(stats, f, indent=2)
    print("Saved models/model_stats.json")
    
    # Compute feature importances from Random Forest
    rf_model = models["random_forest"]
    importances = rf_model.feature_importances_
    feat_imp_dict = {feature_names[i]: round(float(importances[i]), 4) for i in range(len(feature_names))}
    sorted_feat_imp = dict(sorted(feat_imp_dict.items(), key=lambda item: item[1], reverse=True))
    
    with open("models/feature_importance.json", "w") as f:
        json.dump(sorted_feat_imp, f, indent=2)
    print("Saved models/feature_importance.json")
    
    # Plot model comparison chart
    model_names_display = [n.replace("_", " ").title() for n in models.keys()]
    plt.figure(figsize=(7, 5))
    sns.barplot(x=model_names_display, y=[a * 100 for a in accuracies], palette="Blues_d")
    plt.title("Model Performance Comparison")
    plt.ylabel("Accuracy (%)")
    plt.ylim(0, 100)
    for i, val in enumerate(accuracies):
        plt.text(i, val * 100 + 1, f"{val*100:.2f}%", ha='center', fontweight='bold')
    plt.tight_layout()
    plt.savefig("plots/model_comparison.png")
    plt.close()
    print("Saved plots/model_comparison.png")

if __name__ == "__main__":
    train_and_evaluate()
