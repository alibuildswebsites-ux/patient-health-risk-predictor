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