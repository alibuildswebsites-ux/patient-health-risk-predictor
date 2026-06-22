import React from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  GitBranch,
  Cpu,
  Layers,
  Server,
  Activity,
  ExternalLink,
} from 'lucide-react';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 18 },
  },
};

// ── Model performance data ────────────────────────────────────────────────

const modelPerformance = [
  { name: 'Random Forest',       accuracy: 86.7, precision: 88.5, recall: 82.1, f1: 85.2 },
  { name: 'KNN',                 accuracy: 85.0, precision: 88.0, recall: 78.6, f1: 83.0 },
  { name: 'Logistic Regression', accuracy: 83.3, precision: 84.6, recall: 78.6, f1: 81.5 },
  { name: 'Decision Tree',       accuracy: 70.0, precision: 69.2, recall: 64.3, f1: 66.7 },
];

const featureRanking = [
  { feature: 'Chest Pain Type (cp)',   importance: '14.2%' },
  { feature: 'Thalassemia (thal)',     importance: '12.2%' },
  { feature: 'Max Heart Rate (thalach)', importance: '12.1%' },
  { feature: 'ST Depression (oldpeak)', importance: '11.5%' },
  { feature: 'Major Vessels (ca)',     importance: '9.8%' },
  { feature: 'Age',                     importance: '9.4%' },
  { feature: 'Cholesterol (chol)',     importance: '8.9%' },
  { feature: 'Resting BP (trestbps)',  importance: '7.5%' },
  { feature: 'ST Slope (slope)',       importance: '5.2%' },
  { feature: 'Exercise Angina (exang)', importance: '3.7%' },
  { feature: 'Sex',                     importance: '2.6%' },
  { feature: 'Resting ECG (restecg)',  importance: '2.0%' },
  { feature: 'Fasting Blood Sugar (fbs)', importance: '1.0%' },
];

const clusterProfiles = [
  {
    id: 'Cluster 0',
    label: 'Healthy / Low Risk',
    color: 'text-green-400',
    dot: 'bg-green-400',
    desc: 'Younger patients with lower cholesterol, higher max heart rate, and minimal exercise-induced angina. ~34% had heart disease.',
    stats: 'Avg age: 54 · Avg HR: 159 bpm · Disease rate: 33.9%',
  },
  {
    id: 'Cluster 1',
    label: 'Moderate / High Risk',
    color: 'text-yellow-400',
    dot: 'bg-yellow-400',
    desc: 'Older patients with asymptomatic chest pain, low max heart rate, and high exercise angina incidence. ~90% had heart disease.',
    stats: 'Avg age: 58 · Avg HR: 131 bpm · Disease rate: 90.3%',
  },
  {
    id: 'Cluster 2',
    label: 'Mild / Low Risk',
    color: 'text-white',
    dot: 'bg-white',
    desc: 'Mixed age range with lower resting blood pressure, fewer major vessels colored, and very low exercise angina. ~18% had heart disease.',
    stats: 'Avg age: 52 · Avg HR: 160 bpm · Disease rate: 17.8%',
  },
];

const sections = [
  { id: 'overview',  icon: Activity,    title: 'Overview' },
  { id: 'data',      icon: Database,    title: 'Data Source' },
  { id: 'pipeline',  icon: GitBranch,   title: 'Pipeline' },
  { id: 'models',    icon: Cpu,         title: 'Models &amp; Performance' },
  { id: 'clusters',  icon: Layers,      title: 'Patient Clusters' },
  { id: 'stack',     icon: Server,      title: 'Tech Stack' },
];

// ── Component ──────────────────────────────────────────────────────────────

