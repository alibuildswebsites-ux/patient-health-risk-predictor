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
    <div className="relative min-h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col pt-14 overflow-x-hidden">
      {/* Background: perspective grid */}
      <div className="bg-grid pointer-events-none fixed inset-0 z-0" />
      {/* Background: central glow blob */}
      <motion.div
        className="bg-blob pointer-events-none fixed inset-0 z-0"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Background: corner vignette for depth */}
      <div className="bg-vignette pointer-events-none fixed inset-0 z-0" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
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
