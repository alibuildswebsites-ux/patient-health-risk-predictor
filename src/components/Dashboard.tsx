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
  const highRiskCount = patients.filter(p => p.riskLevel === 'High').length;
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
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
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
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
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
