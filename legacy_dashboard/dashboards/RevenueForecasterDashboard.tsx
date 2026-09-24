import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { REVENUE_FORECAST_DATA } from '../../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Share2,
  FileSpreadsheet,
  Compass,
  AlertTriangle,
} from 'lucide-react';

export const RevenueForecasterDashboard: React.FC = () => {
  const { selectAgent, addToast, navigateTo } = useNexus();

  const categories = [
    { name: 'Apparel & Fashion', share: '38%', gmv: '₹18.4L', growth: '+22%' },
    { name: 'Electronics & Accessories', share: '32%', gmv: '₹15.2L', growth: '+14%' },
    { name: 'Beauty & Wellness', share: '18%', gmv: '₹8.6L', growth: '+28%' },
    { name: 'Home & Lifestyle', share: '12%', gmv: '₹6.0L', growth: '+9%' },
  ];

  return (
    <div className="space-y-6">
      {/* Insight Highlight Card */}
      <div className="p-4 rounded-nexus bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-nexus-blue/20 shadow-nexus-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-nexus-blue text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                Predictive Revenue Forecast
              </span>
              <span className="text-[10px] bg-nexus-blue text-white px-2 py-0.5 rounded-full font-bold">
                +18% Projected
              </span>
            </div>
            <h4 className="text-sm font-semibold text-nexus-navy mt-0.5">
              Projected monthly GMV growth: +18% (target ₹58.4L).
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Friday evening payment friction created a temporary ₹4.2L revenue deficit vs expected run-rate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => selectAgent('opportunity-scout')}
            className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Explore Opportunity</span>
          </button>
          <button
            onClick={() => addToast('Insight Shared', 'Revenue forecast report sent to merchant executive digest.', 'success')}
            className="p-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-600 transition-colors"
            title="Share Insight"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actual vs Forecast Recharts Chart */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-nexus-navy">Daily GMV: Actual vs Model Forecast (₹ Lakhs)</h3>
            <p className="text-xs text-nexus-muted mt-0.5">
              Solid blue is actual GMV; dashed line represents machine learning forecast trajectory
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-nexus-blue" />
              <span className="text-slate-600 font-medium">Actual GMV</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-nexus-purple border-b border-dashed" />
              <span className="text-slate-600 font-medium">Predicted Baseline</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={REVENUE_FORECAST_DATA}>
              <defs>
                <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="L" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E3EAF3',
                  boxShadow: '0 4px 12px rgba(16, 36, 92, 0.08)',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`₹${val} Lakhs`, 'GMV']}
              />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#forecastArea)" />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#0066FF"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0066FF' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#7C5CFC"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#7C5CFC' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown by Category */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-nexus-navy">Product Category Revenue Distribution</h3>
          <button
            onClick={() => navigateTo('reports')}
            className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
          >
            <span>Generate Full Business Report</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <div className="text-xs font-semibold text-nexus-navy truncate">{cat.name}</div>
              <div className="text-lg font-bold text-nexus-navy mt-1">{cat.gmv}</div>
              <div className="flex items-center justify-between text-[11px] mt-1 text-nexus-muted">
                <span>{cat.share} of GMV</span>
                <span className="font-semibold text-nexus-green">{cat.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
