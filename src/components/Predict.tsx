import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';
import { Patient } from '../data/mockData';

interface PredictProps {
  onPredict: (newPatient: Patient) => void;
}

// ── Field definitions ──────────────────────────────────────────────────────────

interface FieldOption { label: string; value: number; }
interface SelectField {
  key: string;
  label: string;
  subtitle?: string;
  options: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
}

const FIELDS: SelectField[] = [
  {
    key: 'age', label: 'Age',
    options: [
      { label: '29 — Young Adult',  value: 29 },
      { label: '45 — Middle-aged',  value: 45 },
      { label: '55 — Senior',       value: 55 },
      { label: '71 — Elderly',      value: 71 },
    ], min: 1, max: 120,
  },
  {
    key: 'sex', label: 'Sex',
    options: [
      { label: 'Female', value: 0 },
      { label: 'Male',   value: 1 },
    ],
  },
  {
    key: 'cp', label: 'Chest Pain Type',
    options: [
      { label: 'Typical Angina',   value: 1 },
      { label: 'Atypical Angina',  value: 2 },
      { label: 'Non-Anginal Pain', value: 3 },
      { label: 'Asymptomatic',     value: 0 },
    ],
  },
  {
    key: 'trestbps', label: 'Resting Blood Pressure', subtitle: 'mmHg',
    options: [
      { label: '110 — Normal',    value: 110 },
      { label: '130 — Elevated',  value: 130 },
      { label: '150 — High',      value: 150 },
      { label: '180 — Very High', value: 180 },
    ], min: 80, max: 220,
  },
  {
    key: 'chol', label: 'Serum Cholesterol', subtitle: 'mg/dl',
    options: [
      { label: '180 — Normal',     value: 180 },
      { label: '220 — Borderline', value: 220 },
      { label: '260 — High',       value: 260 },
      { label: '320 — Very High',  value: 320 },
    ], min: 100, max: 600,
  },
  {
    key: 'fbs', label: 'Fasting Blood Sugar', subtitle: '> 120 mg/dl',
    options: [
      { label: 'No — Normal',   value: 0 },
      { label: 'Yes — Elevated', value: 1 },
    ],
  },
  {
    key: 'restecg', label: 'Resting ECG Results',
    options: [
      { label: 'Normal',                       value: 0 },
      { label: 'ST-T Wave Abnormality',        value: 1 },
      { label: 'LV Hypertrophy',               value: 2 },
    ],
  },
  {
    key: 'thalach', label: 'Max Heart Rate', subtitle: 'bpm',
    options: [
      { label: '175 — High Capacity',  value: 175 },
      { label: '150 — Moderate',       value: 150 },
      { label: '130 — Below Average',  value: 130 },
      { label: '100 — Low',            value: 100 },
    ], min: 50, max: 250,
  },
  {
    key: 'exang', label: 'Exercise Angina', subtitle: 'chest pain on exertion',
    options: [
      { label: 'No',  value: 0 },
      { label: 'Yes', value: 1 },
    ],
  },
  {
    key: 'oldpeak', label: 'ST Depression', subtitle: 'oldpeak',
    options: [
      { label: '0.0 — None',     value: 0.0 },
      { label: '1.0 — Mild',     value: 1.0 },
      { label: '2.5 — Moderate', value: 2.5 },
      { label: '4.5 — Severe',   value: 4.5 },
    ], min: 0, max: 10, step: 0.1,
  },
  {
    key: 'slope', label: 'ST Segment Slope',
    options: [
      { label: 'Upsloping — Healthy',   value: 0 },
      { label: 'Flat — Borderline',     value: 1 },
      { label: 'Downsloping — Abnormal', value: 2 },
    ],
  },
  {
    key: 'ca', label: 'Major Vessels', subtitle: 'fluoroscopy colored',
    options: [
      { label: '0 — None',  value: 0 },
      { label: '1 Vessel',  value: 1 },
      { label: '2 Vessels', value: 2 },
      { label: '3 Vessels', value: 3 },
    ],
  },
  {
    key: 'thal', label: 'Thalassemia',
    options: [
      { label: 'Normal',            value: 1 },
      { label: 'Fixed Defect',      value: 2 },
      { label: 'Reversible Defect', value: 3 },
    ],
  },
];

