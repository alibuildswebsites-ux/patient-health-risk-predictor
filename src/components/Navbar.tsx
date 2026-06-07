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
