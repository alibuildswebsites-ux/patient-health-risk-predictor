import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Patient } from '../data/mockData';

interface PredictProps {
  onPredict: (newPatient: Patient) => void;
}

// ── Field option types ────────────────────────────────────────────────────────

interface FieldOption {
  label: string;   // shown in the dropdown
  value: number;   // numeric value sent to the backend
}

interface SelectField {
  kind: 'select';
  key: string;
  label: string;
  subtitle?: string;
  options: FieldOption[];  // first = Good, last = Bad
  min?: number;
  max?: number;
}

// All 13 backend fields exposed as structured dropdowns.
// "Custom" option is appended automatically at render time.
const FIELDS: SelectField[] = [
  {
    kind: 'select',
    key: 'age',
    label: 'Age',
    options: [
      { label: '29 — Young Adult', value: 29 },
      { label: '45 — Middle-aged',  value: 45 },
      { label: '55 — Senior',       value: 55 },
      { label: '71 — Elderly',      value: 71 },
    ],
    min: 1, max: 120,
  },
  {
    kind: 'select',
    key: 'sex',
    label: 'Sex',
    options: [
      { label: 'Female', value: 0 },
      { label: 'Male',   value: 1 },
    ],
  },
  {
    kind: 'select',
    key: 'cp',
    label: 'Chest Pain Type',
    options: [
      { label: 'Typical Angina',    value: 1 },
      { label: 'Atypical Angina',   value: 2 },
      { label: 'Non-Anginal Pain',  value: 3 },
      { label: 'Asymptomatic',      value: 0 },
    ],
  },
  {
    kind: 'select',
    key: 'trestbps',
    label: 'Resting Blood Pressure (mmHg)',
    options: [
      { label: '110 — Normal',    value: 110 },
      { label: '130 — Elevated',  value: 130 },
      { label: '150 — High',      value: 150 },
      { label: '180 — Very High', value: 180 },
    ],
    min: 80, max: 220,
  },
  {
    kind: 'select',
    key: 'chol',
    label: 'Serum Cholesterol (mg/dl)',
    options: [
      { label: '180 — Normal',     value: 180 },
      { label: '220 — Borderline', value: 220 },
      { label: '260 — High',       value: 260 },
      { label: '320 — Very High',  value: 320 },
    ],
    min: 100, max: 600,
  },
  {
    kind: 'select',
    key: 'fbs',
    label: 'Fasting Blood Sugar',
    subtitle: '> 120 mg/dl',
    options: [
      { label: 'No — Normal (≤120 mg/dl)',   value: 0 },
      { label: 'Yes — Elevated (>120 mg/dl)', value: 1 },
    ],
  },
  {
    kind: 'select',
    key: 'restecg',
    label: 'Resting ECG Results',
    options: [
      { label: 'Normal',                    value: 0 },
      { label: 'ST-T Wave Abnormality',     value: 1 },
      { label: 'Left Ventricular Hypertrophy', value: 2 },
    ],
  },
  {
    kind: 'select',
    key: 'thalach',
    label: 'Max Heart Rate Achieved',
    options: [
      { label: '175 bpm — High Capacity',  value: 175 },
      { label: '150 bpm — Moderate',       value: 150 },
      { label: '130 bpm — Below Average',  value: 130 },
      { label: '100 bpm — Low',            value: 100 },
    ],
    min: 50, max: 250,
  },
  {
    kind: 'select',
    key: 'exang',
    label: 'Exercise Induced Angina',
    subtitle: 'Chest pain upon exertion',
    options: [
      { label: 'No',  value: 0 },
      { label: 'Yes', value: 1 },
    ],
  },
  {
    kind: 'select',
    key: 'oldpeak',
    label: 'ST Depression (Oldpeak)',
    subtitle: 'Induced by exercise vs rest',
    options: [
      { label: '0.0 — None',     value: 0.0 },
      { label: '1.0 — Mild',     value: 1.0 },
      { label: '2.5 — Moderate', value: 2.5 },
      { label: '4.5 — Severe',   value: 4.5 },
    ],
    min: 0, max: 10,
  },
  {
    kind: 'select',
    key: 'slope',
    label: 'ST Segment Slope',
    options: [
      { label: 'Upsloping — Healthy',    value: 0 },
      { label: 'Flat — Borderline',       value: 1 },
      { label: 'Downsloping — Abnormal',  value: 2 },
    ],
  },
  {
    kind: 'select',
    key: 'ca',
    label: 'Major Vessels Colored (Fluoroscopy)',
    options: [
      { label: '0 — None',  value: 0 },
      { label: '1 Vessel',  value: 1 },
      { label: '2 Vessels', value: 2 },
      { label: '3 Vessels', value: 3 },
    ],
  },
  {
    kind: 'select',
    key: 'thal',
    label: 'Thalassemia',
    options: [
      { label: 'Normal',              value: 1 },
      { label: 'Fixed Defect',        value: 2 },
      { label: 'Reversible Defect',   value: 3 },
    ],
  },
];

