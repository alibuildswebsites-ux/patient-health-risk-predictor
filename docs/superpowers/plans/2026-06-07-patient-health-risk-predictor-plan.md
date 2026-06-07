# Patient Health Risk Predictor & Segmentation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stunning, dark-mode-only frontend for a Patient Health Risk Predictor & Segmentation System using React, TypeScript, Tailwind CSS, Framer Motion, and Recharts.

**Architecture:** A fast Single-Page Application (SPA) driven by a single top-level React state (patient registry) to support interactive real-time dashboard updates when a new patient risk prediction is computed. Pages will transition smoothly with Framer Motion slide/fade gestures.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React (icons).

---

### Task 1: Scaffolding and Dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Write `package.json` file**

Write the following dependencies:
```json
{
  "name": "patient-health-risk-predictor",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.0.8",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}
```

- [ ] **Step 2: Write configuration files**

Write `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

Write `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
      },
      borderRadius: {
        lg: 'var(--radius)',
      }
    },
  },
  plugins: [],
}
```

Write `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Write `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Write `index.html`:
```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HealthAI - Patient Health Risk Predictor</title>
  </head>
  <body class="bg-[#0a0a0a] text-[#fafafa] antialiased min-h-screen overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Run npm install**

Run: `npm install`
Expected: Installs packages successfully.

- [ ] **Step 4: Commit scaffolding**

Run: `git add package.json tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html && git commit -m "chore: scaffold vite + tailwind + typescript project"`

---

### Task 2: Styling and Mock Data

**Files:**
- Create: `src/index.css`
- Create: `src/data/mockData.ts`

- [ ] **Step 1: Write `src/index.css`**

Add style configurations and base theme variables:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --card: #0a0a0a;
  --ring: #525252;
  --input: #262626;
  --muted: #262626;
  --accent: #262626;
  --border: #262626;
  --radius: 0.625rem;
  --chart-1: #91c5ff;
  --chart-2: #3a81f6;
  --chart-3: #2563ef;
  --chart-4: #1a4eda;
  --chart-5: #1f3fad;
  --popover: #0a0a0a;
  --primary: #fafafa;
  --sidebar: #0a0a0a;
  --secondary: #262626;
  --background: #0a0a0a;
  --foreground: #fafafa;
  --destructive: #e7000b;
  --card-foreground: #fafafa;
  --muted-foreground: #a1a1a1;
  --accent-foreground: #fafafa;
  --primary-foreground: #0a0a0a;
  --secondary-foreground: #fafafa;
  --destructive-foreground: #ffffff;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  --spacing: 0.25rem;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}

/* Custom glow effects */
.glow-blue {
  box-shadow: 0 0 15px -3px rgba(58, 129, 246, 0.4);
}

.glow-red {
  box-shadow: 0 0 15px -3px rgba(231, 0, 11, 0.4);
}

.glow-yellow {
  box-shadow: 0 0 15px -3px rgba(234, 179, 8, 0.4);
}

.glow-green {
  box-shadow: 0 0 15px -3px rgba(34, 197, 94, 0.4);
}

.glow-border:hover {
  border-color: #3a81f6;
  box-shadow: 0 0 10px -2px rgba(58, 129, 246, 0.2);
}
```

- [ ] **Step 2: Write `src/data/mockData.ts`**

Define static data structure and mock cohort:
```typescript
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
```

- [ ] **Step 3: Commit styles and mock data**

Run: `git add src/index.css src/data/mockData.ts && git commit -m "feat: add index css styles and mock data models"`

---

### Task 3: Root Layout, Animated Background & Navigation

**Files:**
- Create: `src/main.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Write `src/main.tsx`**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 2: Create `src/components/Navbar.tsx`**

Implement fixed header navigation using Framer Motion layout transitions:
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'predict', label: 'Predict' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="relative">
            <Activity className="h-6 w-6 text-[#3a81f6]" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#3a81f6] animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-wider text-white">HealthAI</span>
        </div>

        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id ? 'text-white' : 'text-[#a1a1a1] hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3a81f6]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
