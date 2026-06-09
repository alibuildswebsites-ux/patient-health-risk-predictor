import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def run_unsupervised():
    # Load dataset & scaler
    df = pd.read_csv("data/heart_cleaned.csv")
    scaler = joblib.load("models/scaler.pkl")
    
    X = df.drop(columns=["target"])
    X_scaled = scaler.transform(X)
    
    # 1. Elbow Method
    inertias = []
    K_range = range(1, 11)
    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        kmeans.fit(X_scaled)
        inertias.append(kmeans.inertia_)
        
    plt.figure(figsize=(6, 4))
    plt.plot(K_range, inertias, "bo-", markersize=6)
    plt.xlabel("Number of Clusters (K)")
    plt.ylabel("Inertia")
    plt.title("Elbow Method For Optimal K")
    plt.tight_layout()
    plt.savefig("plots/elbow.png")
    plt.close()
    print("Saved plots/elbow.png")
    
    # 2. Optimal K=3 clustering
    optimal_k = 3
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init='auto')
    kmeans.fit(X_scaled)
    labels = kmeans.labels_
    
    # Save artifacts
    np.save("data/cluster_labels.npy", labels)
    joblib.dump(kmeans, "models/kmeans.pkl")
    print("Saved KMeans model and labels.")
    
    # 3. PCA Visualization
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)
    
    pca_df = pd.DataFrame(X_pca, columns=["pc1", "pc2"])
    pca_df["cluster"] = labels
    pca_df.to_csv("data/pca_data.csv", index=False)
    print("Saved data/pca_data.csv")
    
    plt.figure(figsize=(7, 5))
    sns.scatterplot(x="pc1", y="pc2", hue="cluster", palette="Set1", data=pca_df, alpha=0.8)
    plt.title("K-Means Clusters Visualized via PCA")
    plt.tight_layout()
    plt.savefig("plots/pca_clusters.png")
    plt.close()
    print("Saved plots/pca_clusters.png")
    
    # 4. Cluster Profile
    df["cluster"] = labels
    profiles = {}
    for cluster_id in range(optimal_k):
        cluster_mean = df[df["cluster"] == cluster_id].mean()
        # Convert to standard types to support JSON serialization
        profiles[str(cluster_id)] = {k: round(float(v), 4) for k, v in cluster_mean.items()}
        
    with open("data/cluster_profiles.json", "w") as f:
        json.dump(profiles, f, indent=2)
    print("Saved data/cluster_profiles.json")

if __name__ == "__main__":
    run_unsupervised()