// ── State helpers ──────────────────────────────────────────────────────────────

type FormValues  = Record<string, number>;
type CustomFlags = Record<string, boolean>;
type CustomInputs = Record<string, string>;

function buildInitialValues(): FormValues {
  const v: FormValues = {};
  for (const f of FIELDS) v[f.key] = f.options[0].value;
  return v;
}

// ── Custom tooltip for confidence chart ────────────────────────────────────────

const ConfidenceTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-[#737373] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white font-mono">{payload[0].value}%</p>
    </div>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

export const Predict: React.FC<PredictProps> = ({ onPredict }) => {
  const [values,       setValues]       = useState<FormValues>(buildInitialValues);
  const [customFlags,  setCustomFlags]  = useState<CustomFlags>({});
  const [customInputs, setCustomInputs] = useState<CustomInputs>({});
  const [result,       setResult]       = useState<Patient | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDropdownChange = (key: string, raw: string) => {
    if (raw === '__custom__') {
      setCustomFlags(p => ({ ...p, [key]: true }));
    } else {
      setCustomFlags(p => ({ ...p, [key]: false }));
      setValues(p => ({ ...p, [key]: Number(raw) }));
    }
  };

  const handleCustomInput = (key: string, raw: string) => {
    setCustomInputs(p => ({ ...p, [key]: raw }));
    const n = parseFloat(raw);
    if (!isNaN(n)) setValues(p => ({ ...p, [key]: n }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      age: values.age, sex: values.sex, cp: values.cp,
      trestbps: values.trestbps, chol: values.chol, fbs: values.fbs,
      restecg: values.restecg, thalach: values.thalach, exang: values.exang,
      oldpeak: values.oldpeak, slope: values.slope, ca: values.ca, thal: values.thal,
    };

    try {
      const res = await fetch('http://147.182.199.128:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      const clusterLabels: Record<number, string> = {
        0: 'Cluster 0 — Healthy / Low Risk Group',
        1: 'Cluster 1 — Moderate Risk Group',
        2: 'Cluster 2 — Severe Risk Group',
      };
      const riskLevel: 'Low' | 'Medium' | 'High' = data.risk_level;
      const cpLabel = FIELDS.find(f => f.key === 'cp')?.options.find(o => o.value === values.cp)?.label?.split(' — ')[0] ?? 'Unknown';
      const sexLabel = values.sex === 0 ? 'Female' : 'Male';

      const newPrediction: Patient = {
        id: 'p_' + Date.now(),
        age: values.age,
        sex: sexLabel as 'Male' | 'Female',
        chestPainType: cpLabel as any,
        restingBp: values.trestbps,
        cholesterol: values.chol,
        fastingBs: values.fbs === 1,
        maxHeartRate: values.thalach,
        exerciseAngina: values.exang === 1,
        riskLevel,
        cluster: clusterLabels[data.cluster] ?? `Cluster ${data.cluster}`,
        confidence: {
          knn:                Math.round((data.knn?.confidence ?? 0) * 100),
          logisticRegression: Math.round((data.logistic_regression?.confidence ?? 0) * 100),
          decisionTree:       Math.round((data.decision_tree?.confidence ?? 0) * 100),
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

  // ── Derived ───────────────────────────────────────────────────────────────

  const confidenceData = result
    ? [
        { name: 'KNN',        score: result.confidence.knn },
        { name: 'Logistic R', score: result.confidence.logisticRegression },
        { name: 'Dec. Tree',  score: result.confidence.decisionTree },
      ]
    : [];

  const barColors = ['#ffffff', '#a1a1a1', '#525252'];

  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'High':   return { pill: 'text-[#e7000b] bg-[#e7000b]/10 border-[#e7000b]/30', card: 'glow-red' };
      case 'Medium': return { pill: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', card: 'glow-yellow' };
      default:       return { pill: 'text-green-400 bg-green-400/10 border-green-400/30', card: 'glow-green' };
    }
  };

  const inputCls = 'input-field cursor-pointer';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">

      {/* ── Form Card ───────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Predict Diagnostics</h2>
            <p className="text-xs text-[#525252]">Select patient values — first option is healthy, last is high-risk</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            {FIELDS.map((field) => {
              const isCustom = !!customFlags[field.key];
              const dropdownValue = isCustom ? '__custom__' : String(values[field.key]);

              return (
                <div key={field.key}>
                  <label className="field-label" htmlFor={`field-${field.key}`}>
                    {field.label}
                    {field.subtitle && (
                      <span className="ml-1 normal-case font-normal text-[#3a3a3a]">({field.subtitle})</span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      id={`field-${field.key}`}
                      value={dropdownValue}
                      onChange={(e) => handleDropdownChange(field.key, e.target.value)}
                      className={`${inputCls} pr-8`}
                    >
                      {field.options.map((opt, idx) => (
                        <option key={opt.value} value={String(opt.value)}>
                          {idx === 0 ? '✓ ' : idx === field.options.length - 1 ? '✗ ' : '  '}
                          {opt.label}
                        </option>
                      ))}
                      <option value="__custom__">Custom value…</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#525252]" />
                  </div>
                  {isCustom && (
                    <input
                      type="number"
                      placeholder={`Enter value${field.min !== undefined ? ` (${field.min}–${field.max})` : ''}`}
                      value={customInputs[field.key] ?? ''}
                      onChange={(e) => handleCustomInput(field.key, e.target.value)}
                      className="input-field mt-2"
                      min={field.min}
                      max={field.max}
                      step={field.step ?? 1}
                      required
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-[#e7000b]/8 border border-[#e7000b]/20 rounded-lg px-4 py-3">
              <ShieldAlert className="h-4 w-4 text-[#e7000b] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm text-[#e7000b]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-[#e5e5e5] text-black font-semibold text-sm rounded-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Analyzing…' : 'Analyze Patient'}
          </button>
        </form>
      </div>

      {/* ── Result Card ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          {result ? (() => {
            const rStyle = getRiskStyle(result.riskLevel);
            return (
              <motion.div
                key="result-active"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className={`bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6 h-full ${rStyle.card}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">Diagnostic Results</h2>
                    <p className="text-xs text-[#525252]">ML ensemble output</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Risk Level */}
                  <div>
                    <span className="field-label">Risk Classification</span>
                    <span className={`badge text-sm ${rStyle.pill}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  {/* Cluster */}
                  <div>
                    <span className="field-label">Cohort Assignment</span>
                    <div className="bg-[#111111] border border-[#1e1e1e] rounded-lg px-4 py-2.5">
                      <p className="text-white text-sm font-medium">{result.cluster}</p>
                    </div>
                  </div>

                  {/* Confidence chart */}
                  <div>
                    <span className="field-label mb-3 block">Model Confidence</span>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={confidenceData}
                          margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
                        >
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            tick={{ fill: '#525252', fontSize: 10, fontFamily: 'Geist Mono, monospace' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'Geist, sans-serif' }}
                            tickLine={false}
                            axisLine={false}
                            width={70}
                          />
                          <Tooltip content={<ConfidenceTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                          <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={20}>
                            {confidenceData.map((_, idx) => (
                              <Cell key={`c-${idx}`} fill={barColors[idx]} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {confidenceData.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: barColors[idx] }} />
                          <span className="text-xs text-[#737373]">{d.name}</span>
                          <span className="text-xs font-mono text-[#a1a1a1]">{d.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })() : (
            <motion.div
              key="result-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0f0f0f] border border-[#1e1e1e] border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[340px] lg:min-h-full"
            >
              <div className="h-12 w-12 rounded-full bg-[#1a1a1a] border border-[#222222] flex items-center justify-center mb-4">
                <ShieldAlert className="h-5 w-5 text-[#525252]" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">No Analysis Run</h3>
              <p className="text-xs text-[#525252] max-w-[220px] leading-relaxed">
                Configure patient metrics and click Analyze Patient to see the ML prediction.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Predict;
