export interface Patient {
  id: string;
  age: number;
  sex: 'Male' | 'Female';
  chestPainType: 'Typical Angina' | 'Atypical Angina' | 'Non-Anginal Pain' | 'Asymptomatic';
  restingBp: number;
  cholesterol: number;
  fastingBs: boolean;
  maxHeartRate: number;
  exerciseAngina: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  cluster: string;
  confidence: {
    knn: number;
    logisticRegression: number;
    decisionTree: number;
  }
}

export const initialPatients: Patient[] = [
  {
    id: "p1",
    age: 63,
    sex: "Male",
    chestPainType: "Typical Angina",
    restingBp: 145,
    cholesterol: 233,
    fastingBs: true,
    maxHeartRate: 150,
    exerciseAngina: false,
    riskLevel: "Medium",
    cluster: "Cluster 1 — Moderate Risk Group",
    confidence: { knn: 82, logisticRegression: 88, decisionTree: 75 }
  },
  {
    id: "p2",
    age: 37,
    sex: "Male",
    chestPainType: "Non-Anginal Pain",
    restingBp: 130,
    cholesterol: 250,
    fastingBs: false,
    maxHeartRate: 187,
    exerciseAngina: false,
    riskLevel: "Low",
    cluster: "Cluster 0 — Healthy/Low Risk Group",
    confidence: { knn: 94, logisticRegression: 92, decisionTree: 89 }
  },
  {
    id: "p3",
    age: 41,
    sex: "Female",
    chestPainType: "Atypical Angina",
    restingBp: 130,
    cholesterol: 204,
    fastingBs: false,
    maxHeartRate: 172,
    exerciseAngina: false,
    riskLevel: "Low",
    cluster: "Cluster 0 — Healthy/Low Risk Group",
    confidence: { knn: 91, logisticRegression: 95, decisionTree: 90 }
  },
  {
    id: "p4",
    age: 56,
    sex: "Male",
    chestPainType: "Asymptomatic",
    restingBp: 120,
    cholesterol: 236,
    fastingBs: false,
    maxHeartRate: 178,
    exerciseAngina: false,
    riskLevel: "Low",
    cluster: "Cluster 0 — Healthy/Low Risk Group",
    confidence: { knn: 88, logisticRegression: 85, decisionTree: 80 }
  },
  {
    id: "p5",
    age: 57,
    sex: "Female",
    chestPainType: "Asymptomatic",
    restingBp: 120,
    cholesterol: 354,
    fastingBs: false,
    maxHeartRate: 163,
    exerciseAngina: true,
    riskLevel: "High",
    cluster: "Cluster 2 — Severe Risk Group",
    confidence: { knn: 95, logisticRegression: 97, decisionTree: 92 }
  },
  {
    id: "p6",
    age: 57,
    sex: "Male",
    chestPainType: "Asymptomatic",
    restingBp: 140,
    cholesterol: 192,
    fastingBs: false,
    maxHeartRate: 148,
    exerciseAngina: false,
    riskLevel: "Medium",
    cluster: "Cluster 1 — Moderate Risk Group",
    confidence: { knn: 80, logisticRegression: 82, decisionTree: 74 }
  },
  {
    id: "p7",
    age: 67,
    sex: "Male",
    chestPainType: "Asymptomatic",
    restingBp: 160,
    cholesterol: 286,
    fastingBs: false,
    maxHeartRate: 108,
    exerciseAngina: true,
    riskLevel: "High",
    cluster: "Cluster 2 — Severe Risk Group",
    confidence: { knn: 96, logisticRegression: 94, decisionTree: 91 }
  }
];

export const featureImportance = [
  { name: 'Max Heart Rate', importance: 92 },
  { name: 'Chest Pain Type', importance: 88 },
  { name: 'Exercise Angina', importance: 85 },
  { name: 'Age', importance: 74 },
  { name: 'Cholesterol', importance: 68 },
  { name: 'Resting BP', importance: 54 }
];

export const modelMetrics = [
  { name: 'KNN', Accuracy: 88, Precision: 86, Recall: 85 },
  { name: 'Logistic Regression', Accuracy: 91, Precision: 90, Recall: 89 },
  { name: 'Decision Tree', Accuracy: 84, Precision: 82, Recall: 83 }
];