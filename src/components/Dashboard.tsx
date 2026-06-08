import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Cpu, Activity } from 'lucide-react';
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
  Legend,
  CartesianGrid,
} from 'recharts';
import { Patient, modelMetrics, featureImportance } from '../data/mockData';

interface DashboardProps { patients: Patient[]; }

// ── Custom Tooltips ────────────────────────────────────────────────────────────

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg px-3.5 py-3 shadow-xl min-w-[120px]">
      {label && <p className="text-[10px] text-[#737373] uppercase tracking-wider mb-2">{label}</p>}
      {payload.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-[#a1a1a1]">{item.name}</span>
          <span className="text-xs font-mono text-white ml-auto pl-4">
            {typeof item.value === 'number' && item.value <= 100 ? `${item.value}%` : item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[#a1a1a1]">{payload[0].name}</p>
      <p className="text-sm font-mono text-white">{payload[0].value} patients</p>
    </div>
  );
};

// ── Shared tick style ──────────────────────────────────────────────────────────
const tickStyle = { fill: '#525252', fontSize: 10, fontFamily: 'Geist Mono, monospace' };

// ── Stagger variants ───────────────────────────────────────────────────────────
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } },
};

// ── Risk badge helper ──────────────────────────────────────────────────────────
const riskMeta: Record<string, { dot: string; pill: string }> = {
  Low:    { dot: 'bg-green-400',  pill: 'text-green-400  bg-green-400/10  border-green-400/25' },
  Medium: { dot: 'bg-yellow-400', pill: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  High:   { dot: 'bg-[#e7000b]',  pill: 'text-[#e7000b]  bg-[#e7000b]/10  border-[#e7000b]/25' },
};

// ── Component ──────────────────────────────────────────────────────────────────

export const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  const totalPatients   = patients.length;
  const highRiskCount   = patients.filter(p => p.riskLevel === 'High').length;
  const bestAccuracy    = 86.7;

  const clusterCounts = { 'Cluster 0': 0, 'Cluster 1': 0, 'Cluster 2': 0 };
  patients.forEach(p => {
    if (p.cluster.includes('Cluster 0')) clusterCounts['Cluster 0']++;
    else if (p.cluster.includes('Cluster 1')) clusterCounts['Cluster 1']++;
    else if (p.cluster.includes('Cluster 2')) clusterCounts['Cluster 2']++;
  });

  const clusterData = [
    { name: 'Low Risk',      value: clusterCounts['Cluster 0'], color: '#91c5ff' },
    { name: 'Moderate Risk', value: clusterCounts['Cluster 1'], color: '#3a81f6' },
    { name: 'Severe Risk',   value: clusterCounts['Cluster 2'], color: '#1f3fad' },
  ];

  const scoreDistribution = [
    { name: 'Min Risk',  Low: 25, Medium: 0,  High: 0  },
    { name: 'Mild',      Low: 40, Medium: 10, High: 0  },
    { name: 'Moderate',  Low: 15, Medium: 45, High: 5  },
    { name: 'Elevated',  Low: 2,  Medium: 30, High: 35 },
    { name: 'Severe',    Low: 0,  Medium: 5,  High: 50 },
  ];

  const summaryCards = [
    { label: 'Total Patients',  value: totalPatients,          icon: Users,         color: 'text-[#3a81f6]', iconBg: 'bg-[#3a81f6]/10 border-[#3a81f6]/20' },
    { label: 'High Risk',       value: highRiskCount,           icon: AlertTriangle, color: 'text-[#e7000b]', iconBg: 'bg-[#e7000b]/10 border-[#e7000b]/20' },
    { label: 'Best Accuracy',   value: `${bestAccuracy}%`,      icon: TrendingUp,    color: 'text-[#91c5ff]', iconBg: 'bg-[#91c5ff]/10 border-[#91c5ff]/20' },
    { label: 'Active Clusters', value: '3 Groups',              icon: Cpu,           color: 'text-[#2563ef]', iconBg: 'bg-[#2563ef]/10 border-[#2563ef]/20' },
  ];

  return (
    <div className="space-y-6 py-6 overflow-x-hidden">

      {/* ── Summary Cards ─────────────────────────────────────────────── */}
      <motion.div
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 sm:p-5 flex items-center justify-between hover:border-[#2a2a2a] transition-colors duration-200"
            >
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#525252] mb-1">{card.label}</p>
                <p className={`stat-number text-xl sm:text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} strokeWidth={1.5} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Model Comparison + Cluster Donut ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Model comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="lg:col-span-8 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
        >
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white tracking-tight">Model Performance</h3>
            <p className="text-xs text-[#525252] mt-0.5">Accuracy · Precision · Recall on held-out test set</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={modelMetrics} margin={{ left: -10, right: 8, top: 4, bottom: 0 }} barGap={4} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={tickStyle} tickLine={false} axisLine={false} />
                <YAxis tick={tickStyle} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}`} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
                  formatter={(value) => <span style={{ color: '#737373' }}>{value}</span>}
                />
                <Bar dataKey="Accuracy"  fill="#91c5ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Precision" fill="#3a81f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall"    fill="#1f3fad" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cluster donut */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-4 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
        >
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white tracking-tight">Cohort Distribution</h3>
            <p className="text-xs text-[#525252] mt-0.5">K-Means cluster assignment</p>
          </div>
          <div className="h-44 sm:h-52 w-full">
            {totalPatients > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clusterData}
                    cx="50%" cy="48%"
                    innerRadius="52%" outerRadius="76%"
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {clusterData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-[#525252]">No cohort data yet.</p>
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="mt-2 space-y-2">
            {clusterData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-[#737373]">{d.name}</span>
                </div>
                <span className="text-xs font-mono text-[#a1a1a1]">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Feature Importance + Risk Curve ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Feature importance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="lg:col-span-6 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
        >
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white tracking-tight">Feature Importance</h3>
            <p className="text-xs text-[#525252] mt-0.5">Random Forest — top predictive factors</p>
          </div>
          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                layout="vertical"
                data={featureImportance}
                margin={{ left: 4, right: 24, top: 4, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#1a1a1a" />
                <XAxis
                  type="number" domain={[0, 100]}
                  tick={tickStyle} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  dataKey="name" type="category"
                  tick={{ fill: '#737373', fontSize: 11, fontFamily: 'Geist, sans-serif' }}
                  tickLine={false} axisLine={false} width={100}
                />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="importance" fill="#3a81f6" radius={[0, 6, 6, 0]} maxBarSize={16} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk distribution area */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-6 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
        >
          <div className="mb-5">
            <h3 className="text-sm font-bold text-white tracking-tight">Risk Cohort Curves</h3>
            <p className="text-xs text-[#525252] mt-0.5">Patient distribution across risk severity bands</p>
          </div>
          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreDistribution} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  {[['Low', '#91c5ff'], ['Medium', '#3a81f6'], ['High', '#1f3fad']].map(([key, color]) => (
                    <linearGradient key={key} id={`grad${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={tickStyle} tickLine={false} axisLine={false} />
                <YAxis tick={tickStyle} tickLine={false} axisLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#2a2a2a', strokeWidth: 1 }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  formatter={(value) => <span style={{ color: '#737373' }}>{value}</span>}
                />
                <Area type="monotone" dataKey="Low"    stroke="#91c5ff" strokeWidth={2} fill="url(#gradLow)"    />
                <Area type="monotone" dataKey="Medium" stroke="#3a81f6" strokeWidth={2} fill="url(#gradMedium)" />
                <Area type="monotone" dataKey="High"   stroke="#1f3fad" strokeWidth={2} fill="url(#gradHigh)"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Patients Table ─────────────────────────────────────── */}
      {patients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-[#3a81f6]" strokeWidth={1.5} />
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Predictions</h3>
            <span className="ml-auto text-xs font-mono text-[#525252]">{patients.length} records</span>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {['Age', 'Sex', 'Chest Pain', 'BP', 'Cholesterol', 'Max HR', 'Risk', 'Cluster'].map((h) => (
                    <th key={h} className="pb-2.5 pr-4 text-[10px] font-semibold uppercase tracking-wider text-[#525252] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {patients.slice(0, 10).map((p) => {
                  const rm = riskMeta[p.riskLevel] ?? riskMeta.Low;
                  return (
                    <tr key={p.id} className="hover:bg-[#111111] transition-colors">
                      <td className="py-2.5 pr-4 stat-number text-sm text-white">{p.age}</td>
                      <td className="py-2.5 pr-4 text-sm text-[#a1a1a1]">{p.sex}</td>
                      <td className="py-2.5 pr-4 text-sm text-[#a1a1a1] max-w-[120px] truncate">{p.chestPainType}</td>
                      <td className="py-2.5 pr-4 stat-number text-sm text-[#a1a1a1]">{p.restingBp}</td>
                      <td className="py-2.5 pr-4 stat-number text-sm text-[#a1a1a1]">{p.cholesterol}</td>
                      <td className="py-2.5 pr-4 stat-number text-sm text-[#a1a1a1]">{p.maxHeartRate}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`badge text-xs ${rm.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${rm.dot}`} />
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-[#525252] max-w-[140px] truncate">
                        {p.cluster.split('—')[0]?.trim()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {patients.slice(0, 6).map((p) => {
              const rm = riskMeta[p.riskLevel] ?? riskMeta.Low;
              return (
                <div key={p.id} className="bg-[#111111] border border-[#1e1e1e] rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="stat-number text-sm font-semibold text-white">{p.age}y</span>
                      <span className="text-xs text-[#525252]">{p.sex}</span>
                    </div>
                    <span className={`badge text-xs ${rm.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${rm.dot}`} />
                      {p.riskLevel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[#525252]">BP</span>
                      <div className="stat-number text-[#a1a1a1]">{p.restingBp}</div>
                    </div>
                    <div>
                      <span className="text-[#525252]">Chol</span>
                      <div className="stat-number text-[#a1a1a1]">{p.cholesterol}</div>
                    </div>
                    <div>
                      <span className="text-[#525252]">HR</span>
                      <div className="stat-number text-[#a1a1a1]">{p.maxHeartRate}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-[#525252] truncate">{p.cluster.split('—')[0]?.trim()}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
