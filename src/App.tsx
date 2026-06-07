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