```

- [ ] **Step 3: Create `src/App.tsx`**

Integrate global patient registry state, the animated breathing radial gradient background, page selector, and state sharing:
```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Predict from './components/Predict';
import Dashboard from './components/Dashboard';
import { initialPatients, Patient } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col pt-16 selection:bg-[#3a81f6]/30">
      {/* Animated breathing background */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(58,129,246,0.12),transparent_60%)]"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(26,26,26,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" {...pageTransition}>
              <Home setActiveTab={setActiveTab} patientsCount={patients.length} />
            </motion.div>
          )}

          {activeTab === 'predict' && (
            <motion.div key="predict" {...pageTransition}>
              <Predict onPredict={addPatient} />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransition}>
              <Dashboard patients={patients} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Commit Navbar and Root App Setup**

Run: `git add src/main.tsx src/components/Navbar.tsx src/App.tsx && git commit -m "feat: implement main.tsx, navbar, and core App container with breathing background"`

---

### Task 4: Home / Hero Component

**Files:**
- Create: `src/components/Home.tsx`

- [ ] **Step 1: Write `src/components/Home.tsx`**

Write the Home Hero view with animated word overlays, CTA hover states, and staggering mount cards:
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, BarChart3, ArrowRight } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  patientsCount: number;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, patientsCount }) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center pt-8">
      {/* Title */}
      <div className="relative mb-6">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Patient Health{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#3a81f6] to-[#91c5ff]">
            Risk Predictor
            <motion.span 
              className="absolute bottom-1 left-0 w-full h-[3px] bg-[#3a81f6]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
            />
          </span>
        </motion.h1>
      </div>

      {/* Subheading */}
      <motion.p 
        className="text-base md:text-lg text-[#a1a1a1] max-w-2xl mb-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Supercharged cardiovascular diagnostic assessment leveraging supervised classification model ensembles (KNN, Logistic Regression, Decision Trees) and unsupervised K-Means patient cohort segmentation.
      </motion.p>

      {/* CTAs */}
      <motion.div 
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={() => setActiveTab('predict')}
          className="px-8 py-3 rounded-lg bg-[#3a81f6] hover:bg-[#2563ef] text-white font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(58,129,246,0.5)] transform hover:scale-[1.02]"
        >
          <span>Predict Risk</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-8 py-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-[#fafafa] font-medium transition-all duration-300 glow-border hover:scale-[1.02]"
        >
          View Dashboard
        </button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        <motion.div 
          variants={cardVariants}
          className="bg-[#0a0a0a] border border-[#262626] border-t-2 border-t-[#3a81f6] p-6 rounded-lg flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform duration-300"
        >
          <Activity className="h-8 w-8 text-[#3a81f6] mb-4" />
          <span className="text-3xl font-extrabold text-white mb-2">{patientsCount}</span>
          <span className="text-xs uppercase tracking-wider text-[#a1a1a1] font-semibold">Patients Cohort</span>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-[#0a0a0a] border border-[#262626] border-t-2 border-t-[#3a81f6] p-6 rounded-lg flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform duration-300"
        >
          <BrainCircuit className="h-8 w-8 text-[#3a81f6] mb-4" />
          <span className="text-3xl font-extrabold text-white mb-2">3 ML Models</span>
          <span className="text-xs uppercase tracking-wider text-[#a1a1a1] font-semibold">KNN / LR / Decision Tree</span>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-[#0a0a0a] border border-[#262626] border-t-2 border-t-[#3a81f6] p-6 rounded-lg flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform duration-300"
        >
          <BarChart3 className="h-8 w-8 text-[#3a81f6] mb-4" />
          <span className="text-3xl font-extrabold text-white mb-2">3 Risk Clusters</span>
          <span className="text-xs uppercase tracking-wider text-[#a1a1a1] font-semibold">K-Means Segmented</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Home;
```

- [ ] **Step 2: Commit Home Component**

Run: `git add src/components/Home.tsx && git commit -m "feat: build Home hero component with staggered statistics"`

---

### Task 5: Predict Form & Result Visualizer

**Files:**
- Create: `src/components/Predict.tsx`

- [ ] **Step 1: Write `src/components/Predict.tsx`**

Construct the form controls, diagnostic logic, spring-animated result box, and Recharts confidence bar chart:
```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, BarChart, CheckCircle2 } from 'lucide-react';
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
```

- [ ] **Step 2: Commit Predict Component**

Run: `git add src/components/Predict.tsx && git commit -m "feat: design patient Predict diagnostic panel with Recharts confidence bars"`

---

### Task 6: Dashboard Component with Grouped, Donut, and Area Visualizations

**Files:**
- Create: `src/components/Dashboard.tsx`

- [ ] **Step 1: Write `src/components/Dashboard.tsx`**

Integrate the dashboard views with dynamic metric selectors, comparative charts, horizontal feature ranks, donut segmentation profiles, and area distributions:
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { Patient, modelMetrics, featureImportance } from '../data/mockData';

interface DashboardProps {
  patients: Patient[];
}

export const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  // Compute metric numbers based on active patient registry state
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.riskLevel === 'High').count ?? patients.filter(p => p.riskLevel === 'High').length;
  const bestModelAccuracy = 91; // Logistic Regression static best
  
  // Cluster distribution counts
  const clusterCounts: Record<string, number> = {
    'Cluster 0': 0,
    'Cluster 1': 0,
    'Cluster 2': 0
  };

  patients.forEach(p => {
    if (p.cluster.includes('Cluster 0')) clusterCounts['Cluster 0']++;
    else if (p.cluster.includes('Cluster 1')) clusterCounts['Cluster 1']++;
    else if (p.cluster.includes('Cluster 2')) clusterCounts['Cluster 2']++;
  });

  const clusterData = [
    { name: 'Cluster 0 (Low Risk)', value: clusterCounts['Cluster 0'] },
    { name: 'Cluster 1 (Moderate Risk)', value: clusterCounts['Cluster 1'] },
    { name: 'Cluster 2 (Severe Risk)', value: clusterCounts['Cluster 2'] }
  ];

  // Distribution curve data (simulated distribution across scores)
  const scoreDistribution = [
    { name: 'Min Risk', Low: 25, Medium: 0, High: 0 },
    { name: 'Mild', Low: 40, Medium: 10, High: 0 },
    { name: 'Moderate', Low: 15, Medium: 45, High: 5 },
    { name: 'Elevated', Low: 2, Medium: 30, High: 35 },
    { name: 'Severe', Low: 0, Medium: 5, High: 50 }
  ];

  const pieColors = ['#91c5ff', '#2563ef', '#1f3fad'];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="space-y-8 py-8">
      {/* Top Summary Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={cardVariants} className="bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg flex items-center justify-between glow-blue">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-1">Total Patients</span>
            <span className="text-2xl font-black text-white">{totalPatients}</span>
          </div>
          <Users className="h-8 w-8 text-[#3a81f6]" />
        </motion.div>

        <motion.div variants={cardVariants} className="bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg flex items-center justify-between glow-blue">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-1">High Risk Count</span>
            <span className="text-2xl font-black text-[#e7000b]">{highRiskCount}</span>
          </div>
          <AlertTriangle className="h-8 w-8 text-[#e7000b]" />
        </motion.div>

        <motion.div variants={cardVariants} className="bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg flex items-center justify-between glow-blue">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-1">Best Accuracy</span>
            <span className="text-2xl font-black text-white">{bestModelAccuracy}%</span>
          </div>
          <TrendingUp className="h-8 w-8 text-[#91c5ff]" />
        </motion.div>

        <motion.div variants={cardVariants} className="bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg flex items-center justify-between glow-blue">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#a1a1a1] mb-1">Active Clusters</span>
            <span className="text-2xl font-black text-white">3 Groups</span>
          </div>
          <Cpu className="h-8 w-8 text-[#2563ef]" />
        </motion.div>
      </motion.div>

      {/* Primary Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model Comparison */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Model Comparison Accuracy & Metrics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={modelMetrics} margin={{ left: -10 }}>
                <XAxis dataKey="name" stroke="#a1a1a1" fontSize={11} />
                <YAxis stroke="#a1a1a1" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fafafa' }} />
                <Legend wrapperStyle={{ fontSize: 11, pt: 10 }} />
                <Bar dataKey="Accuracy" fill="#91c5ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Precision" fill="#3a81f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall" fill="#2563ef" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cluster Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Cohort Cluster Distribution</h3>
          <div className="h-80 w-full flex flex-col items-center justify-center">
            {totalPatients > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clusterData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clusterData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fafafa' }} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-[#a1a1a1] text-sm text-center">No cohort data available yet.</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Diagnostic Feature Ranks</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart layout="vertical" data={featureImportance} margin={{ left: 15, right: 10 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#a1a1a1" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#a1a1a1" fontSize={11} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fafafa' }} />
                <Bar dataKey="importance" fill="#3a81f6" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Patient Risk Area Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 bg-[#0a0a0a] border border-[#262626] p-6 rounded-lg"
        >
          <h3 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Patient Risk Cohort Curves</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreDistribution} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#91c5ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#91c5ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563ef" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563ef" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f3fad" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1f3fad" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1a1" fontSize={11} />
                <YAxis stroke="#a1a1a1" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fafafa' }} />
                <Legend wrapperStyle={{ fontSize: 11, pt: 10 }} />
                <Area type="monotone" dataKey="Low" stroke="#91c5ff" fillOpacity={1} fill="url(#colorLow)" />
                <Area type="monotone" dataKey="Medium" stroke="#2563ef" fillOpacity={1} fill="url(#colorMedium)" />
                <Area type="monotone" dataKey="High" stroke="#1f3fad" fillOpacity={1} fill="url(#colorHigh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Dashboard;
```

- [ ] **Step 2: Commit Dashboard Component**

Run: `git add src/components/Dashboard.tsx && git commit -m "feat: design Dashboard panel using Recharts grouped bars, donut, and risk curves"`

---

### Task 7: Build Verification

- [ ] **Step 1: Build production target**

Run: `npm run build`
Expected: Production build compiles without TypeScript or compiler failures.