// ── Initial state ─────────────────────────────────────────────────────────────

type FormValues = Record<string, number>;
type CustomFlags = Record<string, boolean>;
type CustomInputs = Record<string, string>;

function buildInitialValues(): FormValues {
  const vals: FormValues = {};
  for (const f of FIELDS) vals[f.key] = f.options[0].value;
  return vals;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Predict: React.FC<PredictProps> = ({ onPredict }) => {
  const [values, setValues] = useState<FormValues>(buildInitialValues);
  const [customFlags, setCustomFlags] = useState<CustomFlags>({});
  const [customInputs, setCustomInputs] = useState<CustomInputs>({});

  const [result, setResult] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleDropdownChange = (key: string, raw: string) => {
    if (raw === '__custom__') {
      setCustomFlags(prev => ({ ...prev, [key]: true }));
    } else {
      setCustomFlags(prev => ({ ...prev, [key]: false }));
      setValues(prev => ({ ...prev, [key]: Number(raw) }));
    }
  };

  const handleCustomInput = (key: string, raw: string) => {
    setCustomInputs(prev => ({ ...prev, [key]: raw }));
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) setValues(prev => ({ ...prev, [key]: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      age:      values['age'],
      sex:      values['sex'],
      cp:       values['cp'],
      trestbps: values['trestbps'],
      chol:     values['chol'],
      fbs:      values['fbs'],
      restecg:  values['restecg'],
      thalach:  values['thalach'],
      exang:    values['exang'],
      oldpeak:  values['oldpeak'],
      slope:    values['slope'],
      ca:       values['ca'],
      thal:     values['thal'],
    };

    try {
      const res = await fetch('http://147.182.199.128:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // Map backend cluster id → label
      const clusterLabels: Record<number, string> = {
        0: 'Cluster 0 — Healthy / Low Risk Group',
        1: 'Cluster 1 — Moderate Risk Group',
        2: 'Cluster 2 — Severe Risk Group',
      };

      const riskLevel: 'Low' | 'Medium' | 'High' = data.risk_level;

      const cpLabel = FIELDS.find(f => f.key === 'cp')?.options
        .find(o => o.value === values['cp'])?.label?.split(' — ')[0] ?? 'Unknown';

      const sexLabel = values['sex'] === 0 ? 'Female' : 'Male';

      const newPrediction: Patient = {
        id: 'p_' + Date.now(),
        age: values['age'],
        sex: sexLabel as 'Male' | 'Female',
        chestPainType: cpLabel as any,
        restingBp: values['trestbps'],
        cholesterol: values['chol'],
        fastingBs: values['fbs'] === 1,
        maxHeartRate: values['thalach'],
        exerciseAngina: values['exang'] === 1,
        riskLevel,
        cluster: clusterLabels[data.cluster] ?? `Cluster ${data.cluster}`,
        confidence: {
          knn:               Math.round((data.knn?.confidence ?? 0) * 100),
          logisticRegression: Math.round((data.logistic_regression?.confidence ?? 0) * 100),
          decisionTree:      Math.round((data.decision_tree?.confidence ?? 0) * 100),
        },
      };

      onPredict(newPrediction);
      setResult(newPrediction);
    } catch (err: any) {
      setError(err.message ?? 'Failed to reach prediction server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const confidenceData = result
    ? [
        { name: 'KNN',                 score: result.confidence.knn },
        { name: 'Logistic Regression', score: result.confidence.logisticRegression },
        { name: 'Decision Tree',       score: result.confidence.decisionTree },
      ]
    : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':   return 'text-[#e7000b] bg-[#e7000b]/10 border-[#e7000b] glow-red';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500 glow-yellow';
      default:       return 'text-green-500 bg-green-500/10 border-green-500 glow-green';
    }
  };

  const inputCls =
    'w-full bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#3a81f6] text-sm';

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-8">

      {/* ── Form Card ──────────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 glow-blue">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-6 w-6 text-[#3a81f6]" />
          <h2 className="text-xl font-bold">Predict Diagnostics</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((field) => {
              const isCustom = !!customFlags[field.key];
              const currentVal = values[field.key];

              // Determine which dropdown value to show
              const dropdownValue = isCustom
                ? '__custom__'
                : String(currentVal);

              return (
                <div key={field.key}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-1">
                    {field.label}
                    {field.subtitle && (
                      <span className="ml-1 normal-case font-normal text-[#666]">
                        ({field.subtitle})
                      </span>
                    )}
                  </label>

                  <select
                    value={dropdownValue}
                    onChange={(e) => handleDropdownChange(field.key, e.target.value)}
                    className={inputCls}
                  >
                    {field.options.map((opt, idx) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {idx === 0 ? '✓ ' : idx === field.options.length - 1 ? '✗ ' : '  '}
                        {opt.label}
                      </option>
                    ))}
                    <option value="__custom__">Custom value…</option>
                  </select>

                  {isCustom && (
                    <input
                      type="number"
                      placeholder={`Enter value (${field.min ?? 0}–${field.max ?? 999})`}
                      value={customInputs[field.key] ?? ''}
                      onChange={(e) => handleCustomInput(field.key, e.target.value)}
                      className={`${inputCls} mt-2`}
                      min={field.min}
                      max={field.max}
                      step="any"
                      required
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-sm text-[#e7000b] bg-[#e7000b]/10 border border-[#e7000b]/30 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#3a81f6] hover:bg-[#2563ef] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(58,129,246,0.5)] transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Analyzing…' : 'Analyze Patient'}
          </button>
        </form>
      </div>

      {/* ── Result Card ────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 min-h-[400px]">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result-active"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 flex flex-col justify-between h-full glow-blue"
            >
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle2 className="h-6 w-6 text-[#3a81f6]" />
                  <h2 className="text-xl font-bold">Diagnostic Results</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">
                      Patient Risk Classification
                    </span>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-2">
                      Unsupervised Cohort Assignment
                    </span>
                    <p className="text-white font-medium text-sm md:text-base border border-[#262626] rounded-lg px-4 py-2.5 bg-[#262626]/20">
                      {result.cluster}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-4">
                      Model Confidence Scores (%)
                    </span>
                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={confidenceData}
                          margin={{ left: -10, right: 10, top: 0, bottom: 0 }}
                        >
                          <XAxis type="number" domain={[0, 100]} stroke="#a1a1a1" fontSize={10} />
                          <YAxis dataKey="name" type="category" stroke="#a1a1a1" fontSize={10} width={110} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {confidenceData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 1 ? '#3a81f6' : index === 0 ? '#91c5ff' : '#2563ef'}
                              />
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
                Select patient clinical metrics on the left panel and click 'Analyze Patient' to observe classification metrics.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Predict;