export const About: React.FC = () => {
  return (
    <div className="py-6 space-y-8">

      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto pt-6 pb-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#222222] text-xs font-medium text-[#737373] mb-5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          About This Project
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Patient Health Risk Predictor
        </h1>
        <p className="text-sm text-[#737373] leading-relaxed max-w-lg mx-auto">
          A full-stack machine learning application that predicts cardiovascular
          disease risk using an ensemble of four classifiers and unsupervised
          patient segmentation.
        </p>
      </motion.div>

      {/* ── Section TOC ───────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-center gap-1 flex-wrap">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.id}
              href={`#section-${s.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#737373] hover:text-white hover:bg-[#111111] border border-transparent hover:border-[#222222] transition-all duration-200"
            >
              <Icon className="h-3 w-3" strokeWidth={1.5} />
              {s.title}
            </a>
          );
        })}
      </div>

      {/* ── 1. Overview ───────────────────────────────────────────────── */}
      <motion.section
        id="section-overview"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Overview</h2>
        </motion.div>
        <motion.p variants={fadeUp} className="text-sm text-[#a1a1a1] leading-relaxed mb-4">
          This application lets a clinician or researcher enter a patient's clinical
          measurements and receive an instant heart disease risk assessment — powered
          by real machine learning models trained on verified medical data.
        </motion.p>
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: '4', label: 'ML Classifiers' },
            { value: '303', label: 'Training Patients' },
            { value: '13', label: 'Clinical Features' },
            { value: '3', label: 'Patient Clusters' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-3.5 text-center">
              <div className="stat-number text-lg font-bold text-white">{s.value}</div>
              <div className="text-[10px] text-[#525252] font-semibold uppercase tracking-wider mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 2. Data Source ─────────────────────────────────────────────── */}
      <motion.section
        id="section-data"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Database className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Data Source</h2>
        </motion.div>
        <motion.div variants={fadeUp} className="space-y-4">
          <p className="text-sm text-[#a1a1a1] leading-relaxed">
            The model was trained on the{' '}
            <a
              href="https://archive.ics.uci.edu/ml/datasets/heart+disease"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white hover:text-[#a1a1a1] underline underline-offset-2 transition-colors"
            >
              UCI Heart Disease Dataset <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            </a>{' '}
            (Cleveland Clinic subset) — a widely-used benchmark in cardiovascular ML research.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252] mb-2">Preprocessing</h4>
              <ul className="space-y-1.5 text-xs text-[#a1a1a1]">
                <li className="flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                  Missing values (?) replaced with NaN, rows dropped
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                  Target binarized: 0 = no disease, 1+ = disease
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                  Features scaled with StandardScaler (zero mean, unit variance)
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                  Train / test split: 80% / 20% stratified
                </li>
              </ul>
            </div>
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252] mb-2">13 Clinical Features</h4>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#a1a1a1]">
                {['Age', 'Sex', 'Chest Pain Type', 'Resting BP', 'Cholesterol', 'Fasting BS', 'Resting ECG', 'Max HR', 'Exercise Angina', 'ST Depression', 'ST Slope', 'Major Vessels', 'Thalassemia'].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white/20 flex-shrink-0" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── 3. Pipeline ──────────────────────────────────────────────── */}
      <motion.section
        id="section-pipeline"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <GitBranch className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Pipeline</h2>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch gap-2">
          {[
            { step: '1', label: 'Raw Data', desc: 'heart.csv (UCI)' },
            { step: '2', label: 'Preprocessing', desc: 'StandardScaler + train/test split' },
            { step: '3', label: 'Supervised Training', desc: '4 classifiers trained on 80% split' },
            { step: '4', label: 'Unsupervised', desc: 'K-Means on full dataset' },
            { step: '5', label: 'FastAPI Backend', desc: 'REST API serving predictions' },
            { step: '6', label: 'React Frontend', desc: 'UI consuming the API' },
          ].map((s, i) => (
            <div key={s.step} className="flex-1 bg-[#111111] border border-[#1e1e1e] rounded-lg p-3.5 text-center relative">
              <div className="stat-number text-xs font-bold text-white mb-1">{s.step}</div>
              <div className="text-xs font-semibold text-white mb-0.5">{s.label}</div>
              <div className="text-[10px] text-[#525252]">{s.desc}</div>
              {i < 5 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-[#3a3a3a] text-sm">→</div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 4. Models & Performance ──────────────────────────────────── */}
      <motion.section
        id="section-models"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Cpu className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Models &amp; Performance</h2>
        </motion.div>

        {/* Table (desktop) */}
        <motion.div variants={fadeUp} className="hidden sm:block overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score'].map((h) => (
                  <th key={h} className="pb-2.5 pr-5 text-[10px] font-semibold uppercase tracking-wider text-[#525252]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {modelPerformance.map((m) => (
                <tr key={m.name} className="hover:bg-[#111111] transition-colors">
                  <td className="py-2.5 pr-5 text-sm font-medium text-white">{m.name}</td>
                  <td className="py-2.5 pr-5 stat-number text-sm text-[#a1a1a1]">{m.accuracy}%</td>
                  <td className="py-2.5 pr-5 stat-number text-sm text-[#a1a1a1]">{m.precision}%</td>
                  <td className="py-2.5 pr-5 stat-number text-sm text-[#a1a1a1]">{m.recall}%</td>
                  <td className="py-2.5 stat-number text-sm text-[#a1a1a1]">{m.f1}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Table (mobile cards) */}
        <motion.div variants={fadeUp} className="sm:hidden space-y-3 mb-6">
          {modelPerformance.map((m) => (
            <div key={m.name} className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-3.5">
              <div className="text-sm font-semibold text-white mb-2">{m.name}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Accuracy', val: `${m.accuracy}%` },
                  { label: 'Precision', val: `${m.precision}%` },
                  { label: 'Recall', val: `${m.recall}%` },
                  { label: 'F1', val: `${m.f1}%` },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="text-[#525252]">{s.label}</span>
                    <div className="stat-number text-[#a1a1a1]">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Feature importance */}
        <motion.div variants={fadeUp}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252] mb-3">Feature Importance (Random Forest)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {featureRanking.map((f) => (
              <div key={f.feature} className="flex items-center gap-3 bg-[#111111] border border-[#1e1e1e] rounded-lg px-3.5 py-2.5">
                <div className="flex-1 text-xs text-[#a1a1a1]">{f.feature}</div>
                <div className="stat-number text-xs text-white font-semibold">{f.importance}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ensemble logic */}
        <motion.div variants={fadeUp} className="mt-5 bg-[#111111] border border-[#1e1e1e] rounded-lg p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252] mb-2">Risk Level Logic</h4>
          <p className="text-xs text-[#a1a1a1] leading-relaxed">
            All four models vote independently. If 2+ models predict disease and
            Random Forest confidence exceeds 70%, the patient is classified as{' '}
            <span className="text-white">High Risk</span>. If 2+ vote positive
            but RF confidence is below 70%, it's{' '}
            <span className="text-white">Medium Risk</span>. Otherwise,{' '}
            <span className="text-white">Low Risk</span>. Random Forest acts as
            tiebreaker since it achieves the highest accuracy (86.7%).
          </p>
        </motion.div>
      </motion.section>

      {/* ── 5. Patient Clusters ───────────────────────────────────────── */}
      <motion.section
        id="section-clusters"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Layers className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Patient Clusters</h2>
        </motion.div>
        <motion.p variants={fadeUp} className="text-sm text-[#a1a1a1] leading-relaxed mb-5">
          K-Means clustering (unsupervised, k=3) on the 13 clinical features revealed
          three natural patient cohorts. These groupings weren't told about disease labels —
          they emerged purely from measurement similarities.
        </motion.p>
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clusterProfiles.map((c) => (
            <div
              key={c.id}
              className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-0.5 ${c.dot}`} />
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                <span className={`text-xs font-semibold ${c.color}`}>{c.label}</span>
              </div>
              <p className="text-xs text-[#a1a1a1] leading-relaxed mb-3">{c.desc}</p>
              <div className="text-[10px] text-[#525252] font-mono">{c.stats}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 6. Tech Stack ─────────────────────────────────────────────── */}
      <motion.section
        id="section-stack"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-6 sm:p-8"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Server className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Tech Stack</h2>
        </motion.div>
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Frontend',
              items: [
                'React 18 with TypeScript',
                'Vite 5 (build tool & dev server)',
                'Tailwind CSS 3 (utility-first styling)',
                'Framer Motion 11 (page transitions & micro-animations)',
                'Recharts 2 (interactive charts)',
                'Lucide React (SVG icon library)',
              ],
            },
            {
              title: 'Backend',
              items: [
                'FastAPI (Python async REST framework)',
                'scikit-learn 1.4 (ML classifiers & clustering)',
                'Pandas / NumPy (data processing)',
                'Joblib (model serialization)',
                'Uvicorn (ASGI server)',
              ],
            },
            {
              title: 'Infrastructure',
              items: [
                'systemd services (persistent process management)',
                'Vercel (frontend hosting)',
                'Ubuntu 24.04 server',
                'GitHub (source control)',
              ],
            },
            {
              title: 'ML Models',
              items: [
                'K-Nearest Neighbors (KNN)',
                'Logistic Regression',
                'Decision Tree Classifier',
                'Random Forest (100 estimators)',
                'K-Means Clustering (k=3)',
                'StandardScaler (feature normalization)',
              ],
            },
          ].map((group) => (
            <div key={group.title} className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#525252] mb-2.5">
                {group.title}
              </h4>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#a1a1a1]">
                    <span className="h-1 w-1 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center pt-2 pb-8"
      >
        <p className="text-xs text-[#525252]">
          Built with Python, React, and scikit-learn. Dataset sourced from the{' '}
          <a
            href="https://archive.ics.uci.edu/ml/datasets/heart+disease"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#a1a1a1] underline underline-offset-2 transition-colors"
          >
            UCI Machine Learning Repository
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default About;
