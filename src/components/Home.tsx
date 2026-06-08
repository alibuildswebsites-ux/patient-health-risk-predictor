import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, BarChart3, ArrowRight, Shield, Zap } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  patientsCount: number;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

const stats = [
  {
    icon: Activity,
    value: null, // dynamic
    label: 'Patients Cohort',
    sub: 'UCI Heart Disease Dataset',
    color: 'text-[#3a81f6]',
  },
  {
    icon: BrainCircuit,
    value: '4 ML',
    label: 'Classifier Models',
    sub: 'KNN · LR · DT · Random Forest',
    color: 'text-[#3a81f6]',
  },
  {
    icon: BarChart3,
    value: '3',
    label: 'Risk Clusters',
    sub: 'K-Means Segmentation',
    color: 'text-[#3a81f6]',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Ensemble Prediction',
    desc: 'Four independent classifiers vote together. Majority rules, Random Forest breaks ties.',
  },
  {
    icon: Shield,
    title: 'Risk Stratification',
    desc: 'Patients are scored Low, Medium, or High risk with per-model confidence percentages.',
  },
  {
    icon: BrainCircuit,
    title: 'Patient Clustering',
    desc: 'K-Means groups patients into three natural cohorts independent of disease labels.',
  },
];

export const Home: React.FC<HomeProps> = ({ setActiveTab, patientsCount }) => {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-3.5rem)] py-10 px-2">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#222222] text-xs font-medium text-[#737373] mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#3a81f6] animate-pulse" />
          ML-Powered Cardiovascular Risk Assessment
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Patient Health{' '}
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a81f6] to-[#91c5ff]">
              Risk Predictor
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#3a81f6] to-[#91c5ff] rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-[#737373] max-w-xl leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter clinical measurements and get an instant heart disease risk assessment powered by four trained ML classifiers and unsupervised patient cohort segmentation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button
            onClick={() => setActiveTab('predict')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#3a81f6] hover:bg-[#2563ef] text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Run Prediction
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-transparent border border-[#262626] text-[#a1a1a1] hover:text-white hover:border-[#3a3a3a] font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            View Dashboard
          </button>
        </motion.div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full mt-14"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          const displayValue = s.value ?? patientsCount;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative overflow-hidden bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2a2a2a] transition-colors duration-200 cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a81f6]/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <Icon className={`h-5 w-5 ${s.color} mb-3`} strokeWidth={1.5} />
              <div className="stat-number text-2xl font-bold text-white mb-0.5">{displayValue}</div>
              <div className="text-sm font-medium text-[#a1a1a1]">{s.label}</div>
              <div className="text-xs text-[#525252] mt-0.5">{s.sub}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Feature list ──────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full mt-4"
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-[#3a81f6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-white">{f.title}</span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
};

export default Home;
