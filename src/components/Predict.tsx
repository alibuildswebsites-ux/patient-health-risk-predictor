import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Patient } from '../data/mockData';

interface PredictProps {
  onPredict: (newPatient: Patient) => void;
}

export const Predict: React.FC<PredictProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    age: 55,
    sex: 'Male',
    chestPainType: 'Typical Angina',
    restingBp: 130,
    cholesterol: 240,
    fastingBs: false,
    maxHeartRate: 150,
    exerciseAngina: false
  });

  const [result, setResult] = useState<Patient | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Deterministic classifier mock logic
    let score = 0;
    if (formData.age > 50) score += 2;
    if (formData.sex === 'Male') score += 1;
    if (formData.chestPainType === 'Asymptomatic') score += 3;
    else if (formData.chestPainType === 'Typical Angina') score += 2;
    if (formData.restingBp > 140) score += 2;
    if (formData.cholesterol > 250) score += 2;
    if (formData.fastingBs) score += 1;
    if (formData.maxHeartRate < 130) score += 3;
    if (formData.exerciseAngina) score += 3;

    let riskLevel: 'Low' | 'Medium' | 'High';
    let cluster: string;
    let baseConfidence = 75;

    if (score >= 12) {
      riskLevel = 'High';
      cluster = 'Cluster 2 — Severe Risk Group';
      baseConfidence = 88;
    } else if (score >= 6) {
      riskLevel = 'Medium';
      cluster = 'Cluster 1 — Moderate Risk Group';
      baseConfidence = 80;
    } else {
      riskLevel = 'Low';
      cluster = 'Cluster 0 — Healthy/Low Risk Group';
      baseConfidence = 90;
    }

    const confidenceOffset = Math.floor(Math.random() * 5);
    const newPrediction: Patient = {
      id: "p_" + Date.now(),
      age: Number(formData.age),
      sex: formData.sex as 'Male' | 'Female',
      chestPainType: formData.chestPainType as any,
      restingBp: Number(formData.restingBp),
      cholesterol: Number(formData.cholesterol),
      fastingBs: formData.fastingBs,
      maxHeartRate: Number(formData.maxHeartRate),
      exerciseAngina: formData.exerciseAngina,
      riskLevel,
      cluster,
      confidence: {
        knn: Math.min(100, baseConfidence + confidenceOffset),
        logisticRegression: Math.min(100, baseConfidence + confidenceOffset + 3),
        decisionTree: Math.min(100, baseConfidence + confidenceOffset - 4)
      }
    };

    onPredict(newPrediction);
    setResult(newPrediction);
  };

  const confidenceData = result
    ? [
        { name: 'KNN', score: result.confidence.knn },
        { name: 'Logistic Regression', score: result.confidence.logisticRegression },
        { name: 'Decision Tree', score: result.confidence.decisionTree }
      ]
    : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-[#e7000b] bg-[#e7000b]/10 border-[#e7000b] glow-red';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500 glow-yellow';
      default: return 'text-green-500 bg-green-500/10 border-green-500 glow-green';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-8">
      {/* Form Card */}
      <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 glow-blue">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-6 w-6 text-[#3a81f6]" />
          <h2 className="text-xl font-bold">Predict Diagnostics</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
                required
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Sex</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Chest Pain Type</label>
              <select
                value={formData.chestPainType}
                onChange={(e) => setFormData({ ...formData, chestPainType: e.target.value })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
              >
                <option value="Typical Angina">Typical Angina</option>
                <option value="Atypical Angina">Atypical Angina</option>
                <option value="Non-Anginal Pain">Non-Anginal Pain</option>
                <option value="Asymptomatic">Asymptomatic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Max Heart Rate</label>
              <input
                type="number"
                value={formData.maxHeartRate}
                onChange={(e) => setFormData({ ...formData, maxHeartRate: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
                required
                min="50"
                max="250"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Resting Blood Pressure (mmHg)</label>
              <input
                type="number"
                value={formData.restingBp}
                onChange={(e) => setFormData({ ...formData, restingBp: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
                required
                min="80"
                max="220"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Cholesterol (mg/dl)</label>
              <input
                type="number"
                value={formData.cholesterol}
                onChange={(e) => setFormData({ ...formData, cholesterol: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm"
                required
                min="100"
                max="600"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center justify-between p-4 bg-[#262626]/20 rounded-lg border border-[#262626]">
              <div>
                <span className="block text-sm font-medium">Fasting Blood Sugar</span>
                <span className="block text-xs text-[#a1a1a1]">&gt; 120 mg/dl</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, fastingBs: !formData.fastingBs })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.fastingBs ? 'bg-[#3a81f6]' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.fastingBs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#262626]/20 rounded-lg border border-[#262626]">
              <div>
                <span className="block text-sm font-medium">Exercise Induced Angina</span>
                <span className="block text-xs text-[#a1a1a1]">Chest pain upon exertion</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, exerciseAngina: !formData.exerciseAngina })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.exerciseAngina ? 'bg-[#3a81f6]' : 'bg-[#262626]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.exerciseAngina ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#3a81f6] hover:bg-[#2563ef] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(58,129,246,0.5)] transform hover:scale-[1.01]"
          >
            Analyze Patient
          </button>
        </form>
      </div>

      {/* Result Card */}
      <div className="lg:col-span-5 min-h-[400px]">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result-active"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 flex flex-col justify-between h-full glow-blue"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle2 className="h-6 w-6 text-[#3a81f6]" />
                  <h2 className="text-xl font-bold">Diagnostic Results</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Patient Risk Classification</span>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">Unsupervised Cohort Assignment</span>
                    <p className="text-white font-medium text-sm md:text-base border border-[#262626] rounded-lg px-4 py-2.5 bg-[#262626]/20">
                      {result.cluster}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-4">Model Confidence Scores (%)</span>
                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart layout="vertical" data={confidenceData} margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                          <XAxis type="number" domain={[0, 100]} stroke="#a1a1a1" fontSize={10} />
                          <YAxis dataKey="name" type="category" stroke="#a1a1a1" fontSize={10} width={80} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {confidenceData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === 1 ? '#3a81f6' : index === 0 ? '#91c5ff' : '#2563ef'} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 border-dashed flex flex-col items-center justify-center text-center h-[535px]">
              <ShieldAlert className="h-12 w-12 text-[#a1a1a1] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Diagnostic Run</h3>
              <p className="text-sm text-[#a1a1a1] max-w-xs leading-relaxed">
                Provide patient clinical metrics on the left panel and click 'Analyze Patient' to observe classification metrics.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Predict;